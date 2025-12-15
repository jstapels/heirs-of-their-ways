#!/usr/bin/env node

/**
 * Clean build artifacts.
 *
 * Defaults:
 * - Removes compiled LevelDB packs (packs/<pack>) and dist/
 * - Deletes stray .yml files under packs/_source (leftovers from extract)
 *
 * Optional:
 * - Pass --sources to also remove generated .yaml under packs/_source/<pack>
 *   (use only if you regenerate sources from markdown and don't hand-edit YAML).
 */

import fs from "node:fs";
import path from "node:path";
import log from "fancy-log";

const MODULE_JSON = "module.json";
const PACKS_ROOT = "packs";
const DIST_DIR = "dist";

function loadPackPaths() {
    try {
        const moduleData = JSON.parse(fs.readFileSync(MODULE_JSON, "utf8"));
        return moduleData.packs?.map((p) => p.path).filter(Boolean) || [];
    } catch (err) {
        log.warn(`Could not read ${MODULE_JSON}; falling back to scanning packs/`, err.message);
        return [];
    }
}

function removeDir(targetPath) {
    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        log.info(`Removed ${targetPath}`);
    }
}

function removeStrayYml(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            removeStrayYml(full);
        } else if (entry.isFile() && path.extname(entry.name) === ".yml") {
            fs.rmSync(full);
            log.info(`Removed stray ${full}`);
        }
    }
}

function removeGeneratedYamlSources(packDirs) {
    for (const packPath of packDirs) {
        const srcDir = path.join(PACKS_ROOT, "_source", path.basename(packPath));
        if (!fs.existsSync(srcDir)) continue;
        for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
            const full = path.join(srcDir, entry.name);
            if (entry.isDirectory()) {
                fs.rmSync(full, { recursive: true, force: true });
                log.info(`Removed directory ${full}`);
            } else if (entry.isFile() && [".yaml", ".yml"].includes(path.extname(entry.name))) {
                fs.rmSync(full);
                log.info(`Removed file ${full}`);
            }
        }
    }
}

function main() {
    const removeSources = process.argv.includes("--sources");
    const packPaths = loadPackPaths();

    // Remove compiled LevelDB pack directories (exclude _source)
    if (fs.existsSync(PACKS_ROOT)) {
        for (const entry of fs.readdirSync(PACKS_ROOT, { withFileTypes: true })) {
            if (entry.isDirectory() && !entry.name.startsWith("_")) {
                removeDir(path.join(PACKS_ROOT, entry.name));
            }
        }
    }

    // Remove dist output
    removeDir(DIST_DIR);

    // Clean stray .yml files in source
    removeStrayYml(path.join(PACKS_ROOT, "_source"));

    // Optionally remove generated YAML sources
    if (removeSources && packPaths.length) {
        removeGeneratedYamlSources(packPaths);
    } else if (removeSources) {
        log.warn("No packs found to clean sources; skipping --sources cleanup.");
    }

    log.info("Clean complete.");
}

main();
