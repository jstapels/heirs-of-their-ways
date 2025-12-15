# Campaign Development Workflow

This guide explains the workflow for developing content for the Heirs of Their Ways campaign module using Claude Code and FoundryVTT.

## Directory Structure

```
heirs-of-their-ways/
├── module.json                    # FoundryVTT module manifest
├── package.json                   # NPM configuration for build scripts
├── CLAUDE.md                      # AI assistant guide
├── README.md                      # Project overview
├── docs/                          # Documentation
│   ├── ENRICHERS.md              # Text enrichers reference
│   └── WORKFLOW.md               # This file
├── utils/                         # Build utilities
│   ├── build-journals.mjs        # Markdown → Journal YAML compiler
│   └── packs.mjs                 # Pack compilation script
├── campaign-notes/                # Markdown notes for campaign content
│   ├── adventures/               # Adventure outlines and session notes
│   ├── npcs/                     # NPC descriptions and backgrounds
│   ├── locations/                # Location descriptions
│   ├── items/                    # Custom item descriptions
│   └── lore/                     # World lore and background
├── source-data/                   # JSON exports (legacy/backup)
│   ├── actors/                   # NPC/creature JSON files
│   ├── items/                    # Item JSON files
│   ├── journals/                 # Journal entry JSON files
│   ├── scenes/                   # Scene JSON files
│   └── tables/                   # Roll table JSON files
├── packs/                         # Compendium packs
│   ├── _source/                  # YAML source files (edit these!)
│   │   └── heirs-pack/          # Main campaign pack sources
│   │       ├── actors/          # NPC YAML files
│   │       ├── items/           # Item YAML files
│   │       ├── journals/        # Journal YAML files
│   │       ├── scenes/          # Scene YAML files
│   │       └── tables/          # Table YAML files
│   └── heirs-pack/               # Compiled LevelDB (generated)
├── assets/                        # Media assets
│   ├── maps/                     # Map images for scenes
│   ├── tokens/                   # Token artwork
│   ├── images/                   # Other images
│   └── sounds/                   # Audio files
└── node_modules/                  # NPM dependencies (auto-generated)
```

## Workflow Overview

This module uses a **modern YAML-based build system** for managing compendium content. There are two primary workflows:

### Recommended Workflow: YAML Source Files

**Best for:** Version control, collaboration, and maintainability

1. Edit YAML files in `packs/_source/heirs-pack/`
2. Run `npm run build:packs` to compile to LevelDB
3. Test in FoundryVTT
4. Commit YAML sources to git

### Alternative Workflow: Direct FoundryVTT Editing

**Best for:** Complex content requiring visual editing

1. Create/edit content in FoundryVTT UI
2. Run `npm run extract:packs` to generate YAML sources
3. Commit YAML sources to git
4. Share with collaborators

---

## YAML Build System

### Quick Start

```bash
# First time setup
npm install

# Build markdown → YAML → packs
npm run build          # runs build:yaml then build:packs

# Edit YAML files in packs/_source/heirs-pack/
# (actors, items, journals, scenes, tables)

# Build the compendium packs
npm run build:packs

# Refresh FoundryVTT (F5) to see changes
```

### Build Commands

```bash
npm run build                    # Full build: markdown → YAML → packs
npm run build:yaml               # Compile markdown in campaign-notes/ → packs/_source/*
npm run build:packs              # Compile all YAML → LevelDB
npm run build:packs -- heirs-pack  # Compile specific pack

npm run extract:packs            # Extract all LevelDB → YAML
npm run extract:packs -- heirs-pack # Extract specific pack

npm run clean:packs              # Standardize YAML formatting
```

### Markdown-First Flow
- Author everything in `campaign-notes/` with frontmatter keys (`type`, `pack`, `folder`, `img`, `system`, `embedded_items`, etc.).
- Optional fenced blocks ```foundry-yaml``` can describe complex payloads (activities/effects/tokens) and are merged into the generated YAML.
- Run `npm run build:yaml` to emit pack sources in `packs/_source/`, then `npm run build:packs` to compile LevelDB packs.

