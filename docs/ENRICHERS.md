# FoundryVTT Text Enrichers Guide

## Overview

Text enrichers transform special syntax in journal entries, actor descriptions, and item descriptions into interactive, clickable elements with proper formatting and dice rolling capabilities.

This guide covers enrichers available in **FoundryVTT v13** with the **DnD5e system v5.2**.

## Core FoundryVTT Enrichers

### @UUID - Document Links

Link to any document in your world using unique identifiers.

**Syntax:**
```
@UUID[Actor.xCr2shRoWsl76mV6]{Character Name}
@UUID[Scene.SmHxdEH8WlNkOsBD]{Scene Name}
@UUID[Item.abc123]{Magic Sword}
@UUID[JournalEntry.xyz789]{Chapter 1}
@UUID[Compendium.dnd5e.items.abc123]{Longsword}
```

**Features:**
- Links to Actors, Scenes, Items, Journal Entries, Roll Tables, etc.
- Works with compendium content
- Optional custom label in curly braces
- Hovering shows tooltip with document preview

### @Embed - Document Embedding

Embed complete documents directly into journal entries.

**Syntax:**
```
@Embed[JournalEntry.xyz123]{Caption Text}
@Embed[RollTable.abc123 inline]{Loot Table}
@Embed[JournalEntry.xyz123 classes="small right"]{Side Note}
```

**Options:**
- `inline` - Embeds content in flow (default: false)
- `classes="class-name"` - Add CSS classes for styling
- Caption text in curly braces

### Inline Rolls

Create clickable dice rolls directly in text.

**Syntax:**
```
[[/roll 1d20+5]]
[[2d6 + 3]]
[[1d20 # Attack Roll]]
```

**Features:**
- Any valid dice formula
- Optional label after `#`
- Click to roll in chat

---

## DnD5e System Enrichers

The DnD5e system adds specialized enrichers for game mechanics.

### @Check / @Skill / @Tool

Create ability checks, skill checks, and tool checks. Use `/skill` for skill checks (preferred), `/check` for ability checks, and `/tool` for tool checks.

**Skill Checks (Preferred for Skills):**
```
[[/skill acrobatics]]           # Acrobatics skill check
[[/skill perception 15]]        # DC 15 Perception check
[[/skill medicine 12]]          # DC 12 Medicine check
[[/skill stealth dc=14]]        # DC 14 Stealth check
[[/skill survival 13]]          # DC 13 Survival check
[[/skill intimidation]]         # Intimidation check (no DC)
```

**Ability Checks:**
```
[[/check dex]]                  # Dexterity ability check
[[/check str 15]]               # DC 15 Strength check
[[/check int dc=12]]            # DC 12 Intelligence check
```

**Tool Checks:**
```
[[/tool thieves]]               # Thieves' tools check
[[/tool thieves 15]]            # DC 15 Thieves' tools
[[/tool ability=dex tool=thief]]  # Dex-based thieves' tools
```

**Multiple Abilities/Skills (Choose One):**
```
[[/check str/dex]]              # Choose Str or Dex
[[/skill acrobatics/athletics 15]]  # Choose Acrobatics or Athletics DC 15
[[/save str/dex dc=15]]         # Choose Str or Dex save DC 15
```

**With Specific Ability Override:**
```
[[/skill intimidation ability=str]]  # Strength-based Intimidation
[[/skill athletics ability=con]]     # Constitution-based Athletics
```

**Passive Checks:**
```
[[/skill perception 15 passive]]           # Passive Perception DC 15
[[/skill perception 15 passive format=long]]  # Long format
```

**Formula-based DC:**
```
[[/check dex dc=@abilities.con.dc]]  # DC equals caster's CON DC
[[/check int dc="8 + @prof"]]        # DC equals 8 + proficiency
```

**Options:**
| Option | Values | Example |
|--------|--------|---------|
| ability | str, dex, con, int, wis, cha | `ability=dex` |
| skill | Full name or abbreviation | `skill=acrobatics` or `acr` |
| tool | Tool name | `tool=thieves` |
| dc | Number or formula | `dc=15` or `dc=@abilities.con.dc` |
| format | short, long | `format=long` |
| passive | (flag, no value needed) | `passive` |

