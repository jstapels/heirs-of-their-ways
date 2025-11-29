# Source Data

This directory contains JSON exports of FoundryVTT content for version control and backup.

## Purpose

JSON files in this directory serve multiple purposes:

- **Version Control** - Track changes to game content over time
- **Backup** - Human-readable backup of campaign data
- **Import Source** - Import into FoundryVTT to create/update content
- **Collaboration** - Share content between developers
- **Migration** - Move content between Foundry worlds

## Directory Structure

- **actors/** - NPC and creature JSON exports
- **items/** - Item, spell, and equipment JSON exports
- **journals/** - Journal entry JSON exports
- **scenes/** - Scene configuration JSON exports
- **tables/** - Roll table JSON exports

## JSON Format

All files follow FoundryVTT's document JSON format for the DnD5e system (v5.2).

### File Naming Convention

Use kebab-case filenames that match the content:

```
actors/
  ├── elder-theron.json
  ├── lord-blackwood.json
  └── shadow-priest.json

items/
  ├── flaming-sword.json
  ├── crystal-of-dawn.json
  └── potion-of-healing.json

journals/
  ├── chapter-1-awakening.json
  ├── millhaven-lore.json
  └── temple-history.json
```

## Working with JSON Files

### Exporting from FoundryVTT

To export content from Foundry:

1. **Actors:** Right-click actor → Export Data → Save to `source-data/actors/`
2. **Items:** Right-click item → Export Data → Save to `source-data/items/`
3. **Journals:** Right-click journal → Export Data → Save to `source-data/journals/`
4. **Scenes:** Right-click scene → Export Data → Save to `source-data/scenes/`
5. **Tables:** Right-click table → Export Data → Save to `source-data/tables/`

### Importing to FoundryVTT

To import JSON into Foundry:

1. Navigate to appropriate tab (Actors, Items, Journal, etc.)
2. Right-click in the directory area
3. Select "Import Data"
4. Choose JSON file from this directory
5. Content will be created/updated in your world

### Generating with Claude Code

Claude can generate JSON files from campaign notes:

```
User: "Generate an NPC actor JSON for Elder Theron based on
       campaign-notes/npcs/elder-theron.md"
```

Claude will:
- Read the markdown notes
- Generate properly formatted JSON
- Save to appropriate subdirectory here
- Validate JSON syntax

## JSON Structure Overview

### Actor JSON Structure

Actors (NPCs, creatures, characters) have this general structure:

```json
{
  "name": "NPC Name",
  "type": "npc",
  "img": "path/to/token.png",
  "system": {
    "abilities": {
      "str": {"value": 10},
      "dex": {"value": 14},
      // ... other abilities
    },
    "attributes": {
      "hp": {"value": 27, "max": 27},
      "ac": {"value": 12}
    },
    "details": {
      "cr": 2,
      "type": {"value": "humanoid"}
    }
    // ... more system data
  },
  "items": [],  // Embedded items (weapons, spells, features)
  "effects": [], // Active effects
  "flags": {}
}
```

### Item JSON Structure

Items have this general structure:

```json
{
  "name": "Item Name",
  "type": "weapon",  // or "spell", "equipment", "consumable", etc.
  "img": "path/to/icon.png",
  "system": {
    "description": {
      "value": "<p>Item description with enrichers</p>"
    },
    "rarity": "common",
    "identified": true,
    "activation": {
      "type": "action",
      "cost": 1
    },
    "damage": {
      "parts": [["1d8", "slashing"]]
    }
    // ... more system data
  },
  "effects": [],
  "flags": {}
}
```

### Journal JSON Structure

Journal entries have this structure:

```json
{
  "name": "Journal Name",
  "pages": [
    {
      "name": "Page Name",
      "type": "text",
      "text": {
        "content": "<p>Content with enrichers like [[/check dex 15]]</p>",
        "format": 1
      },
      "sort": 100000
    }
  ],
  "folder": null,
  "flags": {}
}
```

## Best Practices

### Version Control

- ✅ Commit JSON files after major content changes
- ✅ Use descriptive commit messages
- ✅ Review diffs before committing
- ✅ Keep filenames consistent

### JSON Editing

- ✅ Validate JSON syntax before committing
- ✅ Use an editor with JSON formatting
- ✅ Preserve FoundryVTT data structure
- ✅ Test imports in Foundry before committing
- ❌ Don't manually edit complex nested structures
- ❌ Don't break JSON syntax
- ❌ Don't change _id fields unnecessarily

### File Organization

- ✅ One file per actor/item/journal
- ✅ Use subdirectories for categories if needed
- ✅ Keep related content together
- ❌ Don't duplicate content
- ❌ Don't mix content types in same directory

## Workflow Integration

### Claude Code Workflow

1. **Write notes** in `campaign-notes/`
2. **Ask Claude** to generate JSON from notes
3. **Review JSON** in this directory
4. **Import to Foundry** to test
5. **Commit to git** when satisfied

### Manual Workflow

1. **Create content** in FoundryVTT UI
2. **Export to JSON** to this directory
3. **Commit to git** for version control
4. **Import elsewhere** as needed

### Hybrid Workflow

1. **Generate base JSON** with Claude from notes
2. **Import to Foundry** for initial creation
3. **Refine in Foundry** UI
4. **Export updated JSON** back here
5. **Commit final version** to git

## Common Tasks

### Task: Add New NPC

1. Generate or export JSON to `actors/npc-name.json`
2. Validate JSON syntax
3. Import to Foundry to test
4. Commit to git:
   ```bash
   git add source-data/actors/npc-name.json
   git commit -m "Add NPC: Name (brief description)"
   ```

### Task: Update Existing Content

1. Make changes in Foundry UI
2. Export updated JSON
3. Review changes:
   ```bash
   git diff source-data/actors/npc-name.json
   ```
4. Commit if acceptable:
   ```bash
   git add source-data/actors/npc-name.json
   git commit -m "Update NPC stats for balance"
   ```

### Task: Share Content

1. Ensure JSON is committed and pushed
2. Collaborator pulls latest changes
3. They import JSON from this directory
4. Content appears in their Foundry world

## Troubleshooting

### Import Fails

**Problem:** JSON import fails in Foundry

**Solutions:**
- Validate JSON syntax (use online validator)
- Check FoundryVTT version compatibility (v13+)
- Check DnD5e system version compatibility (v5.2+)
- Verify all referenced files/paths exist
- Check console for specific error messages

### Wrong Data Structure

**Problem:** Content doesn't look right after import

**Solutions:**
- Compare against working export from Foundry
- Check system data model documentation
- Verify item/actor type matches JSON structure
- Re-export from Foundry to get correct structure

### Merge Conflicts

**Problem:** Git merge conflicts in JSON files

**Solutions:**
- Accept one version entirely (don't manually merge JSON)
- Re-export from Foundry after resolving
- Test both versions in Foundry before choosing
- Consider restructuring workflow to avoid conflicts

## Important Notes

### Don't Edit Directly

Unless you're experienced with FoundryVTT JSON structure:
- **Prefer:** Create in Foundry, export to here
- **Or:** Use Claude to generate from notes
- **Avoid:** Manually editing complex JSON

### UUIDs and IDs

- `_id` fields should be unique within a world
- When importing, Foundry may assign new IDs
- `@UUID` references in content should be updated after import
- Use relative references when possible

### Image Paths

JSON references image paths:
```json
"img": "modules/heirs-of-their-ways/assets/tokens/elder-theron.png"
```

Ensure paths match your actual asset locations.

### Embedded Documents

Actors can have embedded items (weapons, spells, features):
- These are nested in the `items` array
- Each has its own complete item structure
- Export/import maintains these relationships

---

## Resources

- [FoundryVTT API Documentation](https://foundryvtt.com/api/v13/)
- [DnD5e System GitHub](https://github.com/foundryvtt/dnd5e)
- [JSON Validator](https://jsonlint.com/)
- [FoundryVTT Module Development Guide](https://foundryvtt.com/article/module-development/)

---

*JSON files generated for FoundryVTT v13 and DnD5e v5.2*
