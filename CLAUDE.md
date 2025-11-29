# CLAUDE.md - AI Assistant Guide for Heirs of Their Ways

## Project Overview

**Heirs Of Their Ways** is a FoundryVTT module for a Dungeons & Dragons 5th Edition campaign. This module packages campaign-specific content, adventures, and custom resources for use within Foundry Virtual Tabletop.

### Key Information
- **Module ID**: `heirs-of-their-ways`
- **Version**: 1.0.0
- **System**: D&D 5e (dnd5e)
- **Foundry Compatibility**: Version 13+
- **Author**: Jason Stapels (jstapels@gmail.com)

## Repository Structure

```
heirs-of-their-ways/
├── .git/                  # Git version control
├── .gitattributes        # Git attributes configuration
├── README.md             # Project overview and user guide
├── module.json           # FoundryVTT module manifest (CRITICAL)
├── CLAUDE.md             # This file - AI assistant guide
├── docs/                 # Documentation
│   ├── ENRICHERS.md     # Complete text enrichers reference
│   └── WORKFLOW.md      # Development workflow guide
├── campaign-notes/       # Markdown source notes
│   ├── README.md        # Campaign notes guide
│   ├── adventures/      # Adventure outlines and sessions
│   ├── npcs/           # NPC descriptions and backgrounds
│   ├── locations/      # Location descriptions
│   ├── items/          # Custom item descriptions
│   └── lore/           # World lore and background
├── source-data/         # JSON exports for version control
│   ├── README.md       # Source data guide
│   ├── actors/         # NPC/creature JSON files
│   ├── items/          # Item JSON files
│   ├── journals/       # Journal entry JSON files
│   ├── scenes/         # Scene JSON files
│   └── tables/         # Roll table JSON files
├── assets/              # Media assets
│   ├── maps/           # Map images for scenes
│   ├── tokens/         # Token artwork
│   ├── images/         # Other images
│   └── sounds/         # Audio files
└── packs/               # Compendium packs (LevelDB)
    └── heirs-pack/     # Main adventure pack
```

### Critical Files

#### `module.json`
This is the **most important file** in the repository. It serves as the module manifest that FoundryVTT reads to understand:
- Module metadata (id, title, version, description)
- Compatibility requirements
- Author information
- Compendium pack definitions
- System relationships and dependencies

**NEVER** modify `module.json` without careful consideration. Changes here affect how FoundryVTT loads and displays the module.

### Documentation Files

The repository includes comprehensive documentation to guide development:

#### `docs/ENRICHERS.md`
Complete reference for FoundryVTT v13 and DnD5e v5.2 text enrichers:
- Core enrichers: @UUID, @Embed, inline rolls
- DnD5e enrichers: @Check, @Damage, @Save, @Attack, @Item, [[lookup]], &Reference
- Syntax examples and best practices
- **Always consult this when creating journal entries**

#### `docs/WORKFLOW.md`
Development workflow guide covering:
- Directory structure and purpose
- Phase-by-phase development process
- Common tasks with step-by-step instructions
- Best practices for naming, organization, and version control
- **Read this to understand the development workflow**

#### `campaign-notes/README.md`
Guide for writing campaign notes in markdown:
- Format and structure guidelines
- Using enrichers in notes
- Linking related content
- Example files for NPCs, adventures, items
- **Follow this when creating campaign content**

#### `source-data/README.md`
Guide for JSON exports and imports:
- Exporting from FoundryVTT
- Importing to FoundryVTT
- JSON structure overview
- Version control best practices
- **Reference this when working with JSON data**

#### `packs/_source/README.md`
Guide for YAML pack source files:
- Modern YAML-based build system
- Creating and editing YAML sources
- Build commands and workflow
- YAML format examples and templates
- **Use this for managing compendium content**

### Build System

This module uses a **YAML-based pack compilation system** (following the official dnd5e system approach):

- **Source Files**: YAML files in `packs/_source/heirs-pack/`
- **Compiled Output**: LevelDB databases in `packs/heirs-pack/`
- **Build Tool**: `utils/packs.mjs` with `@foundryvtt/foundryvtt-cli`

**Key Commands:**
```bash
npm install                # Install dependencies (first time)
npm run build:packs        # Compile YAML → LevelDB
npm run extract:packs      # Extract LevelDB → YAML
npm run clean:packs        # Standardize YAML formatting
```

