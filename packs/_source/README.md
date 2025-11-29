# Pack Source Files

This directory contains human-readable YAML source files for all compendium packs. These files are compiled into LevelDB format for use in FoundryVTT.

## Why YAML Source Files?

Instead of editing content directly in FoundryVTT's binary LevelDB databases, we maintain source files that are:

- **Human-readable** - Easy to read and edit in any text editor
- **Version controllable** - Git can track changes and show meaningful diffs
- **Documentable** - YAML supports comments for notes and documentation
- **Collaborative** - Multiple people can edit different files without conflicts
- **Reviewable** - Pull requests show exactly what changed

## Directory Structure

```
packs/_source/
└── heirs-pack/           # Main campaign pack
    ├── actors/           # NPCs and creatures (YAML files)
    ├── items/            # Items, spells, features (YAML files)
    ├── journals/         # Journal entries (YAML files)
    ├── scenes/           # Scenes and maps (YAML files)
    └── tables/           # Roll tables (YAML files)
```

Each subdirectory contains YAML files, one per document (actor, item, etc.).

## Workflow

### 1. Edit Source Files

Edit YAML files in this directory:

```yaml
# packs/_source/heirs-pack/actors/elder-theron.yaml
name: Elder Theron
type: npc
img: modules/heirs-of-their-ways/assets/tokens/elder-theron.png
system:
  abilities:
    str: {value: 10}
    dex: {value: 10}
    con: {value: 12}
    int: {value: 14}
    wis: {value: 18}
    cha: {value: 16}
  attributes:
    hp:
      value: 27
      max: 27
    ac: {value: 12}
  # ... more fields
```

### 2. Compile to LevelDB

Compile YAML → LevelDB for FoundryVTT:

```bash
npm run build:packs              # Compile all packs
npm run build:packs -- heirs-pack  # Compile specific pack
```

This creates/updates the LevelDB files in `packs/heirs-pack/` that FoundryVTT reads.

### 3. Extract from LevelDB

If you edited content in FoundryVTT and want to update source files:

```bash
npm run extract:packs              # Extract all packs
npm run extract:packs -- heirs-pack  # Extract specific pack
```

This extracts LevelDB → YAML and updates this directory.

### 4. Clean Source Files

Standardize formatting across all source files:

```bash
npm run clean:packs
```

## Creating New Content

### Method 1: Create YAML Directly

1. Create a new `.yaml` file in the appropriate subdirectory
2. Use existing files as templates
3. Run `npm run build:packs` to compile
4. Test in FoundryVTT

### Method 2: Create in FoundryVTT, Then Extract

1. Create content in FoundryVTT UI
2. Add to compendium pack
3. Run `npm run extract:packs` to create YAML source
4. Edit YAML file to add comments or make changes
5. Run `npm run build:packs` to rebuild

### Method 3: Use Claude to Generate

1. Write markdown notes in `campaign-notes/`
2. Ask Claude to generate YAML from notes
3. Run `npm run build:packs` to compile

## YAML Format

### Actor Example

```yaml
# Elder Theron - Village Priest
# Appears in Chapter 1: The Awakening
name: Elder Theron
type: npc
img: modules/heirs-of-their-ways/assets/tokens/elder-theron.png

system:
  abilities:
    str: {value: 10, proficient: 0}
    dex: {value: 10, proficient: 0}
    con: {value: 12, proficient: 0}
    int: {value: 14, proficient: 0}
    wis: {value: 18, proficient: 1}  # Saving throw proficiency
    cha: {value: 16, proficient: 0}

  attributes:
    hp:
      value: 27
      max: 27
      formula: 5d8 + 5
    ac: {value: 12}
    movement: {walk: 30}

  details:
    cr: 2
    source: {custom: "Heirs Campaign"}
    type: {value: humanoid, subtype: human}
    alignment: lg  # Lawful Good

  traits:
    size: med
    di: {value: []}  # Damage immunities
    dr: {value: []}  # Damage resistances
    dv: {value: []}  # Damage vulnerabilities
    ci: {value: []}  # Condition immunities

  # Embedded items (spells, features, equipment)
  items:
    - name: Staff
      type: weapon
      # ... weapon details

    - name: Cure Wounds
      type: spell
      # ... spell details

# Ownership and permissions
ownership:
  default: 0  # None for players by default

# Sorting order in compendium
sort: 0
```

### Item Example

