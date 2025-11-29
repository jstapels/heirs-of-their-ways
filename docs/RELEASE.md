# Release Process

This document describes the automated release process for the Heirs of Their Ways module.

## Overview

The module uses **GitHub Actions** to automatically build and release new versions when changes are merged to the `main` branch. The release process includes:

- Automatic version bumping based on PR labels
- Compendium pack compilation
- Release artifact creation (zip file)
- GitHub Release creation with downloadable assets
- Automatic manifest URL updates

## Version Management

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0) - Breaking changes, major campaign milestones
- **MINOR** (1.0.0 → 1.1.0) - New features, new chapters, significant content additions
- **PATCH** (1.0.0 → 1.0.1) - Bug fixes, small content updates, typo fixes

## Automated Release Process

### 1. Create Pull Request

When you create a pull request, add a version label to control how the version number is bumped:

**PR Labels:**
- `version:major` - Bump major version (1.0.0 → 2.0.0)
- `version:minor` - Bump minor version (1.0.0 → 1.1.0)
- `version:patch` - Bump patch version (1.0.0 → 1.0.1) **[DEFAULT]**

**Example:**
```
1. Create feature branch: git checkout -b feature/chapter-2
2. Make changes and commit
3. Push and create PR
4. Add label: version:minor (if adding new chapter)
5. Get PR approved
6. Merge to main
```

### 2. Automatic Build on Merge

When the PR is merged to `main`, GitHub Actions automatically:

1. **Detects version bump type** from PR labels (defaults to `patch`)
2. **Bumps version** in `module.json` and `package.json`
3. **Builds compendium packs** from YAML sources
4. **Creates release package** (zip file with all necessary files)
5. **Updates module.json** with download URLs
6. **Commits version changes** back to main
7. **Creates GitHub Release** with tag (e.g., `v1.2.3`)
8. **Uploads release artifacts** (zip file and module.json)

### 3. FoundryVTT Installation

Users can install/update the module using the manifest URL:
```
https://github.com/jstapels/heirs-of-their-ways/releases/latest/download/module.json
```

This URL always points to the latest release.

## Manual Release

If you need to create a release manually (outside the PR workflow):

### Option 1: GitHub UI