**Why YAML?**
- Human-readable and editable
- Git-friendly with meaningful diffs
- Supports comments for documentation
- Same approach as official dnd5e system
- Avoids binary merge conflicts

### Automated Release System

This module uses **GitHub Actions for automated releases**:

- **Trigger**: Merging PR to main branch
- **Version Management**: Based on PR labels (`version:major`, `version:minor`, `version:patch`)
- **Build Process**: Compiles YAML, creates zip, updates URLs
- **Distribution**: GitHub Releases with downloadable assets

**Release Scripts:**
```bash
npm run version:patch      # Bump patch version
npm run version:minor      # Bump minor version
npm run version:major      # Bump major version
npm run build:release      # Build release package
```

**When creating PRs:**
- Add `version:patch` label for bug fixes (default)
- Add `version:minor` label for new features/chapters
- Add `version:major` label for breaking changes

See [docs/RELEASE.md](docs/RELEASE.md) for complete release documentation.

## FoundryVTT Module Concepts

### Compendium Packs
Compendium packs are collections of game content stored in a structured format. This module defines one pack:

- **Name**: `heirs-pack`
- **Type**: Adventure
- **Path**: `packs/heirs-pack`
- **System**: dnd5e
- **Permissions**: Players can observe, Assistant has ownership

Adventure packs can contain:
- Scenes (maps and environments)
- Actors (NPCs, monsters, characters)
- Items (weapons, armor, magic items, consumables)
- Journal entries (lore, handouts, notes)
- Roll tables (random encounters, loot)
- Playlists (music and sound effects)

### Data Format
FoundryVTT uses LevelDB for compendium storage, which typically contains:
- `.db` files (database files)
- `_LOG` files (transaction logs)
- `CURRENT` and `LOCK` files (database state)

Content is typically managed through the Foundry UI, but can also be:
- Exported to JSON for version control
- Imported from JSON files
- Manipulated via the Foundry API

## Development Workflows

### Adding New Content

When adding content to this module, follow these steps:

1. **Plan the Content Type**
   - Determine what you're adding (adventure, scene, actor, item, journal)
   - Verify it belongs in the `heirs-pack` adventure pack
   - Consider dependencies (e.g., actors reference items, scenes reference actors)

2. **Create Supporting Directories**
   ```bash
   mkdir -p packs/heirs-pack
   ```

3. **Add Content Files**
   - If working with JSON exports, place them in appropriate subdirectories
   - If working with LevelDB, ensure the pack directory structure is correct
   - Always validate JSON syntax before committing

4. **Update Documentation**
   - Document new content in README.md if significant
   - Add inline comments in complex JSON structures
   - Update version number in module.json if releasing

### Version Management

When incrementing versions in `module.json`:
- **Patch** (1.0.X): Bug fixes, minor content additions
- **Minor** (1.X.0): New features, significant content additions
- **Major** (X.0.0): Breaking changes, major campaign milestones

### Git Workflow

This repository uses feature branches for development:

1. **Branch Naming**: `claude/claude-md-<session-id>`
2. **Commit Messages**: Use clear, descriptive messages
   - Good: "Add Chapter 1 NPCs to heirs-pack"
   - Bad: "Updated files"
3. **Before Committing**:
   - Validate JSON syntax in module.json and any JSON exports
   - Test that the module loads in FoundryVTT (if possible)
   - Review changes for sensitive information (passwords, tokens, private notes)

## Key Conventions for AI Assistants

### DO:
- ✅ Read `module.json` before making any structural changes
- ✅ Validate JSON syntax after editing configuration files
- ✅ Create necessary directories (`packs/heirs-pack/`) before adding content
- ✅ Maintain consistent formatting in JSON files (2-space indentation)
- ✅ Document significant changes in commit messages
- ✅ Respect the D&D 5e system structure and terminology
- ✅ Consider content ownership and permissions when adding to packs
- ✅ Keep campaign-specific content separate from system mechanics

### DON'T:
- ❌ Modify `module.json` ID field (breaks module identity)
- ❌ Change compatibility requirements without testing
- ❌ Remove or rename existing packs (breaks references)
- ❌ Commit invalid JSON (always validate first)
- ❌ Add content requiring missing dependencies
- ❌ Include copyrighted material without permission
- ❌ Push directly to main branch (use feature branches)
- ❌ Commit sensitive player information or spoilers in public files

## Content Guidelines

