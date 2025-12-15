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
const ID_LENGTH = 16; // FoundryVTT requires exactly 16 alphanumeric characters

// Default images for different document types (relative to module root)
const DEFAULT_IMAGES = {
    npc: "modules/heirs-of-their-ways/assets/tokens/nobody.webp",
    character: "modules/heirs-of-their-ways/assets/tokens/nobody.webp",
    item: "modules/heirs-of-their-ways/assets/images/placeholder.webp",
    feature: "modules/heirs-of-their-ways/assets/images/placeholder.webp",
};

// Image patterns that should be replaced with defaults (these are placeholder icons that may not exist)
const INVALID_IMAGE_PATTERNS = [
    /^icons\/environment\/people\//, // Generic people icons
    /^icons\/creatures\//, // Generic creature icons
    /^icons\/svg\/mystery-man\.svg$/, // Default mystery man
    /^icons\/svg\/item-bag\.svg$/, // Default item bag
];

function deriveCollectionFromKey(key) {
    if (!key) return null;
    const parts = key.split("!").filter(Boolean);
    if (!parts.length) return null;
    return parts[0].split(".")[0] || null;
}

function ensureKey(entry, { collection, parentCollection, parentId } = {}) {
    if (entry._key || !entry._id || !collection) return entry._key;
    if (parentCollection && parentId) {
        entry._key = `!${parentCollection}.${collection}!${parentId}.${entry._id}`;
    } else {
        entry._key = `!${collection}!${entry._id}`;
    }
    return entry._key;
}

/**
 * Check if an image path is invalid and should be replaced
 * @param {string} imgPath - The image path to check
 * @returns {boolean} True if the image should be replaced
 */
function isInvalidImage(imgPath) {
    if (!imgPath) return true;
    return INVALID_IMAGE_PATTERNS.some((pattern) => pattern.test(imgPath));
}

/**
 * Get the appropriate default image for a document type
 * @param {string} type - The document type (npc, character, item, etc.)
 * @returns {string|null} The default image path or null
 */
function getDefaultImage(type) {
    return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.item || null;
}

/**
 * Generate a valid 16-character alphanumeric ID from a name
 * @param {string} name - The name to generate an ID from
 * @param {string} [prefix=""] - Optional prefix for the ID
 * @returns {string} A valid 16-character ID
 */
function generateId(name, prefix = "") {
    // Remove non-alphanumeric characters and convert to consistent case
    const cleaned = (prefix + name)
        .replace(/[^a-zA-Z0-9]/g, "")
        .replace(/([a-z])([A-Z])/g, "$1$2"); // Keep camelCase intact

    // Take first 16 chars or pad with zeros if too short
    if (cleaned.length >= ID_LENGTH) {
        return cleaned.substring(0, ID_LENGTH);
    }

    // Pad with zeros to reach 16 characters
    return cleaned.padEnd(ID_LENGTH, "0");
}

/**
 * Validate and fix an ID to ensure it's exactly 16 alphanumeric characters
 * @param {string} id - The ID to validate
 * @param {string} name - The name to use for regeneration if needed
 * @param {string} [prefix=""] - Optional prefix for regenerated IDs
 * @returns {string} A valid 16-character ID
 */
function validateId(id, name, prefix = "") {
    // Check if ID is valid (exactly 16 alphanumeric characters)
    if (id && /^[a-zA-Z0-9]{16}$/.test(id)) {
        return id;
    }

    // If ID exists but is wrong length, try to fix it
    if (id) {
        const cleaned = id.replace(/[^a-zA-Z0-9]/g, "");
        if (cleaned.length >= ID_LENGTH) {
            return cleaned.substring(0, ID_LENGTH);
        }
        if (cleaned.length > 0) {
            return cleaned.padEnd(ID_LENGTH, "0");
        }
    }

    // Generate new ID from name
    return generateId(name, prefix);
}

/**
 * Parse command line arguments
 */
const argv = yargs(hideBin(process.argv))
    .command(
        "compile [pack]",
        "Compile source files to LevelDB packs",
        (yargs) => {
            return yargs.positional("pack", {
                describe: "Specific pack to compile (or all if omitted)",
                type: "string",
            });
        },
    )
    .command(
        "extract [pack]",
        "Extract LevelDB packs to source files",
        (yargs) => {
            return yargs.positional("pack", {
                describe: "Specific pack to extract (or all if omitted)",
                type: "string",
            });
        },
    )
    .command("clean", "Clean source files (standardize formatting)")
    .demandCommand(1, "You must specify a command (compile, extract, or clean)")
    .help().argv;

/**
 * Clean up pack entry before compilation
 * Removes metadata, standardizes formatting, and validates IDs
 */