**Common Skill Abbreviations:**
| Skill | Abbreviation |
|-------|--------------|
| Acrobatics | acr |
| Animal Handling | ani |
| Arcana | arc |
| Athletics | ath |
| Deception | dec |
| History | his |
| Insight | ins |
| Intimidation | itm |
| Investigation | inv |
| Medicine | med |
| Nature | nat |
| Perception | prc |
| Performance | prf |
| Persuasion | per |
| Religion | rel |
| Sleight of Hand | slt |
| Stealth | ste |
| Survival | sur |

### @Damage / @Heal

Create damage and healing rolls with proper type association.

**Basic Damage:**
```
[[/damage 2d6 fire]]
[[/damage 1d8+3 slashing]]
[[/damage 1d10 bludgeoning/slashing]]  # Multiple types
```

**With Average:**
```
[[/damage 2d6 fire average]]           # Auto-calculates average
[[/damage 2d6 fire average=7]]         # Custom average value
```

**Multiple Damage Instances:**
```
[[/damage 1d6 piercing & 1d4 fire]]    # Stacked damage types
```

**Healing:**
```
[[/heal 2d4 + 2]]
[[/heal 10 temp]]                      # Temporary HP
```

**Options:**
| Option | Values | Example |
|--------|--------|---------|
| formula | Dice formula | `formula=2d6` |
| type | Damage type | `type=fire` |
| average | true/false or number | `average` or `average=7` |
| format | short, long, extended | `format=long` |

**Valid Damage Types:**
- Physical: bludgeoning, piercing, slashing
- Energy: acid, cold, fire, lightning, thunder
- Magical: force, necrotic, poison, psychic, radiant

### @Attack

Create attack rolls with proper to-hit modifiers.

**Basic Syntax:**
```
[[/attack +5]]                         # Fixed bonus
[[/attack formula=5]]                  # Explicit formula
```

**With Item Activity:**
```
[[/attack activity=Bite]]
```

**Options:**
| Option | Values | Example |
|--------|--------|---------|
| formula | Number or dice | `formula=5` or `formula=1d4+3` |
| activity | Activity ID or name | `activity=Bite` |
| attackMode | melee, ranged, thrown | `attackMode=ranged` |
| format | short, long, extended | `format=extended` |

### @Save

Create saving throw prompts.

**Basic Syntax:**
```
[[/save dex]]                          # Dexterity save
[[/save dexterity 15]]                 # DC 15 Dex save
```

**Multiple Abilities:**
```
[[/save str/dex dc=20]]                # Choose Str or Dex
```

**Concentration Save:**
```
[[/concentration 15]]
[[/concentration ability=cha]]
```

**Options:**
| Option | Values | Example |
|--------|--------|---------|
| ability | str, dex, con, int, wis, cha | `ability=dex` |
| dc | Number or formula | `dc=15` |
| format | short, long | `format=long` |

### @Item

Trigger item usage from enriched links.

**By Name:**
```
[[/item Bite]]
[[/item Bite activity=Poison]]
[[/item "Magic Sword" activity="Special Attack"]]
```

**By UUID:**
```
[[/item Actor.p26xCjCCTQm5fRN3.Item.amUUCouL69OK1GZU]]
[[/item amUUCouL69OK1GZU]]              # Relative ID within actor
```

**Behavior:**
- Searches selected token or assigned actor
- Opens activity selection if multiple exist
- Names with spaces need quotes

### [[lookup]]

Reference actor data dynamically in descriptions.

**Basic Syntax:**
```
[[lookup @name]]
[[lookup @details.type.config.label]]
[[lookup @abilities.str.mod]]
```

**With Styling:**
```
[[lookup @name style=lowercase]]
[[lookup @name style=uppercase]]
[[lookup @name style=capitalize]]
```

**With Fallback:**
```
[[lookup @name]]{the creature}         # Falls back to "the creature"
```

