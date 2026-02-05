# Campaign Development Workflow

This guide explains the workflow for developing content for the Heirs of Their Ways campaign module using Claude Code and FoundryVTT.

## Directory Structure

```
heirs-of-their-ways/
├── module.json                    # FoundryVTT module manifest
├── package.json                   # NPM configuration for build scripts
├── AGENTS.md                      # AI assistant guide
├── README.md                      # Project overview
├── docs/                          # Documentation
│   ├── ENRICHERS.md              # Text enrichers reference
│   └── WORKFLOW.md               # This file
├── utils/                         # Build utilities
│   ├── build-yaml.mjs            # Markdown → YAML compiler
│   └── packs.mjs                 # Pack compilation script
├── src/                          # Markdown notes for campaign content
│   ├── module/                   # Module-level content
│   │   ├── actors/
│   │   ├── items/
│   │   ├── features/
│   │   ├── journals/
│   │   ├── scenes/
│   │   ├── tables/
│   │   └── assets/               # Module assets (source)
│   └── adventures/               # Adventure-specific content
│       └── <adventure>/          # e.g., fight-the-dragon/
│           ├── actors/
│           ├── items/
│           ├── features/
│           ├── journals/
│           ├── scenes/
│           ├── tables/
│           └── assets/           # Adventure assets (source)
├── source-data/                   # Legacy JSON exports (optional)
│   └── README.md
├── packs/                         # Compendium packs (generated)
│   ├── _source/                  # YAML source files (generated)
│   │   ├── heirs-actors/
│   │   ├── heirs-items/
│   │   ├── heirs-features/
│   │   ├── heirs-journals/
│   │   ├── heirs-scenes/
│   │   └── heirs-tables/
│   ├── heirs-actors/             # Compiled LevelDB (generated)
│   ├── heirs-items/
│   ├── heirs-features/
│   ├── heirs-journals/
│   ├── heirs-scenes/
│   └── heirs-tables/
├── assets/                        # Built assets (generated)
└── node_modules/                  # NPM dependencies (auto-generated)
```

## Workflow Overview

This module uses a **markdown-first + YAML build system** for managing compendium content. There are two primary workflows:

### Recommended Workflow: Markdown Source Files

**Best for:** Version control, collaboration, and maintainability

1. Edit markdown files in `src/` (frontmatter defines type/system/data)
2. Run `npm run build` to compile markdown → YAML → LevelDB
3. Test in FoundryVTT
4. Commit markdown + source assets to git (no build artifacts)

### Alternative Workflow: Direct FoundryVTT Editing (Extract → YAML)

**Best for:** Complex content requiring visual editing

1. Create/edit content in FoundryVTT UI
2. Run `npm run extract:packs` to generate YAML sources
3. Use extracted YAML as reference, then migrate changes into `src/`
4. Rebuild and share

---

## Source Layout

- `src/module/` holds module-level content shared across adventures.
- `src/adventures/<adventure>/` holds adventure-specific content.
- Place media in the nearest `assets/` folder and reference it with relative paths.

## YAML Build System

### Quick Start

```bash
# First time setup
npm install

# Build markdown → YAML → packs
npm run build          # runs build:yaml then build:packs

# Edit markdown in src/

# Build the compendium packs
npm run build:packs

# Refresh FoundryVTT (F5) to see changes
```

### Build Commands

```bash
npm run build                    # Full build: markdown → YAML → packs
npm run build:assets             # Copy src assets → assets/
npm run build:yaml               # Compile markdown in src/ → packs/_source/*
npm run build:packs              # Compile all YAML → LevelDB
npm run build:packs -- heirs-actors  # Compile specific pack

npm run extract:packs            # Extract all LevelDB → YAML
npm run extract:packs -- heirs-actors # Extract specific pack

npm run clean:packs              # Standardize YAML formatting
npm run create -- my-new-adventure # Create a new adventure scaffold
```

### Markdown-First Flow
- Author everything in `src/` with frontmatter keys (`type`, `pack`, `folder`, `img`, `system`, `effects`, `items`, `prototypeToken`, etc.).
- Use `document:` in frontmatter to merge arbitrary top-level Foundry fields (tokens, walls, lights, scene settings).
- Inline `foundry-yaml` blocks are not supported; keep all data in frontmatter.
- Place media in `src/**/assets/` and reference them with relative paths in frontmatter or markdown image links.
- Run `npm run build:yaml` to emit pack sources in `packs/_source/`, then `npm run build:packs` to compile LevelDB packs.
- Adventure root files named `overview.md` or `adventure.md` default to `type: adventure` if not specified.

### Frontmatter Pass-Through

Any valid DnD5e document fields can be defined in frontmatter under `system`, including requirements/prerequisites:

```yaml
---
type: item
name: Ring of Protection
system:
  requirements: "Requires attunement by a creature"
---
```

### Description Sections (Actors & Items)
Use H2 sections to target common description fields:
- `## Description` → `system.description.value`
- `## Chat` → `system.description.chat`
- `## Unidentified` → `system.unidentified.description`
- `## Biography` → `system.details.biography.value`
- `## Public Biography` → `system.details.biography.public`

For any other field, add an explicit path on the header:
```markdown
## GM Notes {.flags.heirs.gmNotes}
```

Note: For non-journal documents, H2 sections without a mapping or explicit path are ignored.

### Why YAML?

- **Human-readable** - Easy to edit in any text editor
- **Version control** - Git can show meaningful diffs
- **Comments** - Document your content inline
- **Merge-friendly** - Avoid binary LevelDB merge conflicts
- **Industry standard** - Same approach as official dnd5e system

