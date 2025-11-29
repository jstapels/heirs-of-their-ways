#!/usr/bin/env node

/**
 * Pack Compilation Utility for Heirs of Their Ways
 *
 * This script manages the compilation of YAML/JSON source files into LevelDB compendium packs
 * and extraction of LevelDB packs back to YAML/JSON source files.
 *
 * Based on the official dnd5e system build process.
 *
 * Usage:
 *   npm run build:packs           - Compile all packs from source
 *   npm run build:packs -- <name> - Compile specific pack
 *   npm run extract:packs          - Extract all packs to source
 *   npm run extract:packs -- <name> - Extract specific pack
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { compilePack, extractPack } from "@foundryvtt/foundryvtt-cli";
import log from "fancy-log";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Constants
const PACK_SOURCE = "packs/_source";
const PACK_DEST = "packs";
const USE_YAML = true; // Set to false for JSON

/**
 * Parse command line arguments
 */
const argv = yargs(hideBin(process.argv))
  .command("compile [pack]", "Compile source files to LevelDB packs", (yargs) => {
    return yargs.positional("pack", {
      describe: "Specific pack to compile (or all if omitted)",
      type: "string"
    });
  })
  .command("extract [pack]", "Extract LevelDB packs to source files", (yargs) => {
    return yargs.positional("pack", {
      describe: "Specific pack to extract (or all if omitted)",
      type: "string"
    });
  })
  .command("clean", "Clean source files (standardize formatting)")
  .demandCommand(1, "You must specify a command (compile, extract, or clean)")
  .help()
  .argv;

/**
 * Clean up pack entry before compilation
 * Removes metadata and standardizes formatting
 */
function cleanPackEntry(entry) {
  // Remove flags that shouldn't be in compendia
  if (entry.flags) {
    delete entry.flags.importSource;
    delete entry.flags.exportSource;

    // Remove empty flag objects
    if (Object.keys(entry.flags).length === 0) {
      delete entry.flags;
    }
  }

  // Reset ownership to default
  if (entry.ownership) {
    entry.ownership = { default: 0 };
  }

  // Remove zero-value numeric fields
  for (const [key, value] of Object.entries(entry)) {
    if (typeof value === "number" && value === 0 && key !== "sort") {
      delete entry[key];
    }
  }

  // Remove default actor images
  if (entry.img === "icons/svg/mystery-man.svg") {
    delete entry.img;
  }

  // Clean embedded documents (items in actors, etc.)
  if (entry.items) {
    entry.items = entry.items.map(cleanPackEntry);
  }

  if (entry.effects) {
    entry.effects = entry.effects.map(cleanPackEntry);
  }

  // Clean journal pages
  if (entry.pages) {
    entry.pages = entry.pages.map(cleanPackEntry);
  }

  return entry;
}

/**
 * Compile source files to LevelDB packs
 */
async function compilePacks(packName = null) {
  // Ensure source directory exists
  if (!fs.existsSync(PACK_SOURCE)) {
    log.error(`Source directory ${PACK_SOURCE} does not exist`);
    return;
  }

  // Get list of packs to compile
  const packs = packName
    ? [packName]
    : fs.readdirSync(PACK_SOURCE, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);

  if (packs.length === 0) {
    log.warn("No packs found to compile");
    return;
  }

  log.info(`Compiling ${packs.length} pack(s)...`);

  for (const pack of packs) {
    const src = path.join(PACK_SOURCE, pack);
    const dest = path.join(PACK_DEST, pack);

    // Check if source directory exists
    if (!fs.existsSync(src)) {
      log.error(`Source directory not found: ${src}`);
      continue;
    }

    log.info(`Compiling ${pack}...`);

    try {
      await compilePack(src, dest, {
        recursive: true,
        log: true,
        yaml: USE_YAML,
        transformEntry: cleanPackEntry
      });
      log.info(`✓ Compiled ${pack}`);
    } catch (error) {
      log.error(`✗ Failed to compile ${pack}:`, error.message);
    }
  }

  log.info("Pack compilation complete");
}

/**
 * Extract LevelDB packs to source files
 */
async function extractPacks(packName = null) {
  // Get list of packs to extract
  const packs = packName
    ? [packName]
    : fs.readdirSync(PACK_DEST, { withFileTypes: true })
        .filter(entry => entry.isDirectory() && !entry.name.startsWith("_"))
        .map(entry => entry.name);

  if (packs.length === 0) {
    log.warn("No packs found to extract");
    return;
  }

  log.info(`Extracting ${packs.length} pack(s)...`);

  for (const pack of packs) {
    const src = path.join(PACK_DEST, pack);
    const dest = path.join(PACK_SOURCE, pack);

    // Check if pack directory exists
    if (!fs.existsSync(src)) {
      log.error(`Pack directory not found: ${src}`);
      continue;
    }

    log.info(`Extracting ${pack}...`);

    try {
      await extractPack(src, dest, {
        log: true,
        yaml: USE_YAML,
        yamlOptions: {
          lineWidth: 120,
          noRefs: true
        },
        transformEntry: cleanPackEntry
      });
      log.info(`✓ Extracted ${pack}`);
    } catch (error) {
      log.error(`✗ Failed to extract ${pack}:`, error.message);
    }
  }

  log.info("Pack extraction complete");
}

/**
 * Clean source files (re-extract and format)
 */
async function cleanPacks() {
  log.info("Cleaning pack source files...");
  await extractPacks();
  log.info("Source files cleaned");
}

// Execute command
const command = argv._[0];
const packName = argv.pack || null;

switch (command) {
  case "compile":
    await compilePacks(packName);
    break;
  case "extract":
    await extractPacks(packName);
    break;
  case "clean":
    await cleanPacks();
    break;
  default:
    log.error(`Unknown command: ${command}`);
    process.exit(1);
}
