#!/usr/bin/env node

/**
 * Journal Builder for Heirs of Their Ways
 *
 * Converts markdown files from campaign-notes/ into FoundryVTT journal YAML files.
 *
 * Features:
 * - YAML frontmatter for journal metadata (_id, name, folder, sort, ownership)
 * - H2 headers split content into separate journal pages
 * - Preserves FoundryVTT enrichers ([[/check]], [[/damage]], @UUID, etc.)
 * - Converts markdown tables, lists, blockquotes to HTML
 *
 * Usage:
 *   npm run build:journals           - Build all journals
 *   npm run build:journals -- <file> - Build specific file
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import log from "fancy-log";
import yaml from "js-yaml";

// Constants
const CAMPAIGN_NOTES_DIR = "campaign-notes";
const JOURNAL_OUTPUT_DIR = "packs/_source/heirs-journals";
const ID_LENGTH = 16;

// Files/patterns to skip
const SKIP_PATTERNS = [
  /-template\.md$/,
  /README\.md$/,
  /^sessions\//,  // Session notes are for DM reference, not player journals
];

/**
 * Generate a valid 16-character alphanumeric ID
 * @param {string} name - The name to generate an ID from
 * @param {string} prefix - Prefix to add (e.g., "Jrnl", "Pg")
 * @param {number} index - Optional index for uniqueness
 */
function generateId(name, prefix = "", index = null) {
  const indexSuffix = index !== null ? String(index).padStart(2, "0") : "";
  const cleaned = (prefix + name + indexSuffix)
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, ID_LENGTH);
  return cleaned.padEnd(ID_LENGTH, "0");
}

/**
 * Parse YAML frontmatter from markdown content
 */
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

/**
 * Extract the H1 title from markdown (first # heading)
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Split markdown content into pages by H2 headers
 * Returns array of { title, content } objects
 */
function splitIntoPages(content) {
  // Remove H1 title from content (it becomes the journal name)
  const withoutH1 = content.replace(/^#\s+.+\n+/, "");

  // Split on H2 headers
  const h2Regex = /^##\s+(.+)$/gm;
  const pages = [];
  let lastIndex = 0;
  let lastTitle = "Overview";
  let match;

  // Find all H2 headers
  const matches = [];
  while ((match = h2Regex.exec(withoutH1)) !== null) {
    matches.push({ index: match.index, title: match[1].trim(), fullMatch: match[0] });
  }

  if (matches.length === 0) {
    // No H2 headers, entire content is one page
    const trimmed = withoutH1.trim();
    if (trimmed) {
      pages.push({ title: "Overview", content: trimmed });
    }
    return pages;
  }

  // Extract content before first H2 (if any)
  // Only add as "Intro" if there's substantial content and first H2 isn't "Overview"
  if (matches[0].index > 0) {
    const beforeFirst = withoutH1.substring(0, matches[0].index).trim();
    const firstH2Title = matches[0].title.toLowerCase();
    if (beforeFirst && firstH2Title !== "overview") {
      pages.push({ title: "Introduction", content: beforeFirst });
    } else if (beforeFirst) {
      // Prepend content to the first H2 page
      matches[0].prependContent = beforeFirst;
    }
  }

  // Extract content between H2 headers
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = current.index + current.fullMatch.length;
    const end = next ? next.index : withoutH1.length;
    let pageContent = withoutH1.substring(start, end).trim();

    // Prepend any content from before the first H2
    if (current.prependContent) {
      pageContent = current.prependContent + "\n\n" + pageContent;
    }

    if (pageContent) {
      pages.push({ title: current.title, content: pageContent });
    }
  }

  return pages;
}

/**
 * Convert markdown to HTML
 * Preserves FoundryVTT enrichers and converts standard markdown elements
 */