See [docs/DND5E-YAML-STRUCTURE.md](DND5E-YAML-STRUCTURE.md) for complete YAML documentation.

---

## Markdown Journal System

**Journals are now built from markdown files** in `src/`. This provides a better authoring experience for narrative content.

### How It Works

1. Write content in `src/` as normal markdown files
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

### Images in Markdown

You can embed images directly in journal content using standard markdown syntax:

```markdown
![Coral Veil Map](../assets/maps/coral-veil-map.webp)
```

Relative asset paths are rewritten to `modules/<moduleId>/assets/...` during the build.

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

The following files are **not** compiled:
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
npm run build                    # Build markdown → YAML → packs
npm run build:yaml               # Build only markdown → YAML
npm run build:packs              # Build only packs (YAML → LevelDB)
```

### Example Workflow

1. Edit `src/adventures/coral-veil/overview.md`
2. Run `npm run build`
3. Refresh FoundryVTT to see updated journal

---

## Common Tasks

### Task: Create a New NPC (Actor)

1. **Create a markdown file** in `src/module/actors/`:
   ```markdown
   ---
   type: actor
   name: Lord Blackwood
   img: ../assets/tokens/blackwood.webp
   system:
     type: npc
     details:
       type:
         value: humanoid
         subtype: human noble
       alignment: lawful evil
       cr: 4
     abilities:
       str: { value: 10 }
       dex: { value: 14 }
       con: { value: 14 }
       int: { value: 16 }
       wis: { value: 13 }
       cha: { value: 18 }
     attributes:
       ac: { flat: 15, calc: flat }
       hp: { value: 52, max: 52 }
       movement: { walk: 30 }
   ---
   # Lord Blackwood
   *Human noble, lawful evil*

   ## Biography
   A corrupt noble who secretly worships dark powers...

   ## Public Biography {.system.details.biography.public}
   A polished public-facing summary for players.
   ```

2. **Build and test**:
   ```bash
   npm run build
   ```

### Task: Create a Magic Item

1. **Create a markdown file** in `src/module/items/` with frontmatter:
   ```markdown
   ---
   type: item
   name: Flaming Longsword
   img: ../assets/images/flaming-longsword.webp
   system:
     type:
       value: weapon
       baseItem: longsword
     rarity: rare
     attunement: required
     damage:
       base:
         number: 1
         denomination: 8
         types: [slashing]
   ---
   *Weapon (longsword), rare (requires attunement)*

   ## Description
   This sword bursts into flame when drawn...
   - **Properties:** Versatile (1d10)
   - **Attunement:** Required

   ## Special Features
   - Bonus action to control flame brightness
   - Sheds bright light 20ft, dim 20ft
   ```

2. **Optional: Ask Claude to draft frontmatter + markdown**
   ```
   User: "Generate a frontmatter-first markdown file for the Flaming Longsword item"
   ```

3. **Build and verify** - `npm run build`

### Task: Create a Journal Adventure

1. **Write Adventure Notes** - Create `src/adventures/chapter-1/overview.md`
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

2. **Build and verify**
   ```
   npm run build
   ```

3. **Open in Foundry** - Check the entry in "Heirs: Journals"

### Task: Create a Scene

1. **Prepare Assets**
   - Save map image to `src/adventures/chapter-1/assets/maps/millhaven-square.jpg`
   - Save token images to `src/adventures/chapter-1/assets/tokens/`

2. **Create Scene in markdown**
   - Use `type: scene` and `document:` frontmatter
   - Include grid, walls, lights, and tokens in `document:`

   **Alternative (Foundry-first):**
   - Create the scene in Foundry
   - Run `npm run extract:packs` to get YAML sources (for reference)

3. **Commit to Git**
   ```bash
   git add src/adventures/chapter-1/assets/maps/millhaven-square.jpg
   git add src/adventures/chapter-1/scenes/
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
1. Preserve enricher syntax when drafting markdown
2. Understand the game mechanics in your notes
3. Generate appropriate frontmatter/YAML structure

### Testing Enrichers

Always test enrichers in FoundryVTT after import:
1. View the journal/item/actor in Foundry
2. Click on enriched elements to verify they work
3. Check that tooltips display correctly
4. Verify dice rolls function properly

---

## Foundry-First Extraction

If you create or edit content in Foundry, extract YAML sources with:

```bash
npm run extract:packs
```

Use the extracted YAML as a reference, then migrate changes into `src/`.

---

## Best Practices

### Naming Conventions

- **Files:** kebab-case (e.g., `lord-blackwood.md`, `flaming-sword.md`)
- **Folders:** kebab-case (e.g., `src/module`, `src/adventures`)
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
- **Source Location:** Store assets in `src/**/assets/` and let the build copy them to `assets/`
- **Attribution:** Note sources and licenses

---

## Troubleshooting

### Build Fails
- **Check Syntax:** Validate YAML/frontmatter formatting
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
- **AGENTS.md** - AI assistant guide for this project
- **ENRICHERS.md** - Complete enricher reference
- **README.md** - Project overview

### External Resources
- [FoundryVTT Module Development](https://foundryvtt.com/article/module-development/)
- [FoundryVTT Compendium Packs](https://foundryvtt.com/article/compendium/)
- [DnD5e System Wiki](https://github.com/foundryvtt/dnd5e/wiki)
- [FoundryVTT v13 API](https://foundryvtt.com/api/v13/)

---

*This workflow is optimized for collaboration between human GMs and Claude Code to efficiently create and manage campaign content.*