function cleanPackEntry(entry, context = {}) {
    const entryName = entry.name || "Unknown";
    const collection =
        context.collection ||
        deriveCollectionFromKey(entry._key) ||
        context.parentCollection ||
        null;

    // Validate and fix the main _id
    if (entry._id !== undefined) {
        const oldId = entry._id;
        entry._id = validateId(entry._id, entryName);
        if (oldId !== entry._id) {
            log.info(`  Fixed ID: ${oldId} -> ${entry._id} (${entryName})`);
        }
    } else {
        entry._id = generateId(entryName);
    }

    // Ensure a _key exists for this entry
    ensureKey(entry, {
        collection,
        parentCollection: context.parentCollection,
        parentId: context.parentId,
    });

    // Also fix _key if it contains the old ID pattern
    if (entry._key && entry._id) {
        // _key format is like "!items!ItemId00000000" or "!journal.pages!JournalId.PageId"
        const keyParts = entry._key.split("!");
        if (keyParts.length >= 3) {
            const lastPart = keyParts[keyParts.length - 1];
            // Check if the last part contains an ID that needs updating
            if (lastPart.includes(".")) {
                // Handle nested keys like "JournalId.PageId"
                const [parentId, childId] = lastPart.split(".");
                if (
                    childId === entry._id ||
                    (childId && childId.length !== ID_LENGTH)
                ) {
                    // Update the child ID portion
                    keyParts[keyParts.length - 1] = `${parentId}.${entry._id}`;
                    entry._key = keyParts.join("!");
                }
            } else if (lastPart !== entry._id) {
                // Simple key, just replace the ID
                keyParts[keyParts.length - 1] = entry._id;
                entry._key = keyParts.join("!");
            }
        }
    }

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

    // Fix invalid or missing images based on document type
    if (entry.type && isInvalidImage(entry.img)) {
        const oldImg = entry.img;
        const defaultImg = getDefaultImage(entry.type);
        if (defaultImg) {
            entry.img = defaultImg;
            if (oldImg && oldImg !== defaultImg) {
                log.info(
                    `  Fixed image: ${oldImg} -> ${defaultImg} (${entryName})`,
                );
            }
        }
    }

    // Clean embedded documents (items in actors, etc.)
    if (entry.items) {
        entry.items = entry.items.map((item) =>
            cleanPackEntry(item, {
                collection: "items",
                parentCollection: collection,
                parentId: entry._id,
            }),
        );
    }

    if (entry.effects) {
        entry.effects = entry.effects.map((effect) =>
            cleanPackEntry(effect, {
                collection: "effects",
                parentCollection: collection,
                parentId: entry._id,
            }),
        );
    }

    // Clean journal pages
    if (entry.pages) {
        entry.pages = entry.pages.map((page) =>
            cleanPackEntry(page, {
                collection: "pages",
                parentCollection: collection,
                parentId: entry._id,
            }),
        );
    }

    // Clean activities (for items with activities like weapons)
    if (entry.system?.activities) {
        for (const [actId, activity] of Object.entries(
            entry.system.activities,
        )) {
            if (activity._id !== undefined) {
                const oldActId = activity._id;
                activity._id = validateId(
                    activity._id,
                    activity.name || actId,
                    "act",
                );
                if (oldActId !== activity._id) {
                    log.info(
                        `  Fixed activity ID: ${oldActId} -> ${activity._id}`,
                    );
                    // Also need to rename the key in activities object if different
                    if (actId !== activity._id && actId === oldActId) {
                        entry.system.activities[activity._id] = activity;
                        delete entry.system.activities[actId];
                    }
                }
            }
        }
    }

    // Clean table results
    if (entry.results) {
        entry.results = entry.results.map((result, idx) => {
            if (result._id !== undefined) {
                const oldResId = result._id;
                result._id = validateId(
                    result._id,
                    `${entryName}Result${idx}`,
                    "res",
                );
                if (oldResId !== result._id) {
                    log.info(`  Fixed result ID: ${oldResId} -> ${result._id}`);
                }
            }
            return result;
        });
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
        : fs
              .readdirSync(PACK_SOURCE, { withFileTypes: true })
              .filter((entry) => entry.isDirectory())
              .map((entry) => entry.name);

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
                transformEntry: cleanPackEntry,
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
        : fs
              .readdirSync(PACK_DEST, { withFileTypes: true })
              .filter(
                  (entry) => entry.isDirectory() && !entry.name.startsWith("_"),
              )
              .map((entry) => entry.name);

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
                    noRefs: true,
                },
                transformEntry: cleanPackEntry,
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