1. Go to [GitHub Actions](https://github.com/jstapels/heirs-of-their-ways/actions)
2. Select "Release Module" workflow
3. Click "Run workflow"
4. Choose version bump type (patch/minor/major)
5. Click "Run workflow"

### Option 2: Command Line

```bash
# Bump version locally
npm run version:patch   # or version:minor or version:major

# Build release locally
npm run build:release

# Commit and push
git add module.json package.json
git commit -m "chore: bump version to X.Y.Z"
git push

# Create tag and release manually
git tag vX.Y.Z
git push origin vX.Y.Z

# Upload dist/heirs-of-their-ways.zip to GitHub release
```

## Release Workflow Details

### What Gets Included in the Release

The release package includes:
- `module.json` - Module manifest with updated URLs
- `README.md` - Project overview
- `LICENSE` - License file
- `SETUP.md` - Setup and installation guide
- `packs/` - Compiled compendium packs (LevelDB)
- `assets/` - All images, maps, tokens, sounds

**Excluded from release:**
- `packs/_source/` - YAML source files (development only)
- `node_modules/` - NPM dependencies
- `utils/` - Build scripts
- `.github/` - GitHub Actions workflows
- Development files (.gitignore, etc.)

### Version Bump Process

The `utils/bump-version.mjs` script:
1. Reads current version from `module.json`
2. Increments version based on type (major/minor/patch)
3. Updates `module.json` and `package.json`
4. Outputs new version for GitHub Actions

**Example:**
```bash
$ node utils/bump-version.mjs minor
[14:30:12] Current version: 1.0.0
[14:30:12] Bumping version (minor): 1.0.0 → 1.1.0
[14:30:12] Updated module.json: 1.0.0 → 1.1.0
[14:30:12] Updated package.json: 1.0.0 → 1.1.0
[14:30:12] ✓ Version bump complete: 1.1.0
```

### Release Build Process

The `utils/build-release.mjs` script:
1. Cleans `dist/` directory
2. Updates `module.json` with GitHub release URLs:
   - `manifest`: Points to latest module.json
   - `download`: Points to version-specific zip
3. Creates release zip with proper structure:
   ```
   heirs-of-their-ways.zip
   └── heirs-of-their-ways/
       ├── module.json
       ├── README.md
       ├── LICENSE
       ├── SETUP.md
       ├── packs/
       │   └── heirs-pack/
       └── assets/
   ```
4. Copies `module.json` for manifest
5. Generates release notes

### GitHub Actions Workflow

The `.github/workflows/release.yml` workflow:

**Triggers:**
- Push to `main` branch (when PR merged)
- Manual workflow dispatch

**Permissions:**
- `contents: write` - Required to create releases and push commits

**Steps:**
1. Checkout code
2. Setup Node.js 20 with npm cache
3. Install dependencies (`npm ci`)
4. Detect version bump from PR labels
5. Bump version numbers
6. Build compendium packs
7. Build release package
8. Commit version changes
9. Create GitHub Release with tag
10. Upload release artifacts

## Troubleshooting

### Release fails to create

**Problem:** GitHub Actions workflow fails

**Solutions:**
- Check [Actions tab](https://github.com/jstapels/heirs-of-their-ways/actions) for error logs
- Ensure GITHUB_TOKEN has correct permissions
- Verify all dependencies install correctly
- Check that YAML sources compile without errors

### Version not incrementing

**Problem:** Version stays the same after merge

**Solutions:**
- Verify PR had correct version label
- Check if workflow detected the label (see Actions logs)
- Ensure PR was actually merged (not just closed)
- Try manual workflow dispatch

### Module.json URLs incorrect

**Problem:** Download URLs don't work

**Solutions:**
- Verify repository URL in module.json is correct
- Check that release was created successfully
- Ensure zip file was uploaded to release
- Try using the direct release URL instead

### FoundryVTT can't install module

**Problem:** Manifest URL doesn't work

**Solutions:**
- Verify at least one release exists
- Check manifest URL: `https://github.com/USER/REPO/releases/latest/download/module.json`
- Ensure module.json is uploaded to release
- Try downloading zip directly and installing manually

## Best Practices

### Before Creating a PR

- ✅ Test changes in FoundryVTT locally
- ✅ Run `npm run build:packs` to ensure YAML compiles
- ✅ Update campaign notes and documentation
- ✅ Choose appropriate version label based on changes

### Choosing Version Bump Type

**Use `version:major` for:**
- Breaking changes to module structure
- Major campaign milestones (new campaign arc)
- Incompatible changes requiring user migration
- Foundry version requirement changes

**Use `version:minor` for:**
- New chapters or adventures
- Significant content additions (new NPCs, items, locations)
- New features or capabilities
- Compendium reorganization

**Use `version:patch` for:**
- Bug fixes
- Typo corrections
- Small content tweaks
- Documentation updates
- Minor balance adjustments

### PR Titles and Descriptions

Use clear, descriptive PR titles:
- ✅ "Add Chapter 2: The Shadow Temple"
- ✅ "Fix elder-theron NPC stat block"
- ✅ "Update crystal-of-dawn item description"
- ❌ "Updates"
- ❌ "Fixes"

Include in PR description:
- What changed
- Why it changed
- How to test
- Related issues

### After Release

1. **Verify release** - Check GitHub Releases page
2. **Test manifest URL** - Try installing in fresh Foundry world
3. **Update changelog** - Document changes for users
4. **Announce** - Let players know about updates

## Release Checklist

Before merging to main:

- [ ] All YAML sources compile without errors
- [ ] Content tested in FoundryVTT
- [ ] Documentation updated
- [ ] Appropriate version label added to PR
- [ ] PR reviewed and approved
- [ ] Changelog entry prepared (if needed)

After merge:

- [ ] GitHub Actions workflow completes successfully
- [ ] Release appears on GitHub Releases page
- [ ] Manifest URL works in FoundryVTT
- [ ] Zip file downloads correctly
- [ ] Module installs and loads in FoundryVTT

## Commands Reference

```bash
# Version management
npm run version:patch   # Bump patch version
npm run version:minor   # Bump minor version
npm run version:major   # Bump major version

# Building
npm run build:packs     # Compile YAML to LevelDB
npm run build:release   # Build complete release package
npm run release         # Build packs + release (alias)

# Pack management
npm run extract:packs   # Extract LevelDB to YAML
npm run clean:packs     # Standardize YAML formatting
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [FoundryVTT Package Development](https://foundryvtt.com/article/module-development/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

---

For questions or issues with the release process, open an issue on GitHub.