```yaml
# Crystal of Dawn - Magic Item
# Found in Chapter 1: The Awakening Chamber
name: Crystal of Dawn
type: consumable  # or: weapon, equipment, spell, feat, etc.
img: modules/heirs-of-their-ways/assets/images/crystal-dawn.png

system:
  description:
    value: >-
      <p>A fist-sized crystal that glows with warm sunlight...</p>
      <p><strong>Radiant Burst:</strong> Once per day, emit a burst
      requiring all within 20ft to make [[/save con 14]] or take
      [[/damage 3d6 radiant]].</p>

  rarity: uncommon
  identified: true
  attunement: required

  # Item properties
  activation:
    type: action
    cost: 1

  # Effects and damage
  damage:
    parts:
      - [3d6, radiant]

  save:
    ability: con
    dc: 14
    scaling: flat

ownership:
  default: 0
sort: 0
```

### Journal Example

```yaml
# Chapter 1: The Awakening
name: "Chapter 1: The Awakening"
pages:
  - name: Synopsis
    type: text
    title: {show: true, level: 1}
    text:
      format: 1  # HTML
      content: >-
        <h1>Chapter 1: The Awakening</h1>
        <p>The adventurers arrive in @UUID[Scene.xyz123]{Millhaven}...</p>
    sort: 100000

  - name: "Act 1: Arrival"
    type: text
    title: {show: true, level: 2}
    text:
      format: 1
      content: >-
        <h2>Act 1: Arrival in Millhaven</h2>
        <p>Players meet @UUID[Actor.abc123]{Elder Theron}...</p>
    sort: 200000

ownership:
  default: 2  # OBSERVER - Players can read
sort: 0
```

## YAML Tips

### Comments

```yaml
# This is a comment
name: Elder Theron  # Inline comment
```

### Multiline Text

```yaml
# Block scalar (preserves newlines)
description: |
  First paragraph.

  Second paragraph.

# Folded scalar (wraps into single line)
description: >-
  This long text will be wrapped
  into a single line with spaces.
```

### Lists

```yaml
# Inline list
resistances: [fire, cold]

# Block list
resistances:
  - fire
  - cold
```

### Objects

```yaml
# Inline object
hp: {value: 27, max: 27}

# Block object
hp:
  value: 27
  max: 27
```

## Best Practices

### ✅ Do:
- Use comments to document purpose and context
- Keep consistent indentation (2 spaces)
- Name files descriptively (elder-theron.yaml not npc1.yaml)
- Include enrichers in descriptions (e.g., `[[/damage 2d6 fire]]`)
- Test changes by building and checking in FoundryVTT
- Commit source files to git after changes

### ❌ Don't:
- Mix tabs and spaces
- Edit both YAML and LevelDB (choose one workflow)
- Forget to rebuild after editing YAML
- Include sensitive or private information
- Use special characters in filenames

## Troubleshooting

### Build fails with "Invalid YAML"

**Problem:** Syntax error in YAML file

**Solution:**
- Check indentation (must be 2 spaces, no tabs)
- Check for unmatched brackets/quotes
- Use a YAML validator online
- Look at error message for line number

### Changes don't appear in FoundryVTT

**Problem:** Forgot to compile after editing

**Solution:**
```bash
npm run build:packs
```

Then refresh FoundryVTT (F5) or restart.

### Git shows binary file changes

**Problem:** Edited LevelDB directly instead of YAML

**Solution:**
```bash
npm run extract:packs  # Extract LevelDB to YAML
git add packs/_source/  # Commit the YAML
```

### Compendium appears empty

**Problem:** Pack wasn't compiled or path is wrong

**Solution:**
- Check `module.json` has correct pack path
- Run `npm run build:packs`
- Check `packs/heirs-pack/` has LevelDB files
- Restart FoundryVTT

## File Naming

Use kebab-case for filenames:

```
✅ Good:
- elder-theron.yaml
- crystal-of-dawn.yaml
- chapter-1-awakening.yaml

❌ Bad:
- Elder Theron.yaml (spaces)
- npc1.yaml (not descriptive)
- ElderTheron.yaml (PascalCase)
```

## Switching to JSON

If you prefer JSON over YAML:

1. Edit `utils/packs.mjs`:
   ```javascript
   const USE_YAML = false; // Change to false
   ```

2. Extract packs to regenerate as JSON:
   ```bash
   npm run extract:packs
   ```

3. Rename files from `.yaml` to `.json`

JSON is more strict but doesn't support comments.

---

For more information, see:
- [docs/WORKFLOW.md](../../docs/WORKFLOW.md) - Complete development workflow
- [FoundryVTT CLI](https://github.com/foundryvtt/foundryvtt-cli) - Official pack tools
- [YAML Syntax](https://yaml.org/spec/1.2.2/) - YAML specification

---

*Happy content creation!*
