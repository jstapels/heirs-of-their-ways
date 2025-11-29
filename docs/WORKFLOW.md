# Campaign Development Workflow

This guide explains the workflow for developing content for the Heirs of Their Ways campaign module using Claude Code and FoundryVTT.

## Directory Structure

```
heirs-of-their-ways/
├── module.json                    # FoundryVTT module manifest
├── CLAUDE.md                      # AI assistant guide
├── README.md                      # Project overview
├── docs/                          # Documentation
│   ├── ENRICHERS.md              # Text enrichers reference
│   └── WORKFLOW.md               # This file
├── campaign-notes/                # Markdown notes for campaign content
│   ├── adventures/               # Adventure outlines and session notes
│   ├── npcs/                     # NPC descriptions and backgrounds
│   ├── locations/                # Location descriptions
│   ├── items/                    # Custom item descriptions
│   └── lore/                     # World lore and background
├── source-data/                   # JSON exports from Foundry
│   ├── actors/                   # NPC/creature JSON files
│   ├── items/                    # Item JSON files
│   ├── journals/                 # Journal entry JSON files
│   ├── scenes/                   # Scene JSON files
│   └── tables/                   # Roll table JSON files
├── assets/                        # Media assets
│   ├── maps/                     # Map images for scenes
│   ├── tokens/                   # Token artwork
│   ├── images/                   # Other images
│   └── sounds/                   # Audio files
└── packs/                         # Compendium packs (LevelDB)
    └── heirs-pack/               # Main adventure pack
```

## Workflow Overview

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
