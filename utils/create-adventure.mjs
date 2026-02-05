#!/usr/bin/env node

/**
 * Adventure scaffold creator.
 *
 * Usage:
 *   npm run create -- my-new-adventure
 *   npm run create -- "My New Adventure"
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const SRC_ROOT = "src";
const ADVENTURES_ROOT = path.join(SRC_ROOT, "adventures");

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/--+/g, "-");
}

function titleCase(value) {
    return value
        .replace(/[-_]+/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

async function ensureDir(dir) {
    await fsp.mkdir(dir, { recursive: true });
}

async function writeFileIfMissing(filePath, contents) {
    if (!fs.existsSync(filePath)) {
        await fsp.writeFile(filePath, contents);
    }
}

async function main() {
    const args = process.argv.slice(2).filter(Boolean);
    if (!args.length) {
        console.error("Usage: npm run create -- <adventure-name>");
        process.exit(1);
    }

    const rawName = args.join(" ").trim();
    const slug = slugify(rawName);
    if (!slug) {
        console.error("Adventure name must include letters or numbers.");
        process.exit(1);
    }

    const adventureDir = path.join(ADVENTURES_ROOT, slug);
    if (fs.existsSync(adventureDir)) {
        console.error(`Adventure already exists: ${adventureDir}`);
        process.exit(1);
    }

    const subdirs = [
        "actors",
        "items",
        "features",
        "journals",
        "scenes",
        "tables",
        "assets",
    ];

    await ensureDir(adventureDir);
    await Promise.all(subdirs.map((dir) => ensureDir(path.join(adventureDir, dir))));

    const title = titleCase(rawName);
    const overviewPath = path.join(adventureDir, "overview.md");
    const overview = `---\n` +
        `type: adventure\n` +
        `name: ${title}\n` +
        `---\n\n` +
        `# ${title}\n\n` +
        `## Overview\n` +
        `Summarize the adventure premise, themes, and level range here.\n\n` +
        `## Hooks\n` +
        `- Hook 1\n` +
        `- Hook 2\n\n` +
        `## Key Locations\n` +
        `- Location 1\n` +
        `- Location 2\n\n` +
        `## NPCs\n` +
        `- NPC 1\n` +
        `- NPC 2\n\n` +
        `## Rewards\n` +
        `- Reward 1\n` +
        `- Reward 2\n`;

    await writeFileIfMissing(overviewPath, overview);

    const readme = `Place adventure-specific content here. Markdown files in this folder\n` +
        `compile into Foundry packs based on their type.\n`;

    for (const dir of subdirs) {
        const readmePath = path.join(adventureDir, dir, "readme.txt");
        await writeFileIfMissing(readmePath, readme);
    }

    console.log(`Created adventure scaffold: ${adventureDir}`);
}

main();