**With Activity:**
```
[[lookup @save.dc.value activity=jdRTb04FngE1B8cF]]
```

**Options:**
| Option | Values | Example |
|--------|--------|---------|
| path | @-prefixed data path | `@abilities.str.mod` |
| style | lowercase, uppercase, capitalize | `style=lowercase` |
| activity | Activity ID | `activity=abc123` |

### &Reference

Link to rules with rich tooltips (hover for full text).

**Basic Syntax:**
```
&Reference[prone]
&Reference[Difficult Terrain]
&Reference[grappling]
```

**Categories:**
- **Abilities:** str, dex, con, int, wis, cha
- **Skills:** acrobatics, athletics, deception, history, etc.
- **Conditions:** blinded, charmed, frightened, prone, stunned, etc.
- **Damage Types:** acid, fire, cold, lightning, etc.
- **Creature Types:** aberration, beast, dragon, humanoid, etc.
- **Spell Components:** concentration, material, somatic, verbal
- **Spell Schools:** abjuration, evocation, necromancy, etc.
- **Other Rules:** inspiration, encumbrance, cover, etc.

**Apply Condition:**
```
&Reference[prone apply]                # Shows apply button
```

---

## Practical Examples

### NPC Stat Block Description

```markdown
# Ancient Red Dragon

This massive dragon breathes [[/damage 18d6 fire average]] fire damage.

**Multiattack:** The dragon makes three attacks: one with its [[/attack activity=Bite]]
and two with its [[/attack activity=Claw]].

**Frightful Presence:** Each creature within 120 feet must succeed on a
[[/save wis 21]] or become &Reference[frightened] for 1 minute.
```

### Magic Item Description

```markdown
# Flaming Longsword

*+1 longsword (requires attunement)*

This sword deals an extra [[/damage 1d6 fire]] on a hit. As a bonus action,
you can make the flames brighter or dimmer.

**Special Attack:** Make a [[/check str dc=15]] to perform a sweeping flame attack
that deals [[/damage 2d6 fire average]] in a 10-foot cone.
```

### Trap Description

```markdown
# Poison Dart Trap

When triggered, darts shoot from hidden holes in the walls.
Each creature in the area must make a [[/save dex 15]] or take
[[/damage 2d4 piercing & 1d6 poison]] and become &Reference[poisoned]
for 1 hour.

A [[/check int dc=12]] reveals the trap mechanism, and a [[/check dex dc=15]]
using [[/tool thieves]] can disable it.
```

### Journal Entry with Lookups

```markdown
# Encounter with [[lookup @name]]

[[lookup @name style=capitalize]] is a [[lookup @details.type.config.label]]
with [[lookup @abilities.str.value]] Strength.

**Challenge:** [[lookup @details.cr]]
(worth [[lookup @details.xp.value]] XP)
```

---

## Best Practices

### Do:
✅ Use enrichers for all dice rolls and checks
✅ Include DCs for checks and saves
✅ Specify damage types for damage rolls
✅ Use &Reference for game terms to provide tooltips
✅ Use @UUID for cross-referencing other documents
✅ Test enrichers by viewing the journal/item in Foundry

### Don't:
❌ Don't mix enricher syntax styles unnecessarily
❌ Don't forget quotes around multi-word values
❌ Don't use enrichers in compendium source files (use them in Foundry UI)
❌ Don't duplicate information that lookups can provide
❌ Don't hardcode values that could use formulas

---

## Resources

- [FoundryVTT Enrichers Wiki](https://foundryvtt.wiki/en/development/guides/enrichers)
- [DnD5e Enrichers Documentation](https://github.com/foundryvtt/dnd5e/wiki/Enrichers)
- [FoundryVTT v13 API - TextEditor](https://foundryvtt.com/api/v13/variables/CONFIG.TextEditor.html)
- [DnD5e Text Enrichment Guide](https://deepwiki.com/foundryvtt/dnd5e/5.1-text-enrichment-and-journaling)

---

*Last updated for FoundryVTT v13 and DnD5e v5.2*
