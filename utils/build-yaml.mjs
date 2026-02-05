#!/usr/bin/env node

/**
 * Notes → YAML pack source compiler
 *
 * Reads markdown in src/, consumes frontmatter, and emits pack-ready YAML
 * into packs/_source/<pack>/.
 *
 * Supported document types (frontmatter: type):
 * - journal (default), actor, item, feature, spell, scene, table, adventure
 *
 * Frontmatter fields (common):
 * - name, _id, pack, folder, img, sort, ownership, flags
 * - system: {} (merged into dnd5e system block)
 * - embedded_items/items: [] (embedded documents on actors)
 * - activities/effects/relationships/prototypeToken: pass-through
 *
 * Complex payloads:
 * - frontmatter can include full Foundry document fields; use "document:"
 *   to merge arbitrary top-level data onto the generated document.
 *
 * Usage:
 *   npm run build:yaml            # build all notes
 *   npm run build:yaml -- <file>  # build a specific markdown file
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import log from "fancy-log";

const SRC_ROOT = "src";
const PACK_SOURCE_ROOT = "packs/_source";
const ID_LENGTH = 16;
const ASSET_OUTPUT_ROOT = "assets";

// Load module ID from module.json for consistent referencing
function loadModuleId() {
    try {
        const moduleJson = JSON.parse(fs.readFileSync("module.json", "utf-8"));
        return moduleJson.id || "heirs-of-their-ways";
    } catch {
        return "heirs-of-their-ways";
    }
}

const MODULE_ID = loadModuleId();

const ABSOLUTE_PREFIXES = [
    "modules/",
    "systems/",
    "icons/",
    "worlds/",
    "data/",
    "http://",
    "https://",
];

function isRelativeAssetPath(value) {
    if (!value || typeof value !== "string") return false;
    if (path.isAbsolute(value)) return false;
    const normalized = value.replace(/\\/g, "/");
    return !ABSOLUTE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function toPosixPath(value) {
    return value.replace(/\\/g, "/");
}

function mapAssetOutputPath(sourcePath) {
    const relToSrc = path.relative(SRC_ROOT, sourcePath);
    if (relToSrc.startsWith("..")) {
        return null;
    }
    const parts = relToSrc.split(path.sep);

    if (parts[0] === "module" && parts[1] === "assets") {
        return path.join(...parts.slice(2));
    }

    if (parts[0] === "adventures" && parts[2] === "assets") {
        const adventureName = parts[1];
        return path.join("adventures", adventureName, ...parts.slice(3));
    }

    const assetsIndex = parts.indexOf("assets");
    if (assetsIndex >= 0 && assetsIndex < parts.length - 1) {
        return path.join(...parts.slice(assetsIndex + 1));
    }

    return null;
}

function rewriteAssetPath(rawPath, fileDir) {
    if (!isRelativeAssetPath(rawPath)) return rawPath;
    const resolved = path.resolve(fileDir, rawPath);
    if (!fs.existsSync(resolved)) {
        log.warn(`Asset not found: ${rawPath} (from ${fileDir})`);
        return rawPath;
    }
    const outputRel = mapAssetOutputPath(resolved);
    if (!outputRel) {
        log.warn(`Asset not under src/**/assets: ${rawPath} (from ${fileDir})`);
        return rawPath;
    }
    const modulePath = `modules/${MODULE_ID}/${ASSET_OUTPUT_ROOT}/${toPosixPath(outputRel)}`;
    return modulePath;
}

function rewriteAssetPaths(value, fileDir) {
    if (Array.isArray(value)) {
        return value.map((item) => rewriteAssetPaths(item, fileDir));
    }
    if (!value || typeof value !== "object") return value;

    for (const [key, val] of Object.entries(value)) {
        if (typeof val === "string" && (key === "img" || key === "src" || key === "thumb")) {
            value[key] = rewriteAssetPath(val, fileDir);
            continue;
        }
        value[key] = rewriteAssetPaths(val, fileDir);
    }
    return value;
}

/**
 * Clean up stale generated YAML files before rebuilding.
 * Only removes files with the "# Generated from src/" header.
 */
async function cleanupGeneratedYaml() {
    const sourceRoot = PACK_SOURCE_ROOT;
    if (!fs.existsSync(sourceRoot)) return;

    const packDirs = fs.readdirSync(sourceRoot, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    let removedCount = 0;
    for (const packDir of packDirs) {
        const packPath = path.join(sourceRoot, packDir);
        const files = fs.readdirSync(packPath, { withFileTypes: true })
            .filter(f => f.isFile() && f.name.endsWith(".yaml"));

        for (const file of files) {
            const filePath = path.join(packPath, file.name);
            try {
                const content = fs.readFileSync(filePath, "utf-8");
                // Only remove files that were generated from src
                if (content.startsWith("# Generated from src/")) {
                    fs.rmSync(filePath);
                    removedCount++;
                }
            } catch {
                // Skip files that can't be read
            }
        }
    }

    if (removedCount > 0) {
        log.info(`Cleaned up ${removedCount} stale generated YAML file(s)`);
    }
}

const SKIP_PATTERNS = [/-template\.md$/, /README\.md$/];

const DOC_MAP = {
    journal: {
        pack: "heirs-journals",
        document: "JournalEntry",
        subtype: "base",
        idPrefix: "Jrnl",
    },
    actor: {
        pack: "heirs-actors",
        document: "Actor",
        subtype: "npc",
        idPrefix: "Actr",
    },
    item: {
        pack: "heirs-items",
        document: "Item",
        subtype: "loot",
        idPrefix: "Item",
    },
    feature: {
        pack: "heirs-features",
        document: "Item",
        subtype: "feat",
        idPrefix: "Feat",
    },
    spell: {
        pack: "heirs-features",
        document: "Item",
        subtype: "spell",
        idPrefix: "Spll",
    },
    scene: {
        pack: "heirs-scenes",
        document: "Scene",
        subtype: "scene",
        idPrefix: "Scne",
    },
    table: {
        pack: "heirs-tables",
        document: "RollTable",
        subtype: "table",
        idPrefix: "Tabl",
    },
    adventure: {
        pack: "heirs-journals",
        document: "JournalEntry",
        subtype: "base",
        idPrefix: "Jrnl",
    },
};

const KEY_PREFIX = {
    Actor: "!actors!",
    Item: "!items!",
    JournalEntry: "!journal!",
    Scene: "!scenes!",
    RollTable: "!tables!",
};

function normalizeDocType(value) {
    if (!value) return "journal";
    const key = String(value).trim().toLowerCase();
    if (DOC_MAP[key]) return key;
    // aliases - including plural forms of directory names
    if (["npc", "character", "actors"].includes(key)) return "actor";
    if (["journalentry", "journal-entry", "journals"].includes(key)) return "journal";
    if (["rolltable", "roll-table", "tables"].includes(key)) return "table";
    if (["items"].includes(key)) return "item";
    if (["features", "spells"].includes(key)) return "feature";
    if (["scenes"].includes(key)) return "scene";
    if (["adventures"].includes(key)) return "adventure";
    return "journal";
}

function generateId(name, prefix = "", index = null) {
    const suffix = index !== null ? String(index).padStart(2, "0") : "";
    const cleaned = (prefix + name + suffix)
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, ID_LENGTH);
    return cleaned.padEnd(ID_LENGTH, "0");
}

function validateId(id, name, prefix = "") {
    if (id && /^[a-zA-Z0-9]{16}$/.test(id)) return id;
    if (id) {
        const cleaned = id.replace(/[^a-zA-Z0-9]/g, "");
        if (cleaned.length >= ID_LENGTH) return cleaned.substring(0, ID_LENGTH);
        if (cleaned.length > 0) return cleaned.padEnd(ID_LENGTH, "0");
    }
    return generateId(name, prefix);
}

function shouldSkip(relativePath) {
    return SKIP_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function titleFromSegment(segment) {
    if (!segment) return null;
    return segment.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function titleCase(str) {
    if (!str) return str;
    return str
        .split(/[\s-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function deriveContext(relativePath, frontmatter) {
    const segments = relativePath.split(path.sep);
    const isUnderModule = segments[0] === "module";
    const isUnderAdventures = segments[0] === "adventures";
    const frontmatterType = frontmatter.document || frontmatter.doc || frontmatter.type;

    // Determine document type and folder based on location
    let docType;
    let folderName;
    let folderId;

    if (isUnderAdventures && segments.length >= 2) {
        // Files under adventures/<adventure-name>/
        // Adventure folder name becomes the folder for all content
        const adventureName = segments[1]; // e.g., "coral-veil"
        folderName = frontmatter.folderName || titleCase(adventureName);
        folderId = frontmatter.folder || validateId(adventureName, "");

        if (frontmatterType) {
            // Explicit type in frontmatter determines the pack
            docType = normalizeDocType(frontmatterType);
        } else if (segments.length >= 3) {
            const category = segments[2];
            const filename = path.basename(category, ".md").toLowerCase();
            if (segments.length === 3 && ["overview", "adventure"].includes(filename)) {
                docType = "adventure";
            } else {
                docType = normalizeDocType(category);
            }
        } else {
            // Default to journal for adventure content without explicit type
            docType = "journal";
        }
    } else if (isUnderModule && segments.length >= 2) {
        const category = segments[1];
        if (frontmatterType) {
            docType = normalizeDocType(frontmatterType);
        } else {
            const normalized = normalizeDocType(category);
            docType = normalized || "journal";
        }

        const folderSegment = segments.length >= 4 ? segments[segments.length - 2] : null;
        folderName = frontmatter.folderName || titleFromSegment(folderSegment);
        folderId = !frontmatter.folder && folderName
            ? validateId(folderName, "")
            : frontmatter.folder || null;
    } else {
        // Top-level directories (actors/, items/, journals/, features/, etc.)
        // Use explicit frontmatter type, or default to journal
        docType = frontmatterType ? normalizeDocType(frontmatterType) : "journal";

        const folderSegment = segments[1];
        folderName = frontmatter.folderName || titleFromSegment(folderSegment);
        folderId = !frontmatter.folder && folderName
            ? validateId(folderName, "")
            : frontmatter.folder || null;
    }

    return { docType, folderName, folderId };
}

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = content.match(frontmatterRegex);
    if (match) {
        try {
            const frontmatter = yaml.load(match[1]) || {};
            const body = content.slice(match[0].length);
            return { frontmatter, body };
        } catch (e) {
            log.warn(`Failed to parse frontmatter: ${e.message}`);
        }
    }
    return { frontmatter: {}, body: content };
}

function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
}

function splitIntoPages(content) {
    // Strip leading whitespace and H1 heading (which becomes the document name)
    const withoutH1 = content.replace(/^\s*#\s+.+\n*/, "").trim();
    const h2Regex = /^##\s+(.+)$/gm;
    const pages = [];
    let match;
    const matches = [];
    while ((match = h2Regex.exec(withoutH1)) !== null) {
        matches.push({
            index: match.index,
            title: match[1].trim(),
            fullMatch: match[0],
        });
    }

    if (matches.length === 0) {
        const trimmed = withoutH1.trim();
        if (trimmed) pages.push({ title: "Overview", content: trimmed });
        return pages;
    }

    if (matches[0].index > 0) {
        const beforeFirst = withoutH1.substring(0, matches[0].index).trim();
        const firstH2Title = matches[0].title.toLowerCase();
        if (beforeFirst && firstH2Title !== "overview") {
            pages.push({ title: "Introduction", content: beforeFirst });
        } else if (beforeFirst) {
            matches[0].prependContent = beforeFirst;
        }
    }

    for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const next = matches[i + 1];
        const start = current.index + current.fullMatch.length;
        const end = next ? next.index : withoutH1.length;
        let pageContent = withoutH1.substring(start, end).trim();
        if (current.prependContent)
            pageContent = `${current.prependContent}\n\n${pageContent}`;
        if (pageContent)
            pages.push({ title: current.title, content: pageContent });
    }

    return pages;
}

function protectEnrichers(markdown) {
    const placeholders = { enricher: [], atref: [], ampref: [] };
    let html = markdown;
    html = html.replace(/\[\[([^\]]+)\]\]/g, (m) => {
        const placeholder = `<<ENRICHER:${placeholders.enricher.length}>>`;
        placeholders.enricher.push(m);
        return placeholder;
    });
    html = html.replace(
        /@(UUID|Embed|Check|Damage|Save|Attack|Item|Reference)\[[^\]]+\]/g,
        (m) => {
            const placeholder = `<<ATREF:${placeholders.atref.length}>>`;
            placeholders.atref.push(m);
            return placeholder;
        },
    );
    html = html.replace(/&Reference\[[^\]]+\]/g, (m) => {
        const placeholder = `<<AMPREF:${placeholders.ampref.length}>>`;
        placeholders.ampref.push(m);
        return placeholder;
    });
    return { html, placeholders };
}

function restoreEnrichers(html, placeholders) {
    placeholders.enricher.forEach((original, i) => {
        html = html.replace(`<<ENRICHER:${i}>>`, original);
    });
    placeholders.atref.forEach((original, i) => {
        html = html.replace(`<<ATREF:${i}>>`, original);
    });
    placeholders.ampref.forEach((original, i) => {
        html = html.replace(`<<AMPREF:${i}>>`, original);
    });
    return html;
}

function convertInlineMarkdown(text, fileDir) {
    let t = text;
    t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, rawPath) => {
        const trimmed = rawPath.trim();
        let src = trimmed;
        let title = "";
        const titleMatch = trimmed.match(/^(\S+)\s+["'](.+)["']$/);
        if (titleMatch) {
            src = titleMatch[1];
            title = titleMatch[2];
        }
        const rewritten = fileDir ? rewriteAssetPath(src, fileDir) : src;
        const titleAttr = title ? ` title="${title}"` : "";
        return `<img src="${rewritten}" alt="${alt}"${titleAttr}>`;
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    t = t.replace(/_([^_]+)_/g, "<em>$1</em>");
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return t;
}

function convertTables(html, fileDir) {
    const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
    return html.replace(tableRegex, (match, headerRow, bodyRows) => {
        const headers = headerRow
            .split("|")
            .map((h) => h.trim())
            .filter(Boolean);
        const rows = bodyRows
            .trim()
            .split("\n")
            .map((row) =>
                row
                    .split("|")
                    .map((cell) => cell.trim())
                    .filter((cell) => cell !== ""),
            );
        let table = "<table>\n<thead><tr>";
        headers.forEach(
            (h) => (table += `<th>${convertInlineMarkdown(h, fileDir)}</th>`),
        );
        table += "</tr></thead>\n<tbody>\n";
        rows.forEach((row) => {
            table += "<tr>";
            row.forEach(
                (cell) =>
                    (table += `<td>${convertInlineMarkdown(cell, fileDir)}</td>`),
            );
            table += "</tr>\n";
        });
        table += "</tbody>\n</table>\n";
        return table;
    });
}

function markdownToHtml(markdown, fileDir) {
    const { html: protectedHtml, placeholders } = protectEnrichers(markdown);
    let html = protectedHtml;

    html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
    html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
    html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^---+$/gm, "<hr>");

    html = html.replace(/(?:^>\s*.+$\n?)+/gm, (match) => {
        const content = match
            .split("\n")
            .map((line) => line.replace(/^>\s*/, ""))
            .join("\n")
            .trim();
        const innerHtml = convertInlineMarkdown(content, fileDir);
        return `<div class="dnd5e2 chat-card"><blockquote>\n<p><em>${innerHtml}</em></p>\n</blockquote></div>\n`;
    });

    html = convertTables(html, fileDir);

    html = html.replace(
        /```([a-zA-Z0-9-]*)\n([\s\S]*?)```/g,
        (match, lang, code) => {
            const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const cls = lang ? ` class="language-${lang}"` : "";
            return `<pre><code${cls}>${escaped}</code></pre>`;
        },
    );

    html = html.replace(/(?:^[-*]\s+.+$\n?)+/gm, (match) => {
        const items = match
            .trim()
            .split("\n")
            .map(
                (line) =>
                    `<li>${convertInlineMarkdown(line.replace(/^[-*]\s+/, ""), fileDir)}</li>`,
            )
            .join("\n");
        return `<ul>\n${items}\n</ul>\n`;
    });

    html = html.replace(/(?:^\d+\.\s+.+$\n?)+/gm, (match) => {
        const items = match
            .trim()
            .split("\n")
            .map(
                (line) =>
                    `<li>${convertInlineMarkdown(line.replace(/^\d+\.\s+/, ""), fileDir)}</li>`,
            )
            .join("\n");
        return `<ol>\n${items}\n</ol>\n`;
    });

    html = html
        .split("\n\n")
        .map((block) => {
            const b = block.trim();
            if (!b) return "";
            if (b.startsWith("<")) return b;
            return `<p>${convertInlineMarkdown(b, fileDir)}</p>`;
        })
        .join("\n\n");

    return restoreEnrichers(html.trim(), placeholders);
}

function deepMerge(target, ...sources) {
    for (const source of sources) {
        if (!source || typeof source !== "object") continue;
        for (const [key, value] of Object.entries(source)) {
            if (Array.isArray(value)) {
                target[key] = Array.isArray(target[key])
                    ? [...target[key], ...value]
                    : [...value];
            } else if (value && typeof value === "object") {
                target[key] = deepMerge(
                    target[key] ? { ...target[key] } : {},
                    value,
                );
            } else {
                target[key] = value;
            }
        }
    }
    return target;
}

function parseSections(markdown) {
    const sectionRegex = /^##\s+(.+)$/gm;
    const sections = [];
    let main = markdown;
    const matches = [];
    let m;
    while ((m = sectionRegex.exec(markdown)) !== null) {
        matches.push({ index: m.index, title: m[1].trim(), full: m[0] });
    }
    if (!matches.length) return { main, sections };
    // content before first H2
    main = markdown.slice(0, matches[0].index).trim();
    for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index + matches[i].full.length;
        const end =
            i + 1 < matches.length ? matches[i + 1].index : markdown.length;
        const content = markdown.slice(start, end).trim();

        const titleRaw = matches[i].title;
        const classMatch = titleRaw.match(/^(.*?)\s*\{\.\s*([^}]+)\s*\}\s*$/);
        const title = classMatch ? classMatch[1].trim() : titleRaw.trim();
        const path = classMatch
            ? classMatch[2].trim().replace(/^\./, "")
            : null;

        const key = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        sections.push({ key, path, content });
    }
    return { main, sections };
}

function setDeep(target, pathArr, value) {
    let ref = target;
    for (let i = 0; i < pathArr.length - 1; i++) {
        const key = pathArr[i];
        if (!ref[key] || typeof ref[key] !== "object") ref[key] = {};
        ref = ref[key];
    }
    ref[pathArr[pathArr.length - 1]] = value;
}

function buildJournalDocument(cfg, frontmatter, body, name, now, fileDir) {
    const pages = splitIntoPages(body);
    if (pages.length === 0) return null;
    const journalId = validateId(frontmatter._id, name, cfg.idPrefix);
    return {
        name,
        type: "base",
        _id: journalId,
        folder: frontmatter.folder || null,
        sort: frontmatter.sort || 100000,
        ownership: { default: frontmatter.ownership ?? 0 },
        flags: frontmatter.flags || {},
        pages: pages.map((page, index) => {
            const pageId = generateId(page.title, "Pg", index);
            return {
                name: page.title,
                type: "text",
                _id: pageId,
                _key: `!journal.pages!${journalId}.${pageId}`,
                sort: (index + 1) * 100000,
                ownership: { default: -1 },
                title: { show: true, level: 1 },
                text: {
                    content: markdownToHtml(page.content, fileDir),
                    format: 1,
                    markdown: "",
                },
                image: {},
                video: { controls: true, volume: 0.5 },
                src: null,
                system: {},
                flags: {},
            };
        }),
        _stats: {
            systemId: "dnd5e",
            systemVersion: "5.0.0",
            coreVersion: "13.344",
            createdTime: now,
            modifiedTime: now,
            lastModifiedBy: "notes-builder",
        },
        _key: `${KEY_PREFIX[cfg.document] || "!journal!"}${journalId}`,
    };
}

function buildNonJournalDocument(cfg, frontmatter, body, name, now, fileDir) {
    const { main, sections } = parseSections(body);
    const html = main.trim() ? markdownToHtml(main.trim(), fileDir) : "";
    const docId = validateId(frontmatter._id, name, cfg.idPrefix);
    const base = {
        _id: docId,
        name,
        type:
            frontmatter.subtype ||
            frontmatter.actorType ||
            frontmatter.itemType ||
            cfg.subtype,
        img: frontmatter.img || "",
        folder: frontmatter.folder || null,
        sort: frontmatter.sort || 100000,
        ownership: { default: frontmatter.ownership ?? 0 },
        flags: frontmatter.flags || {},
        system: {},
        _stats: {
            systemId: "dnd5e",
            systemVersion: "5.0.0",
            coreVersion: "13.344",
            createdTime: now,
            modifiedTime: now,
            lastModifiedBy: "notes-builder",
        },
        _key: `${KEY_PREFIX[cfg.document] || "!items!"}${docId}`,
    };

    const system = deepMerge({}, frontmatter.system || {});
    if (html) {
        if (cfg.document === "Actor") {
            if (!system.details?.biography?.value) {
                system.details = deepMerge({}, system.details || {}, {
                    biography: { value: html },
                });
            }
            if (!system.description?.value) {
                system.description = deepMerge({}, system.description || {}, {
                    value: html,
                });
            }
        } else if (cfg.document === "Item") {
            if (!system.description?.value) {
                system.description = deepMerge({}, system.description || {}, {
                    value: html,
                });
            }
        }
    }

    base.system = system;

    if (frontmatter.document || frontmatter.foundry) {
        deepMerge(base, frontmatter.document || frontmatter.foundry);
    }

    const sectionMap = {
        description: ["system", "description", "value"],
        "chat": ["system", "description", "chat"],
        "chat-description": ["system", "description", "chat"],
        unidentified: ["system", "unidentified", "description"],
        "unidentified-description": ["system", "unidentified", "description"],
        biography: ["system", "details", "biography", "value"],
        "biography-public": ["system", "details", "biography", "public"],
        "public-biography": ["system", "details", "biography", "public"],
    };
    for (const section of sections) {
        const htmlContent = section.content.trim()
            ? markdownToHtml(section.content.trim(), fileDir)
            : "";
        if (section.path) {
            const pathArr = section.path.split(".");
            setDeep(base, pathArr, htmlContent);
            continue;
        }
        const mapped = sectionMap[section.key];
        if (mapped) {
            setDeep(base, mapped, htmlContent);
        }
    }

    if (cfg.document === "Actor") {
        base.prototypeToken = frontmatter.prototypeToken || {
            texture: { src: base.img || "" },
        };
        base.items = frontmatter.embedded_items || frontmatter.items || [];
        base.effects = frontmatter.effects || [];
    }

    if (cfg.document === "Item") {
        base.effects = frontmatter.effects || [];
        if (frontmatter.activities && !base.system.activities) {
            base.system.activities = frontmatter.activities;
        }
    }

    if (cfg.document === "RollTable" && frontmatter.results) {
        base.results = frontmatter.results;
        base.formula = frontmatter.formula || "";
        base.replacement = frontmatter.replacement ?? true;
        base.displayRoll = frontmatter.displayRoll ?? true;
    }

    if (cfg.document === "Scene") {
        if (frontmatter.tokens) base.tokens = frontmatter.tokens;
        if (frontmatter.lights) base.lights = frontmatter.lights;
        if (frontmatter.walls) base.walls = frontmatter.walls;
    }

    if (cfg.document === "Adventure") {
        if (frontmatter.adventure) base.adventure = frontmatter.adventure;
    }

    return base;
}

async function findMarkdownFiles(dir, baseDir = dir) {
    const files = [];
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);
        if (entry.isDirectory()) {
            files.push(...(await findMarkdownFiles(fullPath, baseDir)));
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            if (!shouldSkip(relativePath)) files.push(fullPath);
        }
    }
    return files;
}

function slugifyOutputName(relativePath) {
    return relativePath.replace(/[\\/]/g, "-").replace(/\.md$/, ".yaml");
}

async function deriveAdventureMetadata(adventureFile) {
    const adventureDir = path.dirname(adventureFile);
    const files = (await findMarkdownFiles(adventureDir, adventureDir)).sort();

    const contents = [];
    let primaryJournal = null;

    for (const file of files) {
        if (path.resolve(file) === path.resolve(adventureFile)) continue;

        const relToNotes = path.relative(SRC_ROOT, file);
        const content = await fsp.readFile(file, "utf-8");
        const { frontmatter, body } = parseFrontmatter(content);
        const context = deriveContext(relToNotes, frontmatter);
        const docType = context.docType;
        if (docType === "adventure") continue;

        const cfg = DOC_MAP[docType] || DOC_MAP.journal;
        const effectiveFrontmatter = {
            ...frontmatter,
            folder: frontmatter.folder ?? context.folderId,
        };
        const name =
            effectiveFrontmatter.name ||
            extractTitle(body) ||
            path.basename(file, ".md");
        const docId = validateId(effectiveFrontmatter._id, name, cfg.idPrefix);
        const pack = effectiveFrontmatter.pack || cfg.pack;
        const entry = {
            uuid: `Compendium.${MODULE_ID}.${pack}.${docId}`,
            type: cfg.document,
            name,
        };

        contents.push(entry);
        if (!primaryJournal && cfg.document === "JournalEntry") {
            primaryJournal = entry;
        }
    }

    contents.sort((a, b) => a.name.localeCompare(b.name, "en"));

    if (!contents.length) return null;

    return {
        journal: primaryJournal?.uuid || contents[0].uuid,
        contents,
    };
}

async function processFile(filePath, relativePath, folderRegistry) {
    const content = await fsp.readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    if (
        frontmatter?.journal === false ||
        frontmatter?.build === false ||
        frontmatter?.compile === false
    ) {
        return null;
    }
    const { docType, folderName, folderId } = deriveContext(
        relativePath,
        frontmatter,
    );
    const cfg = DOC_MAP[docType] || DOC_MAP.journal;

    const effectiveFrontmatter = {
        ...frontmatter,
        folder: frontmatter.folder ?? folderId,
    };

    const title = extractTitle(body);
    const name =
        effectiveFrontmatter.name || title || path.basename(filePath, ".md");
    const now = Date.now();

    // Strip redundant H1 heading when name is defined in frontmatter
    let processedBody = body;
    if (effectiveFrontmatter.name) {
        processedBody = body.replace(/^\s*#\s+.+\n*/, "").trim();
    }

    const adventureData =
        cfg.document === "Adventure"
            ? effectiveFrontmatter.adventure ||
              (await deriveAdventureMetadata(filePath))
            : null;
    let document;

    const fileDir = path.dirname(filePath);

    if (cfg.document === "JournalEntry") {
        document = buildJournalDocument(
            cfg,
            effectiveFrontmatter,
            processedBody,
            name,
            now,
            fileDir,
        );
    } else {
        document = buildNonJournalDocument(
            cfg,
            effectiveFrontmatter,
            processedBody,
            name,
            now,
            fileDir,
        );
    }

    if (!document) return null;
    rewriteAssetPaths(document, fileDir);
    if (cfg.document === "Adventure" && adventureData) {
        document.adventure = adventureData;
    }

    const outputName = slugifyOutputName(relativePath);
    const pack = effectiveFrontmatter.pack || cfg.pack;

    if (folderName && effectiveFrontmatter.folder === folderId && pack) {
        const packFolders = folderRegistry[pack] || (folderRegistry[pack] = {});
        if (!packFolders[folderId]) {
            packFolders[folderId] = { name: folderName, type: cfg.document };
        }
    }

    return { document, outputName, pack };
}

async function writeFolders(folderRegistry) {
    for (const [pack, folders] of Object.entries(folderRegistry)) {
        const packDir = path.join(PACK_SOURCE_ROOT, pack);
        await fsp.mkdir(packDir, { recursive: true });
        for (const [folderId, meta] of Object.entries(folders)) {
            const folderDoc = {
                name: meta.name,
                type: meta.type,
                _id: folderId,
                description: "",
                folder: null,
                sorting: "a",
                sort: 100000,
                color: meta.color ?? null,
                flags: {},
                _key: `!folders!${folderId}`,
            };
            const yamlContent = yaml.dump(folderDoc, {
                lineWidth: 120,
                noRefs: true,
                quotingType: '"',
                forceQuotes: false,
            });
            const header = `# Generated folder for ${meta.name}\n# Auto-created from folder path in src\n`;
            const folderPath = path.join(packDir, `_folder-${folderId}.yaml`);
            await fsp.writeFile(folderPath, header + yamlContent);
        }
    }
}

