# Heir of Their Ways - Campaign Notes

This directory contains organized campaign notes for the "Heir of Their Ways" D&D 5e campaign, formatted for AI assistance and easy reference.

## Quick Start for AI

When working with this campaign:
1. Read `module/journals/DM-Notes/dm-guide.md` first for campaign overview and guidelines
2. Check `module/journals/DM-Notes/README.md` for session history and current plot threads
3. Reference narrative NPC notes in `module/journals/actors/`
4. Check `module/journals/Lore/` for world background and artifact information

## Directory Structure

```
src/
├── README.md                   # This file
├── module/                     # Global/module-level content
│   ├── actors/                 # Actors (NPCs/PCs) as Actor docs
│   ├── items/                  # Items and equipment
│   ├── features/               # Reusable feats/abilities (Item type: feat/spell)
│   ├── journals/               # Journal-type content
│   │   ├── DM-Notes/               # Session logs + DM guide
│   │   ├── Locations/             # Place writeups
│   │   └── Lore/                  # World background and artifacts
│   ├── scenes/                 # Shared scenes/maps
│   ├── tables/                 # Shared roll tables
│   └── assets/                 # Module assets (source)
└── adventures/                 # Adventure-specific content
    └── coral-veil/             # The Sunken Village of Coral Veil (adventure + assets)
        ├── overview.md         # Adventure overview (Adventure type)
        ├── actors/             # NPCs specific to the adventure (Actor type)
        ├── items/              # Loot/rewards for the adventure (Item type)
        ├── journals/           # Location/notes tied to the adventure (Journal type)
        └── assets/             # Adventure assets (source)
```

## Campaign Summary

### The Story So Far

The party of heirs from Loamvale's great houses was assembled to investigate missing trade shipments. Their investigation uncovered a shadow conspiracy involving:
- **Lucien Darkwood** - A fallen noble funding illicit operations
- **Lord Varrick** - A mysterious patron spreading blood magic
- **Selene (Sylvaine Willowbrook)** - An agent working between factions

The party has:
- Cleared Stonebridge Keep of bandits
- Met the Archfey Luminara and received blessings
- Established The Bottomless Goat tavern in Briar Hollow
- Defeated the necromancer Malrik Veynor
- Recovered an Aether Orb (necrotic aspect)

### Current Status (Session 25+)

**Party Level:** 6 (approaching 7)
**Location:** The Bottomless Goat, Briar Hollow
**Main Quest:** Protect/recover Aether Orbs, uncover Shadow Conspiracy

**Open Threads:**
- Lord Varrick's expectations after receiving the Aether Orb
- Lucien Darkwood's whereabouts and plans
- Selene's true allegiance
- Vargr's lycanthrope pack (territorial tension)
- Ilizar's debt to the imp Zzyzx
- Ilizar's lycanthropy curse
- The watering hole north of the Bottomless Goat

**Upcoming Adventure:** The Sunken Village of Coral Veil (see `adventures/coral-veil/overview.md`)

## The Five Great Houses

| House | Specialty | PC Connection |
|-------|-----------|---------------|
| Blackthorn | Wine | Oversees The Hunters |
| Escrinos | Hard Cider | Ilizar (reluctant heir) |
| Torvaldr | Whiskey | Motiejus "Mats" |
| Wolansk | Ale | Mishko |
| Shadowtusk | Mead | Threk |

## Key NPCs

### Allies
- **Alara Swiftwind** - Hunter ranger, party's first contact
- **Luminara** - Archfey guardian of the Fey Grotto
- **Cornelius** - Pombero fey, mischievous ally

### Antagonists
- **Lord Varrick** - Shadow lord, possibly undead
- **Lucien Darkwood** - Fallen noble, funds conspiracy
- **Selene** - Seraphine's twin, serves Varrick

### Complicated
- **Liora** - Mats' former love, now a were-harengon
- **Vargr Bloodfang** - Werewolf pack alpha

## Using These Notes

### For Adventure Planning
1. Check `module/journals/DM-Notes/README.md` for plot threads and party status
2. Reference NPC notes in `module/journals/actors/` for existing characters
3. Use `module/journals/Lore/aether-orbs.md` for artifact-related content
4. Consider house connections in `module/journals/Locations/`

### For AI Assistance
The notes are organized for easy AI consumption:
- Each file focuses on one topic
- Cross-references use relative links
- Session summaries provide context
- DM guide explains campaign conventions

## FoundryVTT Integration

### Automatic Document Generation

Markdown files in this directory are compiled into FoundryVTT documents when you run `npm run build`. The build system:

1. Reads markdown files from `src/`
2. Converts them to YAML documents in `packs/_source/` (type inferred from frontmatter)
3. Compiles YAML to LevelDB packs for FoundryVTT
4. Copies assets from `src/**/assets/` into `assets/` and rewrites relative paths

**Frontmatter controls document type** (default is `journal`):
```yaml
type: journal | actor | item | feature | spell | scene | table | adventure
```

Use `document:` in frontmatter to merge arbitrary top-level Foundry fields (scenes, tables, tokens, walls, etc.).

### Assets and Images

Place media in `src/module/assets/` or `src/adventures/<adventure>/assets/` and reference it with relative paths, for example:

```yaml
img: ../assets/tokens/arcane-mentor.webp
```

You can also embed images in markdown bodies:

```markdown
![Coral Veil Map](../assets/maps/coral-veil-map.webp)
```

### Excluded Files

The following are **not** compiled:
- `*-template.md` files
- `README.md` files

To exclude a specific file, add `journal: false` to its frontmatter:
```markdown
---
journal: false
---
```

### How Pages Work

- **H1 (`#`)** becomes the document name
- **H2 (`##`)** headers split content into separate journal pages (for journal/adventure docs)
- All FoundryVTT enrichers (`[[/check]]`, `[[/damage]]`, `@UUID[]`, etc.) are preserved

### Using Enrichers

Use FoundryVTT enricher syntax directly in markdown. See `docs/ENRICHERS.md` for complete reference.

```markdown
## Trap Description

Characters must make [[/check Perception 15]] to spot the trap.
If triggered, each character takes [[/damage 2d6 fire]].
A [[/save DEX 14]] reduces damage by half.
```

### Build Commands

```bash
npm run build                # Full build: markdown → YAML → packs
npm run build:yaml           # Build only markdown → YAML
npm run build:packs          # Build only packs (YAML → LevelDB)
```
