#!/usr/bin/env node

/**
 * Copy source assets from src/.../assets into root assets/ for the module.
 * - src/module/assets/** → assets/**
 * - src/adventures/<adv>/assets/** → assets/adventures/<adv>/**
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import log from "fancy-log";

const SRC_ROOT = "src";
const OUTPUT_ROOT = "assets";

async function removeDir(targetPath) {
    if (fs.existsSync(targetPath)) {
        await fsp.rm(targetPath, { recursive: true, force: true });
    }
}

async function copyDir(fromDir, toDir) {
    if (!fs.existsSync(fromDir)) return 0;
    await fsp.mkdir(toDir, { recursive: true });
    await fsp.cp(fromDir, toDir, { recursive: true });
    return 1;
}

async function copyModuleAssets() {
    const moduleAssets = path.join(SRC_ROOT, "module", "assets");
    if (!fs.existsSync(moduleAssets)) return 0;
    await fsp.mkdir(OUTPUT_ROOT, { recursive: true });
    const entries = await fsp.readdir(moduleAssets, { withFileTypes: true });
    let count = 0;
    for (const entry of entries) {
        const fromPath = path.join(moduleAssets, entry.name);
        const toPath = path.join(OUTPUT_ROOT, entry.name);
        await fsp.cp(fromPath, toPath, { recursive: true });
        count += 1;
    }
    return count;
}

async function copyAdventureAssets() {
    const adventuresRoot = path.join(SRC_ROOT, "adventures");
    if (!fs.existsSync(adventuresRoot)) return 0;

    const adventures = await fsp.readdir(adventuresRoot, { withFileTypes: true });
    let count = 0;

    for (const entry of adventures) {
        if (!entry.isDirectory()) continue;
        const adventureName = entry.name;
        const assetsDir = path.join(adventuresRoot, adventureName, "assets");
        if (!fs.existsSync(assetsDir)) continue;

        const destDir = path.join(OUTPUT_ROOT, "adventures", adventureName);
        await copyDir(assetsDir, destDir);
        count += 1;
    }

    return count;
}

async function main() {
    await removeDir(OUTPUT_ROOT);

    const moduleCount = await copyModuleAssets();
    const adventureCount = await copyAdventureAssets();

    log.info(`Assets copied: module(${moduleCount}) adventures(${adventureCount})`);
}

main();