async function buildNotes(specificFile = null) {
    let files;
    if (specificFile) {
        const fullPath = path.resolve(specificFile);
        if (!fs.existsSync(fullPath)) {
            log.error(`File not found: ${specificFile}`);
            return;
        }
        files = [fullPath];
    } else {
        // Clean up stale generated YAML before full rebuild
        await cleanupGeneratedYaml();
        files = await findMarkdownFiles(SRC_ROOT);
    }

    if (!files.length) {
        log.warn("No markdown files found to process");
        return;
    }

    log.info(`Processing ${files.length} markdown file(s)...`);
    let successCount = 0;
    const folderRegistry = {};

    for (const file of files) {
        const relativePath = path.relative(SRC_ROOT, file);
        log.info(`Processing: ${relativePath}`);
        try {
            const result = await processFile(
                file,
                relativePath,
                folderRegistry,
            );
            if (!result) continue;

            const packDir = path.join(PACK_SOURCE_ROOT, result.pack);
            await fsp.mkdir(packDir, { recursive: true });
            const outputPath = path.join(packDir, result.outputName);

            const yamlContent = yaml.dump(result.document, {
                lineWidth: 120,
                noRefs: true,
                quotingType: '"',
                forceQuotes: false,
            });
            const header = `# Generated from ${path.relative(
                process.cwd(),
                file,
            )}\n# Do not edit directly - edit the source markdown file instead\n`;
            await fsp.writeFile(outputPath, header + yamlContent);

            log.info(
                `  ✓ Created: ${path.relative(PACK_SOURCE_ROOT, outputPath)}`,
            );
            successCount++;
        } catch (err) {
            log.error(`  ✗ Failed: ${err.message}`);
        }
    }

    await writeFolders(folderRegistry);

    log.info(
        `\nNote build complete: ${successCount}/${files.length} files processed`,
    );
}

const args = process.argv.slice(2);
const specificFile = args[0];
await buildNotes(specificFile);