### Why YAML?

- **Human-readable** - Easy to edit in any text editor
- **Version control** - Git can show meaningful diffs
- **Comments** - Document your content inline
- **Merge-friendly** - Avoid binary LevelDB merge conflicts
- **Industry standard** - Same approach as official dnd5e system

See [packs/_source/README.md](../packs/_source/README.md) for complete YAML documentation.

---

## Markdown Journal System

**Journals are now built from markdown files** in `campaign-notes/`. This provides a better authoring experience for narrative content.

### How It Works

1. Write content in `campaign-notes/` as normal markdown files
2. The build system automatically converts markdown → journal YAML
3. Journal YAML is then compiled into the LevelDB pack

### Markdown Format

```markdown
---
# Optional YAML frontmatter
_id: MyJournalId00000   # Custom journal ID (auto-generated if omitted)
folder: FolderIdHere0   # Folder ID in the pack
ownership: 0            # Default ownership (0 = GM only)
---
# Journal Title

Content before the first H2 becomes part of the "Overview" page.

## First Page Title

Content for the first page...

## Second Page Title

Content for the second page...
```

### Page Splitting

- **H1 (`#`)** becomes the journal name
- **H2 (`##`)** headers create new pages
- Content between H2 headers becomes each page's content
- Tables, lists, blockquotes, and enrichers are preserved

### Preserved Enrichers

The markdown compiler preserves FoundryVTT enricher syntax:
- `[[/check Perception 15]]` - Skill checks
- `[[/damage 2d6 fire]]` - Damage rolls
- `[[/save DEX 14]]` - Saving throws
- `@UUID[...]` - Document links
- `&Reference[stunned]` - Condition references

### Excluded Files

The following files are **not** compiled to journals:
- `*-template.md` files
- `README.md` files
- Files in `sessions/` directory (DM notes only)

To explicitly exclude a file, add `journal: false` to frontmatter:
```markdown
---
journal: false
---
# This won't become a journal
```

### Build Commands

```bash
npm run build                    # Build journals + packs (full build)
npm run build:yaml               # Build only journals (markdown → YAML)
npm run build:packs              # Build only packs (YAML → LevelDB)
```

### Example Workflow

1. Edit `campaign-notes/adventures/coral-veil.md`
2. Run `npm run build`
3. Refresh FoundryVTT to see updated journal

---

## Traditional Workflow (Legacy)

The following workflow uses the `source-data/` directory for JSON exports. This is maintained for compatibility but **YAML sources are recommended** for new content.

### Phase 1: Planning and Note-Taking

1. **Write Campaign Notes** - Create markdown files in `campaign-notes/`
   - Document adventures, NPCs, locations, items, and lore
   - Use descriptive filenames (e.g., `chapter-1-the-awakening.md`)
   - Include stat blocks, descriptions, and story elements
   - Use FoundryVTT enricher syntax where appropriate

2. **Organize Assets** - Collect media files in `assets/`
   - Maps go in `assets/maps/`
   - Token artwork in `assets/tokens/`
   - Background images in `assets/images/`
   - Sound effects and music in `assets/sounds/`

### Phase 2: Content Creation with Claude

3. **Generate JSON Data** - Use Claude Code to convert notes to Foundry JSON
   - Claude reads campaign notes from markdown files
   - Claude generates properly formatted JSON for actors, items, etc.
   - Claude saves JSON to appropriate `source-data/` subdirectory
   - Validate JSON syntax before committing

4. **Create Journal Entries** - Use Claude to format adventures and lore
   - Convert markdown notes to FoundryVTT journal format
   - Add enrichers for interactive elements (@Check, @Damage, etc.)
   - Include @UUID links to related content
   - Export as JSON to `source-data/journals/`

### Phase 3: Import to FoundryVTT

5. **Import Content to Foundry**
   - Open FoundryVTT and navigate to the appropriate tab (Actors, Items, Journal)
   - Right-click in the directory and select "Import Data"
   - Select JSON files from `source-data/`
   - Review and edit in Foundry UI as needed