function markdownToHtml(markdown) {
  let html = markdown;

  // Protect FoundryVTT enrichers from processing
  const enricherPlaceholders = [];
  html = html.replace(/\[\[([^\]]+)\]\]/g, (match) => {
    const placeholder = `__ENRICHER_${enricherPlaceholders.length}__`;
    enricherPlaceholders.push(match);
    return placeholder;
  });

  // Protect @UUID and similar @ references
  const atRefPlaceholders = [];
  html = html.replace(/@(UUID|Embed|Check|Damage|Save|Attack|Item|Reference)\[[^\]]+\]/g, (match) => {
    const placeholder = `__ATREF_${atRefPlaceholders.length}__`;
    atRefPlaceholders.push(match);
    return placeholder;
  });

  // Protect &Reference links
  const ampRefPlaceholders = [];
  html = html.replace(/&Reference\[[^\]]+\]/g, (match) => {
    const placeholder = `__AMPREF_${ampRefPlaceholders.length}__`;
    ampRefPlaceholders.push(match);
    return placeholder;
  });

  // Convert headers (H3-H6, H1-H2 are handled separately)
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");

  // Convert horizontal rules
  html = html.replace(/^---+$/gm, "<hr>");

  // Convert blockquotes (multi-line support)
  html = html.replace(/(?:^>\s*.+$\n?)+/gm, (match) => {
    const content = match
      .split("\n")
      .map(line => line.replace(/^>\s*/, ""))
      .join("\n")
      .trim();
    const innerHtml = convertInlineMarkdown(content);
    return `<div class="dnd5e2 chat-card"><blockquote>\n<p><em>${innerHtml}</em></p>\n</blockquote></div>\n`;
  });

  // Convert tables
  html = convertTables(html);

  // Convert unordered lists
  html = html.replace(/(?:^[-*]\s+.+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map(line => {
        const content = line.replace(/^[-*]\s+/, "");
        return `<li>${convertInlineMarkdown(content)}</li>`;
      })
      .join("\n");
    return `<ul>\n${items}\n</ul>\n`;
  });

  // Convert ordered lists
  html = html.replace(/(?:^\d+\.\s+.+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map(line => {
        const content = line.replace(/^\d+\.\s+/, "");
        return `<li>${convertInlineMarkdown(content)}</li>`;
      })
      .join("\n");
    return `<ol>\n${items}\n</ol>\n`;
  });

  // Convert paragraphs (lines not already converted)
  html = html
    .split("\n\n")
    .map(block => {
      block = block.trim();
      if (!block) return "";
      // Skip if already HTML
      if (block.startsWith("<")) return block;
      // Convert inline markdown and wrap in paragraph
      return `<p>${convertInlineMarkdown(block)}</p>`;
    })
    .join("\n\n");

  // Restore enrichers
  enricherPlaceholders.forEach((original, i) => {
    html = html.replace(`__ENRICHER_${i}__`, original);
  });
  atRefPlaceholders.forEach((original, i) => {
    html = html.replace(`__ATREF_${i}__`, original);
  });
  ampRefPlaceholders.forEach((original, i) => {
    html = html.replace(`__AMPREF_${i}__`, original);
  });

  return html.trim();
}

/**
 * Convert inline markdown (bold, italic, code, links)
 */
function convertInlineMarkdown(text) {
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  text = text.replace(/_([^_]+)_/g, "<em>$1</em>");
  // Code
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return text;
}

/**
 * Convert markdown tables to HTML
 */
function convertTables(html) {
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;

  return html.replace(tableRegex, (match, headerRow, bodyRows) => {
    // Parse header
    const headers = headerRow
      .split("|")
      .map(h => h.trim())
      .filter(h => h);

    // Parse body rows
    const rows = bodyRows
      .trim()
      .split("\n")
      .map(row => {
        return row
          .split("|")
          .map(cell => cell.trim())
          .filter(cell => cell !== "");
      });

    // Build HTML table
    let table = "<table>\n<thead><tr>";
    headers.forEach(h => {
      table += `<th>${convertInlineMarkdown(h)}</th>`;
    });
    table += "</tr></thead>\n<tbody>\n";

    rows.forEach(row => {
      table += "<tr>";
      row.forEach(cell => {
        table += `<td>${convertInlineMarkdown(cell)}</td>`;
      });
      table += "</tr>\n";
    });

    table += "</tbody>\n</table>\n";
    return table;
  });
}

