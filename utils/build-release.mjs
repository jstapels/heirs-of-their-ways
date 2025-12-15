#!/usr/bin/env node

/**
 * Release Build Utility
 *
 * Prepares the module for release by:
 * - Building compendium packs
 * - Creating a distributable zip file
 * - Updating module.json with release URLs
 *
 * Usage:
 *   node utils/build-release.mjs [version]
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { createWriteStream } from "node:fs";
import archiver from "archiver";
import log from "fancy-log";

// Configuration
const MODULE_JSON = "module.json";
const DIST_DIR = "dist";
const MODULE_ID = "heirs-of-their-ways";

// Files and directories to include in release
const INCLUDE_PATTERNS = [
    "module.json",
    "README.md",
    "LICENSE",
    "SETUP.md",
    "packs/**/*",
    "assets/**/*",
    "scripts/**/*",
    "lang/**/*",
    "!packs/_source/**", // Exclude source files
    "!**/.gitkeep",
];

/**
 * Clean dist directory
 */
async function cleanDist() {
    if (fs.existsSync(DIST_DIR)) {
        await fsp.rm(DIST_DIR, { recursive: true });
        log.info(`Cleaned ${DIST_DIR}/`);
    }
    await fsp.mkdir(DIST_DIR, { recursive: true });
}

/**
 * Update module.json with release URLs
 */
async function updateModuleUrls(version) {
    const moduleData = JSON.parse(await fsp.readFile(MODULE_JSON, "utf8"));

    // Get repository info from package.json or module.json
    const repo =
        moduleData.url || "https://github.com/jstapels/heirs-of-their-ways";
    const repoBase = repo.replace(/\.git$/, "");

    // Update URLs for GitHub release
    moduleData.manifest = `${repoBase}/releases/latest/download/module.json`;
    moduleData.download = `${repoBase}/releases/download/v${version}/${MODULE_ID}.zip`;

    // Ensure version is set
    moduleData.version = version;

    // Write updated module.json
    await fsp.writeFile(
        MODULE_JSON,
        JSON.stringify(moduleData, null, 2) + "\n",
    );

    log.info(`Updated module.json URLs for version ${version}`);
    return moduleData;
}

/**
 * Create release zip file
 */
async function createReleaseZip(version, moduleData) {
    const zipPath = path.join(DIST_DIR, `${MODULE_ID}.zip`);

    return new Promise((resolve, reject) => {
        const output = createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
            const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
            log.info(`✓ Created ${zipPath} (${sizeMB} MB)`);
            resolve(zipPath);
        });

        archive.on("error", (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Add files to zip
        archive.file(MODULE_JSON, { name: `${MODULE_ID}/module.json` });
        archive.file("README.md", { name: `${MODULE_ID}/README.md` });

        if (fs.existsSync("LICENSE")) {
            archive.file("LICENSE", { name: `${MODULE_ID}/LICENSE` });
        }

        if (fs.existsSync("SETUP.md")) {
            archive.file("SETUP.md", { name: `${MODULE_ID}/SETUP.md` });
        }

        // Add packs directory (compiled LevelDB only, not source)
        const packDefs = moduleData.packs || [];
        for (const pack of packDefs) {
            const packDir = path.join("packs", path.basename(pack.path));
            if (!fs.existsSync(packDir)) {
                log.warn(
                    `Pack path missing for ${pack.name} (${pack.label}): ${packDir}. Creating empty folder in archive.`,
                );
                fs.mkdirSync(packDir, { recursive: true });
            }
            archive.directory(packDir, `${MODULE_ID}/${packDir}`);
        }

        // Add assets directory
        if (fs.existsSync("assets")) {
            archive.directory("assets", `${MODULE_ID}/assets`);
        }

        // Add scripts directory
        if (fs.existsSync("scripts")) {
            archive.directory("scripts", `${MODULE_ID}/scripts`);
        }

        // Add lang directory
        if (fs.existsSync("lang")) {
            archive.directory("lang", `${MODULE_ID}/lang`);
        }

        archive.finalize();
    });
}

/**
 * Copy module.json to dist for GitHub release
 */
async function copyModuleJson() {
    const destPath = path.join(DIST_DIR, "module.json");
    await fsp.copyFile(MODULE_JSON, destPath);
    log.info(`Copied module.json to ${destPath}`);
}

/**
 * Generate release notes
 */
async function generateReleaseNotes(version) {
    const notes = `# Heirs of Their Ways v${version}

## Installation

Paste this manifest URL into FoundryVTT's module installer:
\`\`\`
https://github.com/jstapels/heirs-of-their-ways/releases/latest/download/module.json
\`\`\`

Or download the module.zip file below and extract to your modules directory.

## What's Included

- Campaign compendium pack with adventures, NPCs, items, and lore
- Custom journal entries with interactive enrichers
- Maps, tokens, and other assets

## Requirements

- FoundryVTT v13+
- D&D 5e System v5.2+

---

*For installation and usage instructions, see [SETUP.md](https://github.com/jstapels/heirs-of-their-ways/blob/main/SETUP.md)*
`;

    const notesPath = path.join(DIST_DIR, "release-notes.md");
    await fsp.writeFile(notesPath, notes);
    log.info(`Generated release notes: ${notesPath}`);

    return notes;
}

// Main execution
async function main() {
    try {
        // Get version from argument or module.json
        let version = process.argv[2];
        if (!version) {
            const moduleData = JSON.parse(
                await fsp.readFile(MODULE_JSON, "utf8"),
            );
            version = moduleData.version;
        }

        log.info(`Building release for version ${version}...`);

        // Clean dist directory
        await cleanDist();

        // Update module.json URLs
        const moduleData = await updateModuleUrls(version);

        // Create release zip
        await createReleaseZip(version, moduleData);

        // Copy module.json for manifest
        await copyModuleJson();

        // Generate release notes
        await generateReleaseNotes(version);

        log.info(`✓ Release build complete: v${version}`);
        log.info(`  - ${DIST_DIR}/${MODULE_ID}.zip`);
        log.info(`  - ${DIST_DIR}/module.json`);
        log.info(`  - ${DIST_DIR}/release-notes.md`);
    } catch (error) {
        log.error(`✗ Release build failed:`, error.message);
        process.exit(1);
    }
}

main();