6. **Organize in Compendium**
   - Create or open the compendium pack (heirs-pack)
   - Drag imported content into the compendium
   - Organize using folders within the compendium
   - Set appropriate ownership/permissions

### Phase 4: Version Control

7. **Commit Changes**
   - Review changes with `git status` and `git diff`
   - Stage JSON files: `git add source-data/`
   - Stage assets: `git add assets/`
   - Create descriptive commit message
   - Push to feature branch

8. **Backup Compendium** (Optional)
   - Export compendium content to JSON periodically
   - Store in `source-data/` for version control backup
   - Note: LevelDB files in `packs/` are binary and harder to version

---

## Common Tasks

### Task: Create a New NPC

1. **Write NPC Notes** - Create `campaign-notes/npcs/npc-name.md`
   ```markdown
   # Lord Blackwood

   *Human Noble, Neutral Evil*

   ## Description
   A corrupt noble who secretly worships dark powers...

   ## Stats
   - **AC:** 15 (studded leather)
   - **HP:** 52 (8d8 + 16)
   - **Speed:** 30 ft.
   - **STR:** 10, **DEX:** 14, **CON:** 14, **INT:** 16, **WIS:** 13, **CHA:** 18

   ## Actions
   - **Rapier:** [[/attack +4]] to hit, [[/damage 1d8+2 piercing]]
   - **Command:** Target must make [[/save wis 15]] or obey
   ```

2. **Ask Claude to Generate JSON**
   ```
   User: "Generate an NPC actor JSON for Lord Blackwood based on
          campaign-notes/npcs/lord-blackwood.md"
   ```

3. **Claude Generates JSON** - Saves to `source-data/actors/lord-blackwood.json`

4. **Import to Foundry**
   - Right-click Actors tab → Import Data
   - Select `source-data/actors/lord-blackwood.json`
   - Review and adjust in Foundry

5. **Add to Compendium**
   - Open heirs-pack compendium
   - Drag Lord Blackwood into compendium
   - Organize in appropriate folder

### Task: Create a Magic Item

1. **Write Item Notes** - Create `campaign-notes/items/flaming-sword.md`
   ```markdown
   # Flaming Longsword

   *Weapon (longsword), rare (requires attunement)*

   ## Description
   This sword bursts into flame when drawn...

   ## Properties
   - **Type:** Longsword
   - **Rarity:** Rare
   - **Damage:** 1d8 slashing + 1d6 fire
   - **Properties:** Versatile (1d10)
   - **Attunement:** Required

   ## Special Features
   - Bonus action to control flame brightness
   - Sheds bright light 20ft, dim 20ft
   ```

2. **Generate with Claude**
   ```
   User: "Generate an item JSON for the Flaming Longsword"
   ```

3. **Import and Add to Compendium** - Same process as NPC

### Task: Create a Journal Adventure

1. **Write Adventure Notes** - Create `campaign-notes/adventures/chapter-1.md`
   ```markdown
   # Chapter 1: The Awakening

   ## Synopsis
   The adventurers arrive in @UUID[Scene.village123]{Millhaven}...

   ## Act 1: Arrival
   The party meets @UUID[Actor.blackwood123]{Lord Blackwood}...

   ## Encounters

   ### 1. Bandits on the Road
   Three bandits attack! Initiative [[/roll 1d20+2]]

   **Tactics:** They demand [[/check int 12]] to negotiate...
   ```

2. **Convert with Claude**
   ```
   User: "Convert chapter-1.md into a FoundryVTT journal entry JSON
          with proper enrichers"
   ```

3. **Import and Organize** - Import to Journal tab, add to compendium

### Task: Create a Scene

1. **Prepare Assets**
   - Save map image to `assets/maps/millhaven-square.jpg`
   - Save token images to `assets/tokens/`

2. **Create Scene in Foundry**
   - Create new scene, upload map
   - Configure grid, walls, lighting
   - Place tokens from actors
   - Export scene JSON to `source-data/scenes/millhaven-square.json`

