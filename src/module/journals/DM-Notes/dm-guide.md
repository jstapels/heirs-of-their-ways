# Dungeon Master's Guide - Heir of Their Ways

This guide provides instructions for AI assistants helping with the "Heir of Their Ways" D&D 5e (2024 Edition) campaign.

## Campaign Overview

**System:** Dungeons & Dragons 5th Edition (2024 Rules)
**VTT:** Foundry VTT with the D&D 5e module
**World:** Aevir
**Region:** Loamvale and surrounding areas
**Main Arc:** The events surrounding Loamvale and the shadow conspiracy

## Primary Antagonists

- **Lord Varrick** - A mysterious figure spreading blood magic, possibly undead
- **Lucien Darkwood** - A patient puppeteer working through proxies

## Player Characters

| Player | Character | Race | Class | Level |
|--------|-----------|------|-------|-------|
| Dan | Mishko Wolansk | Triton | Bard (Dancer) | 6 |
| Rob | Motiejus "Mats" Torvaldr | Harengon | Monk (Warrior of the Elements) | 6 |
| Ryan | Threk Shadowtusk | Loxodon | Celestial Warlock 5 / Paladin 1 | 6 |
| Jorge | Ilizar Escrinos | Human | Rogue | 6 |
| Jason (Jay) | Dungeon Master | - | - | - |

The players are approaching Level 7.

## Adventure Writing Guidelines

### Descriptions
- Include rich, vivid descriptions to help players visualize environments
- Consider multiple solutions for challenges (combat and non-combat options)
- Balance exploration, roleplay, and combat encounters

### FoundryVTT Enrichers
When writing content, use the DnD5e Enrichers syntax for interactive elements. Reference the complete guide at: https://github.com/foundryvtt/dnd5e/wiki/Enrichers

Common enrichers:
- `[[/check dex dc=15]]` - Skill/ability checks
- `[[/save con 14]]` - Saving throws
- `[[/damage 2d6 fire]]` - Damage rolls
- `[[/attack +5]]` - Attack rolls
- `&Reference[prone]` - Condition references

### NPC Guidelines

When introducing a new interactive NPC, include:
1. **Name** and basic description
2. **Basic Stats** (AC, HP, key abilities)
3. **Skills** relevant to their role
4. **Background** - brief history and motivations
5. **Portrait Description** - for image generation
6. **Roleplaying Notes** - personality quirks, speech patterns
7. **Equipment** - notable gear, especially for combat NPCs
8. **Features** - any special abilities

For combat NPCs, base them on **Monster Manual (2025)** stat blocks where possible, noting any differences. This makes Foundry creation easier.

### Magic Items

Include a variety of magic items in adventures:
- **Consumables:** Potions, scrolls, ammunition
- **Permanent Items:** Appropriate for Level 6-7 characters
- Balance between common, uncommon, and occasional rare items

## Knowledge Separation

**Critical:** Maintain separation between:
- **Out-of-Character Knowledge** - Full campaign information
- **In-Character Knowledge** - What PCs actually know

Unless explicitly noted, assume campaign notes represent in-character knowledge the party has learned.

## Campaign Structure

### The Five Great Houses of Loamvale
- **Blackthorn Estate** - Wine (also oversees The Hunters)
- **Escrinos Estate** - Hard Cider
- **Torvaldr Estate** - Whiskey
- **Wolansk Estate** - Ale
- **Shadowtusk Estate** - Mead

Each player character is connected to one of these houses.

### Key Organizations
- **The Hunters** - Investigators and bounty hunters, technically separate from House Blackthorn
- **The Shadow Conspiracy** - Antagonist faction led by Lord Varrick and Lucien Darkwood

## Session Summaries

Session notes are maintained in `src/module/journals/DM-Notes/` for reference when planning future adventures.

## File Organization

- `src/adventures/` - Planned adventures and story arcs
- `src/module/actors/` - NPC profiles and stat blocks
- `src/module/journals/` - Locations, lore, and session summaries
- `src/module/items/` - Custom magic items

## Tips for Adventure Planning

1. **Tie to PC backgrounds** - Each character has rich house connections
2. **Political intrigue** - The houses have complex relationships
3. **Mystery elements** - The shadow conspiracy unfolds gradually
4. **Fey influences** - The region has strong connections to the Feywild
5. **Level-appropriate challenges** - Target CR 6-8 encounters, with boss fights at CR 8-10
