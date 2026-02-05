#!/usr/bin/env node

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import yaml from "js-yaml";

const SRC_ROOT = "src";
const PACK_SOURCE_ROOT = "packs/_source";
const MODULE_JSON = "module.json";
const ASSET_ROOT = "assets";

function loadModuleId() {
    try {
        const moduleJson = JSON.parse(fs.readFileSync(MODULE_JSON, "utf-8"));
        return moduleJson.id || "heirs-of-their-ways";
    } catch {
        return "heirs-of-their-ways";
    }
}

const MODULE_ID = loadModuleId();
const ASSET_PREFIX = `modules/${MODULE_ID}/assets/`;

async function findMarkdownFiles(dir) {
    const files = [];
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await findMarkdownFiles(full)));
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            files.push(full);
        }
    }
    return files;
}

async function findYamlFiles(dir) {
    const files = [];
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await findYamlFiles(full)));
        } else if (entry.isFile() && entry.name.endsWith(".yaml")) {
            files.push(full);
        }
    }
    return files;
}

function collectAssetPaths(obj, hits = []) {
    if (Array.isArray(obj)) {
        obj.forEach((item) => collectAssetPaths(item, hits));
        return hits;
    }
    if (!obj || typeof obj !== "object") return hits;

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string" && (key === "img" || key === "src" || key === "thumb")) {
            if (value.startsWith(ASSET_PREFIX)) hits.push(value);
        } else if (value && typeof value === "object") {
            collectAssetPaths(value, hits);
        }
    }
    return hits;
}

function collectInlineAssetPaths(text) {
    const escapedPrefix = ASSET_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`${escapedPrefix}[^\\s"'<>]+`, "g");
    const hits = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
        hits.add(match[0]);
    }
    return hits;
}

async function main() {
    const markdownFiles = await findMarkdownFiles(SRC_ROOT);
    const foundryYamlFiles = [];

    for (const file of markdownFiles) {
        const content = await fsp.readFile(file, "utf8");
        if (content.includes("```foundry-yaml")) {
            foundryYamlFiles.push(file);
        }
    }

    if (foundryYamlFiles.length) {
        console.error("Found legacy foundry-yaml blocks:");
        foundryYamlFiles.forEach((file) => console.error(`- ${file}`));
        process.exit(1);
    }

    execSync("node utils/copy-assets.mjs", { stdio: "inherit" });
    execSync("node utils/build-yaml.mjs", { stdio: "inherit" });

    if (!fs.existsSync(PACK_SOURCE_ROOT)) {
        console.error("packs/_source not found after build.");
        process.exit(1);
    }

    const yamlFiles = await findYamlFiles(PACK_SOURCE_ROOT);
    if (!yamlFiles.length) {
        console.error("No YAML files generated in packs/_source.");
        process.exit(1);
    }

    const invalidIds = [];
    const missingKeys = [];
    const missingAssets = new Set();

    for (const file of yamlFiles) {
        const content = await fsp.readFile(file, "utf8");
        const doc = yaml.load(content) || {};
        if (doc._id && (!/^[a-zA-Z0-9]{16}$/.test(doc._id))) {
            invalidIds.push(`${file}: ${doc._id}`);
        }
        if (!doc._key) {
            missingKeys.push(file);
        }

        const assetPaths = new Set([
            ...collectAssetPaths(doc),
            ...collectInlineAssetPaths(content),
        ]);
        for (const assetPath of assetPaths) {
            const rel = assetPath.replace(ASSET_PREFIX, "");
            const fsPath = path.join(ASSET_ROOT, rel);
            if (!fs.existsSync(fsPath)) missingAssets.add(`${assetPath} -> ${fsPath}`);
        }
    }

    if (invalidIds.length) {
        console.error("Invalid _id values detected:");
        invalidIds.forEach((item) => console.error(`- ${item}`));
        process.exit(1);
    }

    if (missingKeys.length) {
        console.error("Missing _key fields detected:");
        missingKeys.forEach((file) => console.error(`- ${file}`));
        process.exit(1);
    }

    if (missingAssets.size) {
        console.error("Missing asset files for referenced images:");
        Array.from(missingAssets).forEach((item) => console.error(`- ${item}`));
        process.exit(1);
    }

    console.log("Build tests passed.");
}

main();