/**
 * Generate a YAML journal structure from markdown
 */
function generateJournalYaml(filePath, frontmatter, title, pages) {
  const filename = path.basename(filePath, ".md");
  const journalName = frontmatter.name || title || filename;
  const journalId = frontmatter._id || generateId(journalName, "Jrnl");

  const journal = {
    name: journalName,
    type: "base",
    _id: journalId,
    folder: frontmatter.folder || null,
    sort: frontmatter.sort || 100000,
    ownership: {
      default: frontmatter.ownership ?? 0
    },
    flags: {},
    pages: pages.map((page, index) => {
      const pageId = generateId(page.title, "Pg", index);
      return {
        name: page.title,
        type: "text",
        _id: pageId,
        _key: `!journal.pages!${journalId}.${pageId}`,
        sort: (index + 1) * 100000,
        ownership: {
          default: -1
        },
        title: {
          show: true,
          level: 1
        },
        text: {
          content: markdownToHtml(page.content),
          format: 1,
          markdown: ""
        },
        image: {},
        video: {
          controls: true,
          volume: 0.5
        },
        src: null,
        system: {},
        flags: {}
      };
    }),
    _stats: {
      systemId: "dnd5e",
      systemVersion: "5.0.0",
      coreVersion: "13.344",
      createdTime: Date.now(),
      modifiedTime: Date.now(),
      lastModifiedBy: "dnd5ebuilder0000"
    },
    _key: `!journal!${journalId}`
  };

  return journal;
}

/**
 * Check if a file should be skipped
 */
function shouldSkip(relativePath) {
  return SKIP_PATTERNS.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(relativePath);
    }
    return relativePath.includes(pattern);
  });
}

/**
 * Find all markdown files in campaign-notes
 */
async function findMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      files.push(...await findMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      if (!shouldSkip(relativePath)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Process a single markdown file
 */
async function processFile(filePath) {
  const content = await fsp.readFile(filePath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);

  // Check if this file should be compiled to a journal
  if (frontmatter.journal === false) {
    log.info(`  Skipping (journal: false): ${filePath}`);
    return null;
  }

  const title = extractTitle(body);
  const pages = splitIntoPages(body);

  if (pages.length === 0) {
    log.warn(`  No content found in: ${filePath}`);
    return null;
  }

  const journal = generateJournalYaml(filePath, frontmatter, title, pages);

  // Generate output filename
  const relativePath = path.relative(CAMPAIGN_NOTES_DIR, filePath);
  const outputName = relativePath
    .replace(/\//g, "-")
    .replace(/\.md$/, ".yaml");

  return { journal, outputName };
}

/**
 * Build all journals from campaign-notes
 */
async function buildJournals(specificFile = null) {
  // Ensure output directory exists
  await fsp.mkdir(JOURNAL_OUTPUT_DIR, { recursive: true });

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

  if (files.length === 0) {
    log.warn("No markdown files found to process");
    return;
  }

  log.info(`Processing ${files.length} markdown file(s)...`);

  let successCount = 0;
  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    log.info(`Processing: ${relativePath}`);

    try {
      const result = await processFile(file);
      if (result) {
        const outputPath = path.join(JOURNAL_OUTPUT_DIR, result.outputName);
        const yamlContent = yaml.dump(result.journal, {
          lineWidth: 120,
          noRefs: true,
          quotingType: '"',
          forceQuotes: false
        });

        // Add header comment
        const header = `# Generated from ${relativePath}\n# Do not edit directly - edit the source markdown file instead\n`;
        await fsp.writeFile(outputPath, header + yamlContent);

        log.info(`  ✓ Created: ${result.outputName}`);
        successCount++;
      }
    } catch (error) {
      log.error(`  ✗ Failed: ${error.message}`);
    }
  }

  log.info(`\nJournal build complete: ${successCount}/${files.length} files processed`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const specificFile = args[0];

await buildJournals(specificFile);