3. **Commit to Git**
   ```bash
   git add assets/maps/millhaven-square.jpg
   git add source-data/scenes/millhaven-square.json
   git commit -m "Add Millhaven Square scene with map"
   ```

---

## Working with Enrichers

### Planning for Enrichers

When writing campaign notes in markdown, use enricher syntax directly:

```markdown
# Trap Description

Characters must make [[/check int 12]] to spot the trap.
If triggered, each character takes [[/damage 2d6 fire average]].
A [[/save dex 15]] reduces damage by half.
```

This allows Claude to:
1. Preserve enricher syntax when converting to JSON
2. Understand the game mechanics in your notes
3. Generate appropriate JSON structure

### Testing Enrichers

Always test enrichers in FoundryVTT after import:
1. View the journal/item/actor in Foundry
2. Click on enriched elements to verify they work
3. Check that tooltips display correctly
4. Verify dice rolls function properly

---

## JSON Export from FoundryVTT

### Exporting Actors
1. Right-click actor in Actors tab
2. Select "Export Data"
3. Save to `source-data/actors/actor-name.json`

### Exporting Items
1. Right-click item in Items tab
2. Select "Export Data"
3. Save to `source-data/items/item-name.json`

### Exporting Journals
1. Right-click journal in Journal tab
2. Select "Export Data"
3. Save to `source-data/journals/journal-name.json`

### Exporting Scenes
1. Right-click scene in Scenes tab
2. Select "Export Data"
3. Save to `source-data/scenes/scene-name.json`

---

## Best Practices

### Naming Conventions

- **Files:** kebab-case (e.g., `lord-blackwood.md`, `flaming-sword.json`)
- **Folders:** kebab-case (e.g., `campaign-notes`, `source-data`)
- **Actors/Items in notes:** Descriptive with context (e.g., "Lord Blackwood - Antagonist")
- **Compendium entries:** Clear, searchable names

### Content Organization

- **By Chapter/Arc:** Organize adventures by story progression
- **By Type:** Separate NPCs, locations, items
- **By Region:** Group content by geographic location
- **By Encounter:** Link related content together

### Version Control

- **Commit Frequently:** Small, focused commits
- **Descriptive Messages:** Explain what and why
- **Feature Branches:** Use claude/ branches for development
- **Review Before Push:** Check git diff before committing

### Asset Management

- **Optimize Images:** Compress large map files
- **Consistent Naming:** Match asset names to content
- **Organize by Type:** Keep maps, tokens, images separate
- **Attribution:** Note sources and licenses

---

## Troubleshooting

### JSON Import Fails
- **Check Syntax:** Validate JSON with online validator
- **Check Version:** Ensure compatible with Foundry v13 / DnD5e v5.2
- **Check Paths:** Verify file paths for images/assets
- **Check UUIDs:** Ensure referenced UUIDs exist

### Enrichers Don't Work
- **Check Syntax:** Compare against docs/ENRICHERS.md
- **Check Context:** Some enrichers only work on actors
- **Check Version:** Verify enricher exists in your Foundry/system version
- **Test in Foundry:** View content in Foundry to see errors

### Compendium Issues
- **Missing Content:** Verify import completed successfully
- **Wrong Type:** Check pack type matches content (Actor, Item, etc.)
- **Permissions:** Check ownership settings in module.json
- **Locks:** Unlock compendium in Foundry to edit

---

## Resources

### Documentation
- **CLAUDE.md** - AI assistant guide for this project
- **ENRICHERS.md** - Complete enricher reference
- **README.md** - Project overview

### External Resources
- [FoundryVTT Module Development](https://foundryvtt.com/article/module-development/)
- [FoundryVTT Compendium Packs](https://foundryvtt.com/article/compendium/)
- [DnD5e System Wiki](https://github.com/foundryvtt/dnd5e/wiki)
- [FoundryVTT v13 API](https://foundryvtt.com/api/v13/)

---

*This workflow is optimized for collaboration between human GMs and Claude Code to efficiently create and manage campaign content.*
