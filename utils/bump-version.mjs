#!/usr/bin/env node

/**
 * Version Bump Utility
 *
 * Updates version numbers in module.json and package.json
 * Supports semantic versioning: major, minor, patch
 *
 * Usage:
 *   node utils/bump-version.mjs <patch|minor|major>
 *   node utils/bump-version.mjs patch    # 1.0.0 → 1.0.1
 *   node utils/bump-version.mjs minor    # 1.0.0 → 1.1.0
 *   node utils/bump-version.mjs major    # 1.0.0 → 2.0.0
 */

import fs from "node:fs";
import path from "node:path";
import log from "fancy-log";

// File paths
const MODULE_JSON = "module.json";
const PACKAGE_JSON = "package.json";

/**
 * Parse semantic version string
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  };
}

/**
 * Bump version based on type
 */
function bumpVersion(version, type) {
  const parts = parseVersion(version);

  switch (type) {
    case "major":
      parts.major += 1;
      parts.minor = 0;
      parts.patch = 0;
      break;
    case "minor":
      parts.minor += 1;
      parts.patch = 0;
      break;
    case "patch":
      parts.patch += 1;
      break;
    default:
      throw new Error(`Invalid bump type: ${type}. Use: major, minor, or patch`);
  }

  return `${parts.major}.${parts.minor}.${parts.patch}`;
}

/**
 * Update module.json version
 */
function updateModuleJson(newVersion) {
  if (!fs.existsSync(MODULE_JSON)) {
    throw new Error(`${MODULE_JSON} not found`);
  }

  const moduleData = JSON.parse(fs.readFileSync(MODULE_JSON, "utf8"));
  const oldVersion = moduleData.version;

  moduleData.version = newVersion;

  fs.writeFileSync(MODULE_JSON, JSON.stringify(moduleData, null, 2) + "\n");

  log.info(`Updated ${MODULE_JSON}: ${oldVersion} → ${newVersion}`);
}

/**
 * Update package.json version
 */
function updatePackageJson(newVersion) {
  if (!fs.existsSync(PACKAGE_JSON)) {
    throw new Error(`${PACKAGE_JSON} not found`);
  }

  const packageData = JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));
  const oldVersion = packageData.version;

  packageData.version = newVersion;

  fs.writeFileSync(PACKAGE_JSON, JSON.stringify(packageData, null, 2) + "\n");

  log.info(`Updated ${PACKAGE_JSON}: ${oldVersion} → ${newVersion}`);
}

/**
 * Get current version from module.json
 */
function getCurrentVersion() {
  const moduleData = JSON.parse(fs.readFileSync(MODULE_JSON, "utf8"));
  return moduleData.version;
}

// Main execution
const bumpType = process.argv[2] || "patch";

try {
  const currentVersion = getCurrentVersion();
  log.info(`Current version: ${currentVersion}`);

  const newVersion = bumpVersion(currentVersion, bumpType);
  log.info(`Bumping version (${bumpType}): ${currentVersion} → ${newVersion}`);

  updateModuleJson(newVersion);
  updatePackageJson(newVersion);

  log.info(`✓ Version bump complete: ${newVersion}`);

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${newVersion}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `tag=v${newVersion}\n`);
  }

  process.exit(0);
} catch (error) {
  log.error(`✗ Version bump failed:`, error.message);
  process.exit(1);
}
