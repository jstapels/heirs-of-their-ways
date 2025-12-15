#!/usr/bin/env node

/**
 * Notes → YAML pack source compiler
 *
 * Reads markdown in campaign-notes/, consumes frontmatter + optional fenced
 * foundry-yaml blocks, and emits pack-ready YAML into packs/_source/<pack>/.
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
 * - fenced ```foundry-yaml``` blocks are parsed and deep-merged into the
 *   generated document (visible in markdown previews).
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

const CAMPAIGN_NOTES_DIR = "campaign-notes";
const PACK_SOURCE_ROOT = "packs/_source";
const ID_LENGTH = 16;

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
        pack: "heirs-adventures",
        document: "Adventure",
        subtype: "adventure",
        idPrefix: "Advn",
    },
};

const KEY_PREFIX = {
    Actor: "!actors!",
    Item: "!items!",
    JournalEntry: "!journal!",
    Scene: "!scenes!",
    RollTable: "!tables!",
    Adventure: "!adventure!",
};

function normalizeDocType(value) {
    if (!value) return "journal";
    const key = String(value).trim().toLowerCase();
    if (DOC_MAP[key]) return key;
    // aliases
    if (["npc", "character"].includes(key)) return "actor";
    if (["journalentry", "journal-entry"].includes(key)) return "journal";
    if (["rolltable", "roll-table"].includes(key)) return "table";
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

function deriveContext(relativePath, frontmatter) {
    const segments = relativePath.split(path.sep);
    const typeFromPath = normalizeDocType(segments[0]);
    const docType = normalizeDocType(
        frontmatter.document ||
            frontmatter.doc ||
            frontmatter.type ||
            typeFromPath,
    );

    const folderSegment = segments[1];
    const folderName =
        frontmatter.folderName || titleFromSegment(folderSegment);
    const folderId =
        !frontmatter.folder && folderName
            ? validateId(folderName, "Fldr")
            : frontmatter.folder || null;

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
    const withoutH1 = content.replace(/^#\s+.+\n+/, "");
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

function convertInlineMarkdown(text) {
    let t = text;
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    t = t.replace(/_([^_]+)_/g, "<em>$1</em>");
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return t;
}

function convertTables(html) {
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
            (h) => (table += `<th>${convertInlineMarkdown(h)}</th>`),
        );
        table += "</tr></thead>\n<tbody>\n";
        rows.forEach((row) => {
            table += "<tr>";
            row.forEach(
                (cell) => (table += `<td>${convertInlineMarkdown(cell)}</td>`),
            );
            table += "</tr>\n";
        });
        table += "</tbody>\n</table>\n";
        return table;
    });
}

function markdownToHtml(markdown) {
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
        const innerHtml = convertInlineMarkdown(content);
        return `<div class="dnd5e2 chat-card"><blockquote>\n<p><em>${innerHtml}</em></p>\n</blockquote></div>\n`;
    });

    html = convertTables(html);

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
                    `<li>${convertInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`,
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
                    `<li>${convertInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`,
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
            return `<p>${convertInlineMarkdown(b)}</p>`;
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

function extractFoundryBlocks(markdown) {
    const blocks = [];
    const regex = /```foundry-yaml\n([\s\S]*?)```/g;
    let match;
    let cleaned = markdown;
    while ((match = regex.exec(markdown)) !== null) {
        try {
            const parsed = yaml.load(match[1]) || {};
            if (parsed && typeof parsed === "object") blocks.push(parsed);
        } catch (err) {
            log.warn(`Failed to parse foundry-yaml block: ${err.message}`);
        }
        cleaned = cleaned.replace(match[0], "");
    }
    return { blocks, cleaned };
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

function buildJournalDocument(cfg, frontmatter, body, name, now) {
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
                    content: markdownToHtml(page.content),
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

function buildNonJournalDocument(cfg, frontmatter, body, name, now) {
    const { main, sections } = parseSections(body);
    const html = main.trim() ? markdownToHtml(main.trim()) : "";
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
        system.description = deepMerge({}, system.description || {}, {
            value: html,
        });
    }
    const sectionMap = {
        unidentified: ["system", "unidentified", "description"],
        "unidentified-description": ["system", "unidentified", "description"],
    };
    for (const section of sections) {
        const htmlContent = section.content.trim()
            ? markdownToHtml(section.content.trim())
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
    base.system = system;

    if (cfg.document === "Actor") {
        base.prototypeToken = frontmatter.prototypeToken || {
            texture: { src: base.img || "" },
        };
        base.items = frontmatter.embedded_items || frontmatter.items || [];
        base.effects = frontmatter.effects || [];
    }

    if (cfg.document === "Item") {
        base.effects = frontmatter.effects || [];
        if (frontmatter.activities) base.activities = frontmatter.activities;
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

function mergeFoundryBlocks(doc, blocks) {
    if (!blocks.length) return doc;
    return deepMerge({}, doc, ...blocks);
}

async function processFile(filePath, relativePath, folderRegistry) {
    const content = await fsp.readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
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

    const { blocks: foundryBlocks, cleaned } = extractFoundryBlocks(body);
    let document;

    if (cfg.document === "JournalEntry") {
        document = buildJournalDocument(
            cfg,
            effectiveFrontmatter,
            cleaned,
            name,
            now,
        );
    } else {
        document = buildNonJournalDocument(
            cfg,
            effectiveFrontmatter,
            cleaned,
            name,
            now,
        );
    }

    if (!document) return null;
    document = mergeFoundryBlocks(document, foundryBlocks);

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
            const header = `# Generated folder for ${meta.name}\n# Auto-created from folder path in campaign-notes\n`;
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
        files = await findMarkdownFiles(CAMPAIGN_NOTES_DIR);
    }

    if (!files.length) {
        log.warn("No markdown files found to process");
        return;
    }

    log.info(`Processing ${files.length} markdown file(s)...`);
    let successCount = 0;
    const folderRegistry = {};

    for (const file of files) {
        const relativePath = path.relative(CAMPAIGN_NOTES_DIR, file);
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