### For D&D 5e Content
- Follow official D&D 5e terminology and structure
- Use proper stat blocks for actors (CR, HP, AC, abilities, etc.)
- Include proper item properties (rarity, attunement, damage dice)
- Reference official sources when using published content
- Create custom content with campaign-specific flavor

### For Adventure Content
- Organize by story arc or chapter
- Link related content (scenes → actors → items → journals)
- Include DM notes and player handouts separately
- Use clear naming conventions (e.g., "Chapter 1 - The Beginning")
- Tag content for easy searching

### Naming Conventions
- **Packs**: lowercase-with-hyphens (e.g., "heirs-pack")
- **Folders**: PascalCase or descriptive (e.g., "Chapter1" or "npcs")
- **Entries**: Descriptive with context (e.g., "Lord Blackwood - Antagonist")

## Common Tasks

### Task: Add a New NPC
1. Determine NPC details (name, stats, role in story)
2. Create actor data (either in Foundry UI or via JSON)
3. Add to heirs-pack compendium
4. Link to relevant scenes/journals
5. Document in campaign notes

### Task: Add a New Scene/Map
1. Prepare map image files
2. Create scene configuration (grid, lighting, walls)
3. Place actors and tokens
4. Configure scene settings
5. Add to heirs-pack adventure

### Task: Add Custom Items
1. Define item properties (type, rarity, effects)
2. Create item data structure
3. Add flavor text and description
4. Include in appropriate loot tables
5. Link to relevant actors/scenes

### Task: Update Module Version
1. Test all changes in FoundryVTT
2. Update version number in module.json
3. Document changes in commit message
4. Create git tag for release (optional)
5. Push to repository

## Testing Checklist

Before committing changes:
- [ ] `module.json` is valid JSON
- [ ] All file paths in module.json are correct
- [ ] Pack directories exist and are properly structured
- [ ] No sensitive information in committed files
- [ ] JSON exports are properly formatted
- [ ] Compatibility version requirements are appropriate
- [ ] Module loads in FoundryVTT (if testing environment available)

## Troubleshooting

### Module Won't Load in Foundry
- Check module.json syntax (JSON validator)
- Verify compatibility.minimum matches your Foundry version
- Ensure all referenced paths exist
- Check Foundry console for error messages

### Content Not Appearing
- Verify pack path matches directory structure
- Check pack type matches content type
- Ensure ownership/permissions are set correctly
- Refresh compendium packs in Foundry

### Git Push Fails
- Ensure branch name starts with `claude/` and contains session ID
- Check network connectivity
- Verify you're pushing to the correct remote branch
- Retry with exponential backoff if network errors occur

## Resources

### FoundryVTT Documentation
- Module Development Guide: https://foundryvtt.com/article/module-development/
- Package Manifest: https://foundryvtt.com/article/module-manifest/
- Compendium Packs: https://foundryvtt.com/article/compendium/

### D&D 5e System
- System Documentation: https://github.com/foundryvtt/dnd5e
- Actor Data Structure: Reference dnd5e system schema
- Item Properties: Follow dnd5e item structure

### JSON Validation
- Use online validators for JSON syntax
- VSCode/IDEs with JSON schema validation
- Command line: `python -m json.tool file.json`

## Quick Reference

### File Locations
- Module manifest: `module.json`
- Main adventure pack: `packs/heirs-pack/`
- Documentation: `README.md`, `CLAUDE.md`

### Important Fields in module.json
- `id`: Unique identifier (NEVER change)
- `version`: Semantic version (update on releases)
- `compatibility`: Foundry version requirements
- `packs`: Array of compendium pack definitions
- `relationships.systems`: Required system dependencies

### Branch for Current Session
- `claude/claude-md-mikcggwn47nmm2gu-01EaFNbdqNPMjHgZFsz2rygo`

## Notes for AI Assistants

This module is in early development (version 1.0.0, minimal commits). You may be asked to:
- Set up initial pack structure
- Add campaign content (NPCs, items, locations, lore)
- Organize adventures and chapters
- Create supplementary documentation
- Maintain version control and git workflow

Always prioritize:
1. Data integrity (valid JSON, correct structure)
2. FoundryVTT compatibility
3. Campaign content organization
4. Clear documentation
5. Proper version control practices

When in doubt about FoundryVTT-specific features, ask the user or recommend testing in a Foundry instance before committing changes.
