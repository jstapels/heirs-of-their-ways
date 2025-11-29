# Campaign Notes

This directory contains markdown-formatted campaign notes that serve as source material for generating FoundryVTT content.

## Purpose

Campaign notes are written in markdown for:
- **Easy editing** - Simple text format, works with any editor
- **Version control** - Track changes to campaign content over time
- **AI assistance** - Claude can read these notes to generate JSON data
- **Planning** - Organize ideas before creating Foundry content
- **Backup** - Human-readable backup of campaign information

## Directory Structure

- **adventures/** - Adventure outlines, session notes, story arcs
- **npcs/** - NPC descriptions, backgrounds, motivations, stat blocks
- **locations/** - Location descriptions, maps, points of interest
- **items/** - Custom item descriptions, magical items, artifacts
- **lore/** - World lore, history, factions, pantheons

## Writing Format

### Use Markdown Headers for Organization

```markdown
# NPC Name or Item Title

## Description
Physical appearance, personality, role in story...

## Stats
Game statistics, abilities, features...

## Background
History, motivations, secrets...
```

### Include FoundryVTT Enrichers

Write enrichers directly in your notes:

```markdown
The dragon breathes [[/damage 18d6 fire average]] fire.

Players must make a [[/save dex 20]] or be knocked &Reference[prone].

The rogue can attempt a [[/check dex dc=15]] using [[/tool thieves]].
```

This allows Claude to:
1. Understand game mechanics in your notes
2. Preserve enrichers when generating JSON
3. Create properly formatted FoundryVTT content

### Link Related Content

Use descriptive links to connect content:

```markdown
Meet [Lord Blackwood](npcs/lord-blackwood.md) at
[Blackwood Manor](locations/blackwood-manor.md).

He wields the [Flaming Sword](items/flaming-sword.md).
```

## Example Files

### Example: NPC File

**File:** `npcs/elder-theron.md`

```markdown
# Elder Theron

*Human Cleric, Lawful Good*

## Description
Elder Theron is the village priest, a kind elderly man with silver hair
and warm brown eyes. He wears simple brown robes and carries a wooden
staff topped with a sun symbol.

## Role in Campaign
- Quest giver for Chapter 1
- Provides healing and guidance
- Knows secret about the ancient temple

## Stats
- **AC:** 12 (robes)
- **HP:** 27 (5d8 + 5)
- **Speed:** 30 ft.
- **Abilities:** STR 10, DEX 10, CON 12, INT 14, WIS 18, CHA 16

## Spells
- **Cantrips:** light, sacred flame, spare the dying
- **1st level (4 slots):** cure wounds, bless, sanctuary
- **2nd level (3 slots):** lesser restoration, spiritual weapon
- **3rd level (2 slots):** dispel magic, spirit guardians

## Actions
- **Staff:** [[/attack +2]] to hit, [[/damage 1d6 bludgeoning]]
- **Sacred Flame:** Target makes [[/save dex 15]] or takes [[/damage 2d8 radiant]]

## Personality
- Kind and patient
- Speaks in parables
- Fears the darkness growing in the forest
```

### Example: Adventure File

**File:** `adventures/chapter-1-the-awakening.md`

```markdown
# Chapter 1: The Awakening

## Synopsis
The adventurers arrive in the village of Millhaven to find strange
occurrences plaguing the townsfolk. Elder Theron seeks their help to
investigate the ancient temple in the nearby forest.

## Story Hooks
- Promised payment of 100gp each
- Millhaven is on route to their destination
- Personal connection to missing villagers

## Act 1: Arrival in Millhaven

### Scene 1: The Village Square
Players arrive to find villagers gathered, whispering nervously.

**Key NPCs:**
- [Elder Theron](../npcs/elder-theron.md) - Quest giver
- [Mayor Thornton](../npcs/mayor-thornton.md) - Skeptical authority
- [Innkeeper Sara](../npcs/innkeeper-sara.md) - Information source

**Clues:**
- Three villagers missing in past week
- All disappeared near the old temple
- Strange lights seen in forest at night

### Scene 2: Investigation
Players can investigate:
- **Temple ruins** - [[/check int 13]] reveals recent activity
- **Forest tracks** - [[/check wis 12]] finds footprints
- **Interview villagers** - [[/check cha 10]] to gather rumors

## Act 2: The Temple

### Encounter 1: Forest Ambush
2d4 shadows attack! [[/roll 2d4]]

**Tactics:** Shadows hide in darkness, attack with [[/attack +4]]
dealing [[/damage 2d6+2 necrotic]].

**Treasure:** 25gp, [amulet of protection](../items/amulet-protection.md)

### Encounter 2: Temple Entrance
Ancient doors sealed with magic. Requires:
- [[/check int 14]] to read inscription
- [[/check arcana 15]] to understand magic
- Speak passphrase: "By light, we enter"

### Encounter 3: The Awakening Chamber
**Boss:** Awakened Shadow (see [shadow-priest](../npcs/shadow-priest.md))

**Environment:**
- Darkness gives enemies advantage
- Magical braziers can be lit with [[/check dex 12]]
- Central altar holds [Crystal of Dawn](../items/crystal-of-dawn.md)

## Rewards
- 100gp from Elder Theron
- [Crystal of Dawn](../items/crystal-of-dawn.md)
- Gratitude of Millhaven (future benefits)
- 500 XP per character

## Next Chapter
Leads to [Chapter 2: The Spreading Darkness](chapter-2.md)
```

### Example: Item File

**File:** `items/crystal-of-dawn.md`

```markdown
# Crystal of Dawn

*Wondrous item, uncommon (requires attunement)*

## Description
A fist-sized crystal that glows with warm sunlight. The light pulses
gently like a heartbeat. When held, it feels warm and comforting.

## History
Created by ancient sun clerics to ward against shadow creatures.
Thought lost for centuries until found in the awakening chamber.

## Properties
- **Light:** Sheds bright light 20ft, dim light 40ft
- **Control:** Bonus action to brighten, dim, or extinguish
- **Radiant Burst:** Once per day, as an action, emit burst of light
  - All creatures within 20ft make [[/save con 14]]
  - On fail: [[/damage 3d6 radiant]] and &Reference[blinded] for 1 round
  - On save: Half damage, not blinded
  - Shadow/undead creatures have disadvantage on save

## Attunement
To attune, meditate with crystal at dawn for 1 hour.

## Value
800gp (if sold)
```

## Using These Notes

### With Claude Code

Ask Claude to generate JSON from your notes:

```
"Generate an NPC actor JSON for Elder Theron based on
 campaign-notes/npcs/elder-theron.md"
```

Claude will:
1. Read the markdown file
2. Parse the stat block and abilities
3. Generate properly formatted JSON
4. Save to source-data/actors/elder-theron.json
5. Preserve enricher syntax in descriptions

### With Manual Import

1. Write your notes here in markdown
2. Create content manually in FoundryVTT
3. Export from Foundry to source-data/ for version control
4. Keep notes updated as content evolves

## Tips

- ✅ Use descriptive filenames (elder-theron.md not npc1.md)
- ✅ Include enricher syntax for mechanics
- ✅ Link related content with relative paths
- ✅ Keep stat blocks formatted consistently
- ✅ Update notes when content changes in Foundry
- ❌ Don't include copyrighted content without permission
- ❌ Don't put player-facing spoilers in shared docs
- ❌ Don't use special characters in filenames
- ❌ Don't duplicate content between notes and source-data

## Workflow

1. **Plan** - Brainstorm and outline in markdown
2. **Write** - Create detailed notes with enrichers
3. **Generate** - Use Claude to create JSON (or do manually)
4. **Import** - Import JSON into FoundryVTT
5. **Refine** - Edit in Foundry UI as needed
6. **Backup** - Export final version to source-data/
7. **Update** - Keep notes in sync with Foundry content

---

Happy worldbuilding!
