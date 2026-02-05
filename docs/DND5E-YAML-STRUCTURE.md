# D&D 5e YAML Structure Reference

This document provides a comprehensive reference for creating YAML files for the Heirs of Their Ways campaign, based on the official dnd5e system structure.

## Table of Contents

- [Common Patterns](#common-patterns)
- [Folder Structure](#folder-structure)
- [Actors (NPCs & Monsters)](#actors-npcs--monsters)
- [Items](#items)
  - [Weapons](#weapons)
  - [Armor & Equipment](#armor--equipment)
  - [Consumables](#consumables)
- [Spells](#spells)
- [Features](#features)
  - [Monster Features](#monster-features)
  - [Class Features](#class-features)
- [Backgrounds](#backgrounds)
- [Quick Reference Templates](#quick-reference-templates)

---

## Common Patterns

All YAML files in the dnd5e system share these common top-level fields:

```yaml
_id: UniqueIdentifier16  # 16-character unique ID (required)
name: Display Name        # Human-readable name
type: document_type       # actor, weapon, equipment, consumable, spell, feat, background
img: path/to/icon.webp   # Icon path (icons/* for system icons)
folder: FolderID16Char   # ID of parent folder (null if none)
sort: 0                  # Sort order within folder
ownership:
  default: 0             # 0=none, 1=limited, 2=observer, 3=owner
flags: {}                # Module-specific flags
effects: []              # Active effects array
_stats:                  # Metadata (auto-generated)
  systemId: dnd5e
  systemVersion: 4.0.0
  coreVersion: '13.344'
  createdTime: 1725037083672
  modifiedTime: 1725992478305
  lastModifiedBy: dnd5ebuilder0000
_key: '!items!UniqueIdentifier16'  # Database key (REQUIRED - see below)
```

### Key Field Guidelines

- **_id**: Must be unique across the entire pack. Use 16-character alphanumeric strings
- **_key**: **REQUIRED** - Database key that follows a specific pattern:
  - Actors: `_key: '!actors!{_id}'`
  - Items (weapons, equipment, consumables, spells, feats, backgrounds): `_key: '!items!{_id}'`
  - Folders: `_key: '!folders!{_id}'`
  - Example: If `_id: CaptainAldric001`, then `_key: '!actors!CaptainAldric001'`
- **type**: Determines document structure. Common types:
  - `npc` - Monsters and NPCs
  - `weapon` - Melee and ranged weapons
  - `equipment` - Armor, shields, clothing
  - `consumable` - Potions, scrolls, food
  - `spell` - Magical spells
  - `feat` - Features and traits
  - `background` - Character backgrounds
- **img**: Use system icons (`icons/*`) or custom paths in `assets/*`
- **folder**: Links to folder `_id` for organization

---

## Folder Structure

Folders organize content within compendiums. Create a `_folder.yaml` file:

```yaml
name: Folder Name
type: Actor              # Actor or Item
_id: UniqueFolderID16
folder: null             # Parent folder ID (null for top-level)
sorting: a               # 'a' for alphabetical, 'm' for manual
sort: 0                  # Sort order
color: '#3d8b3d'        # Folder color (hex)
description: ''          # Optional description
flags: {}
_key: '!folders!UniqueFolderID16'  # REQUIRED
_stats:
  systemId: dnd5e
  systemVersion: 4.0.0
  coreVersion: '13.344'
  createdTime: 1701908182383
  modifiedTime: 1701908224846
  lastModifiedBy: dnd5ebuilder0000
```

**Folder Colors:**
- Green: `#3d8b3d`
- Blue: `#242c7f`
- Purple: `#8b3d8b`
- Red: `#8b3d3d`

---

## Actors (NPCs & Monsters)

Actors represent creatures, NPCs, and monsters. Structure:

```yaml
_id: ActorID16CharLong
name: Creature Name
type: npc
img: icons/environment/people/guard.webp
folder: FolderID16Char

system:
  # Ability Scores
  abilities:
    str:
      value: 16          # Ability score
      proficient: 1      # 0=not proficient, 1=proficient in saves
    dex:
      value: 14
      proficient: 0
    con:
      value: 15
      proficient: 1
    int:
      value: 11
      proficient: 0
    wis:
      value: 13
      proficient: 0
    cha:
      value: 14
      proficient: 0

  # Combat Attributes
  attributes:
    hp:
      value: 68          # Current HP
      max: 68            # Maximum HP
      formula: 8d8 + 24  # HP calculation formula
    ac:
      value: 18          # Armor Class
      flat: 18           # Flat AC (if not calculated)
      calc: flat         # 'flat', 'default', 'natural', 'mage', 'draconic'
    movement:
      walk: 30           # Walking speed
      fly: 0             # Flying speed
      swim: 0            # Swimming speed
      burrow: 0          # Burrowing speed
      climb: 0           # Climbing speed
      units: ft          # Units (ft or m)
    init:
      bonus: 0           # Initiative bonus
    senses:
      darkvision: 60     # Darkvision range
      blindsight: 0
      tremorsense: 0
      truesight: 0
      units: ft

  # Details
  details:
    cr: 4                # Challenge Rating
    source:
      custom: Heirs Campaign
      book: ''           # Source book
      page: ''           # Page number
      license: CC-BY-4.0
      rules: '2014'      # '2014' or '2024'
    type:
      value: humanoid    # Creature type
      subtype: human     # Subtype
      custom: ''
    alignment: ln        # lg, ng, cg, ln, n, cn, le, ne, ce
    biography:
      value: >-
        <p>Creature description in HTML format.</p>
        <p>Can include multiple paragraphs and enrichers.</p>
      public: ''         # Public description (visible to players)

  # Traits
  traits:
    size: med            # tiny, sm, med, lg, huge, grg
    di:                  # Damage immunities
      value: []
      custom: ''
    dr:                  # Damage resistances
      value: []
      custom: ''
    dv:                  # Damage vulnerabilities
      value: []
      custom: ''
    ci:                  # Condition immunities
      value: []
      custom: ''
    languages:
      value:
        - common
        - elvish
      custom: ''

  # Skills (proficiency multiplier: 0=not proficient, 1=proficient, 2=expertise)
  skills:
    acr:                 # Acrobatics
      value: 0
      ability: dex
    ath:                 # Athletics
      value: 2
      ability: str
    int:                 # Intimidation
      value: 1
      ability: cha
    per:                 # Perception
      value: 2
      ability: wis
    ste:                 # Stealth
      value: 1
      ability: dex
    # ...other skills

  # Spellcasting (if applicable)
  spells:
    spell1:
      value: 4           # Current slots
      max: 4             # Max slots
    spell2:
      value: 3
      max: 3
    # ...up to spell9

  spellcasting:
    ability: wis         # Spellcasting ability (int, wis, cha)
    level: 10            # Caster level
    dc: 14               # Spell save DC (auto-calculated if blank)
    modifier: 6          # Spell attack bonus (auto-calculated if blank)

  # Resources (for special abilities)
  resources:
    primary:
      value: 3
      max: 3
      sr: true           # Short rest recovery
      lr: false          # Long rest recovery
      label: Rage

ownership:
  default: 0

sort: 0
flags: {}
effects: []
```

### Common Skill Abbreviations
- `acr` - Acrobatics (Dex)
- `ani` - Animal Handling (Wis)
- `arc` - Arcana (Int)
- `ath` - Athletics (Str)
- `dec` - Deception (Cha)
- `his` - History (Int)
- `ins` - Insight (Wis)
- `int` - Intimidation (Cha)
- `inv` - Investigation (Int)
- `med` - Medicine (Wis)
- `nat` - Nature (Int)
- `per` - Perception (Wis)
- `prf` - Performance (Cha)
- `prs` - Persuasion (Cha)
- `rel` - Religion (Int)
- `slt` - Sleight of Hand (Dex)
- `ste` - Stealth (Dex)
- `sur` - Survival (Wis)

---

## Items

Items include weapons, armor, equipment, and consumables.

### Weapons

```yaml
_id: WeaponID16CharID
name: Longsword
type: weapon
img: icons/weapons/swords/greatsword-guard.webp
folder: WeaponsFolderID

system:
  description:
    value: >-
      <p>Weapon description in HTML.</p>
    chat: ''             # Chat card description

  source:
    custom: ''
    book: ''
    page: ''
    license: CC-BY-4.0
    rules: '2014'

  # Item properties
  quantity: 1
  weight:
    value: 3
    units: lb            # lb or kg
  price:
    value: 15
    denomination: gp     # cp, sp, ep, gp, pp

  # Identification & Attunement
  identified: true
  rarity: ''             # common, uncommon, rare, very rare, legendary, artifact
  attunement: ''         # '' or 'required'
  equipped: false
  proficient: null       # null=use proficiency, 0=not proficient, 1=proficient

  # Weapon-specific
  type:
    value: martialM      # simpleM, martialM, simpleR, martialR
    baseItem: longsword  # Base weapon type

  # Damage
  damage:
    base:
      number: 1          # Number of dice
      denomination: 8    # Die size
      bonus: ''          # Damage bonus
      types:
        - slashing       # bludgeoning, piercing, slashing, etc.
      custom:
        enabled: false
        formula: ''
      scaling:
        mode: ''
        number: null
        formula: ''
    versatile:
      number: null
      denomination: 0
      bonus: ''
      types: []
      # (same structure as base)

  # Properties
  properties:
    - ver                # Versatile
    - mgc                # Magical
    # fin (finesse), lgt (light), hvy (heavy), rch (reach),
    # thr (thrown), two (two-handed), amm (ammunition),
    # lod (loading), rel (reload), spc (special)

  # Range (for ranged weapons)
  range:
    value: null          # Normal range
    long: null           # Long range
    units: ft
    reach: null          # Melee reach

  # Magic bonus
  magicalBonus: null     # +1, +2, +3 for magic weapons

  # Activities (attacks, actions)
  activities:
    dnd5eactivity000:
      _id: dnd5eactivity000
      type: attack       # attack, damage, heal, save, etc.
      activation:
        type: action     # action, bonus, reaction
        value: 1
        condition: ''
        override: false
      consumption:
        targets: []
        scaling:
          allowed: false
          max: ''
        spellSlot: true
      description:
        chatFlavor: ''
      duration:
        concentration: false
        value: ''
        units: ''
        special: ''
        override: false
      effects: []
      range:
        value: '5'
        units: ft
        special: ''
        override: false
      target:
        template:
          count: ''
          contiguous: false
          type: ''       # cone, cube, cylinder, line, radius, sphere, wall
          size: ''
          width: ''
          height: ''
          units: ''
        affects:
          count: ''
          type: ''       # creature, ally, enemy, object, space
          choice: false
          special: ''
        prompt: true
        override: false
      attack:
        ability: ''      # str, dex, etc. (blank = auto)
        bonus: ''        # Attack roll bonus
        critical:
          threshold: null  # Crit threshold (19, 20)
        flat: false
        type:
          value: melee   # melee or ranged
          classification: weapon
      damage:
        critical:
          bonus: ''      # Extra crit damage
        includeBase: true
        parts: []        # Additional damage parts
      uses:
        spent: 0
        recovery: []
      sort: 0

  # Identifier (unique within type)
  identifier: longsword

  # Armor & HP (for items that can be damaged)
  armor:
    value: 10
  hp:
    value: 0
    max: 0
    dt: null             # Damage threshold
    conditions: ''

  container: null        # Container ID if stored in something
  attuned: false         # Whether currently attuned
  cover: null            # Cover bonus

ownership:
  default: 0
sort: 0
flags: {}
effects: []
```

### Armor & Equipment

```yaml
_id: ArmorID16CharIDz
name: Leather Armor
type: equipment
img: icons/equipment/chest/breastplate-scale-leather.webp
folder: ArmorFolderID16

system:
  description:
    value: >-
      <p>Armor description in HTML.</p>
    chat: ''

  source:
    custom: ''
    book: ''
    page: ''
    license: CC-BY-4.0
    rules: '2014'

  quantity: 1
  weight:
    value: 10
    units: lb
  price:
    value: 10
    denomination: gp

  identified: true
  rarity: ''
  attunement: ''
  equipped: false
  proficient: null

  # Armor-specific
  type:
    value: light         # light, medium, heavy, shield, clothing, trinket
    baseItem: leather

  armor:
    value: 11            # Base AC
    dex: null            # Max Dex bonus (null = unlimited)
    magicalBonus: null   # +1, +2, +3 for magic armor

  # Armor properties
  strength: null         # Minimum Strength requirement
  stealth: false         # True if disadvantage on stealth
  properties: []

  # Speed modifier
  speed:
    value: null
    conditions: ''

  activities: {}
  identifier: leather-armor
  container: null
  attuned: false

ownership:
  default: 0
sort: 0
flags: {}
effects: []
```

### Consumables

```yaml
_id: PotionID16CharID
name: Potion of Healing
type: consumable
img: icons/consumables/potions/potion-tube-corked-red.webp
folder: PotionsFolderID

system:
  description:
    value: >-
      <p>The potion's red liquid glimmers when agitated. You regain
      [[/damage 2d4 + 2 healing]] hit points when you drink this potion.</p>
    chat: ''

  source:
    custom: ''
    book: ''
    page: ''
    license: CC-BY-4.0
    rules: '2014'

  quantity: 1
  weight:
    value: 0.1
    units: lb
  price:
    value: 50
    denomination: gp

  identified: true
  rarity: common
  attunement: ''

  # Consumable-specific
  type:
    value: potion        # potion, scroll, wand, rod, trinket, food, etc.
    subtype: ''

  # Uses
  uses:
    max: 1               # Number of uses
    spent: 0
    recovery: []
    autoDestroy: true    # Destroy when uses exhausted

  # Properties
  properties:
    - mgc                # Magical

  # Activities
  activities:
    dnd5eactivity000:
      _id: dnd5eactivity000
      type: heal         # heal, damage, utility, etc.
      activation:
        type: action
        value: 1
        condition: ''
        override: false
      consumption:
        targets: []
        scaling:
          allowed: false
          max: ''
        spellSlot: true
      description:
        chatFlavor: ''
      duration:
        concentration: false
        value: ''
        units: inst      # inst, turn, round, minute, hour, day
        special: ''
        override: false
      effects: []
      range:
        value: ''
        units: self      # self, touch, ft, mi, spec
        special: ''
        override: false
      target:
        template:
          contiguous: false
          units: ft
        affects:
          count: '1'
          type: creature
          choice: false
          special: ''
        prompt: true
        override: false
      healing:
        number: 2
        denomination: 4
        bonus: '2'
        types:
          - healing
        custom:
          enabled: false
          formula: ''
        scaling:
          mode: ''
          number: null
          formula: ''
      uses:
        spent: 0
        recovery: []
      sort: 0

  identifier: potion-of-healing

ownership:
  default: 0
sort: 0
flags: {}
effects: []
```

---

## Spells

```yaml
_id: SpellID16CharIDz
name: Magic Missile
type: spell
img: icons/magic/fire/projectile-meteor-salvo-light-pink.webp
folder: Spell1stLevelID

system:
  description:
    value: >-
      <p>You create three glowing darts of magical force. Each dart hits a
      creature of your choice that you can see within range. A dart deals
      [[/damage 1d4 + 1 force]] damage to its target. The darts all strike
      simultaneously, and you can direct them to hit one creature or several.</p>
      <p><strong>Higher Levels.</strong> When you cast this spell using a spell
      slot of 2nd level or higher, the spell creates one more dart for each
      slot level above 1st.</p>
    chat: ''

  source:
    custom: ''
    book: ''
    page: ''
    license: CC-BY-4.0
    rules: '2014'

  # Spell-specific
  level: 1               # 0 (cantrip) through 9
  school: evo            # abj, con, div, enc, evo, ill, nec, trs

  # Components
  properties:
    - vocal              # vocal (V)
    - somatic            # somatic (S)
    - material           # material (M)
    - concentration      # concentration
    - ritual             # ritual
    - mgc                # magical

  # Material components (if material property is set)
  materials:
    value: ''            # Component description
    consumed: false      # Whether consumed
    cost: 0              # Cost in GP
    supply: 0            # Current supply

  # Casting
  activation:
    type: action         # action, bonus, reaction, minute, hour, special
    value: 1
    condition: ''

  # Duration
  duration:
    value: ''
    units: inst          # inst, turn, round, minute, hour, day, special

  # Range
  range:
    value: '120'
    units: ft            # self, touch, ft, mi, spec

  # Target
  target:
    affects:
      type: creature     # creature, ally, enemy, object, space
      count: '1'
      choice: false
    template:
      units: ''
      contiguous: false

  # Preparation
  preparation:
    mode: prepared       # prepared, always, pact, innate, atwill
    prepared: false

  # Uses (for innate spells)
  uses:
    max: ''
    spent: 0
    recovery: []         # sr, lr, dawn, dusk

  # Activities
  activities:
    dnd5eactivity000:
      _id: dnd5eactivity000
      type: damage       # damage, heal, save, attack, utility, summon
      activation:
        type: action
        value: null
        override: false
      consumption:
        targets: []
        scaling:
          allowed: false
          max: ''
        spellSlot: true
      description:
        chatFlavor: ''
      duration:
        units: inst
        concentration: false
        override: false
      effects: []
      range:
        override: false
      target:
        prompt: true
        template:
          contiguous: false
          units: ft
        affects:
          choice: false
        override: false
      damage:
        critical:
          allow: false   # Allow critical hits
          bonus: ''
        parts:
          - number: 1
            denomination: 4
            bonus: '1'
            types:
              - force    # Damage type
            custom:
              enabled: false
              formula: ''
            scaling:
              mode: ''
              number: null
              formula: ''
      uses:
        spent: 0
        recovery: []
      sort: 0

  identifier: magic-missile

ownership:
  default: 0
sort: 0
flags: {}
effects: []
```

### Spell Schools
- `abj` - Abjuration
- `con` - Conjuration
- `div` - Divination
- `enc` - Enchantment
- `evo` - Evocation
- `ill` - Illusion
- `nec` - Necromancy
- `trs` - Transmutation

### Duration Units
- `inst` - Instantaneous
- `turn` - Turn
- `round` - Round
- `minute` - Minute
- `hour` - Hour
- `day` - Day
- `special` - Special

---

## Features

Features include monster abilities, class features, racial traits, and feats.

### Monster Features

```yaml
_id: FeatureID16CharI
name: Pack Tactics
type: feat
img: icons/creatures/abilities/paw-print-orange.webp
folder: null

system:
  description:
    value: >-
      <p>the [[lookup @name lowercase]] has <strong>advantage</strong> on an
      attack roll against a creature if at least one of the [[lookup @name
      lowercase]]'s allies is within <strong>5 ft.</strong> of the creature
      and the ally isn't incapacitated.</p>
    chat: ''

  source:
    custom: ''
    book: ''
    page: ''
    license: CC-BY-4.0
    rules: '2014'

  # Feature type
  type:
    value: monster       # monster, class, race, feat, background
    subtype: ''

  # Requirements
  requirements: Baboon   # Creature type or class requirement
  prerequisites:
    level: null          # Level requirement

  # Uses (if limited)
  uses:
    max: ''
    spent: 0
    recovery: []         # sr, lr, etc.

  # Properties
  properties: []

  # Activities
  activities: {}

  # Enchantments (for magical features)
  enchant: {}

  identifier: pack-tactics

ownership:
  default: 0
sort: 0
flags: {}
effects: []
```

### Class Features

Class features follow the same structure as monster features but with `type.value: class`:

```yaml
type:
  value: class
  subtype: ''            # Optional subclass

requirements: ''         # Class requirement (e.g., "Barbarian")
prerequisites:
  level: 1               # Level gained
```

---

## Backgrounds

Backgrounds provide starting skills, languages, equipment, and features.

```yaml
_id: BackgroundID16Ch
name: Acolyte
type: background
img: icons/equipment/neck/necklace-runed-white-red.webp
folder: null

system:
  description:
    value: >-
      <p>Background description with skills, languages, equipment, and
      suggested characteristics.</p>
      <p><strong>Skill Proficiencies:</strong> Insight, Religion</p>
      <p><strong>Languages:</strong> Two of your choice</p>
      <p><strong>Equipment:</strong> List of starting equipment</p>
      <p><strong>Feature:</strong> Feature name</p>
    chat: ''

  source:
    custom: ''
    book: ''
    page: 60
    license: CC-BY-4.0
    rules: '2014'

  # Advancement (what the background grants)
  advancement:
    # Skill proficiencies
    - _id: UniqueAdvID001
      type: Trait
      configuration:
        mode: default
        allowReplacements: true
        grants:
          - skills:ins   # Insight
          - skills:rel   # Religion
        choices: []
      level: 0
      title: ''
      value:
        chosen: []

    # Language choices
    - _id: UniqueAdvID002
      type: Trait
      configuration:
        mode: default
        allowReplacements: false
        grants: []
        choices:
          - count: 2
            pool:
              - languages:*  # Any language
      level: 0
      title: ''
      value:
        chosen: []

    # Feature grant
    - _id: UniqueAdvID003
      type: ItemGrant
      configuration:
        items:
          - uuid: Compendium.dnd5e.backgrounds.Item.FeatureID
            optional: false
        optional: false
        spell:
          ability: []
          preparation: ''
          uses:
            max: ''
            per: ''
      value: {}
      level: 0
      title: Feature

  # Starting Equipment
  startingEquipment:
    - type: AND          # AND or OR group
      _id: GroupID1
      group: ''
      sort: 100000
      requiresProficiency: false
    - type: linked       # Linked item
      count: 1           # Quantity
      key: Compendium.dnd5e.items.Item.ItemID
      _id: ItemID1
      group: GroupID1    # Parent group
      sort: 200000
      requiresProficiency: false
    # Additional items...

  identifier: acolyte

ownership:
  default: 0
sort: 0
flags: {}
effects: []
```

---

## Quick Reference Templates

### Simple NPC

```yaml
_id: UniqueID16Chars
name: NPC Name
type: npc
img: icons/environment/people/commoner.webp
folder: FolderID16Chars

system:
  abilities:
    str: { value: 10, proficient: 0 }
    dex: { value: 10, proficient: 0 }
    con: { value: 10, proficient: 0 }
    int: { value: 10, proficient: 0 }
    wis: { value: 10, proficient: 0 }
    cha: { value: 10, proficient: 0 }
  attributes:
    hp: { value: 10, max: 10, formula: 2d8 }
    ac: { value: 10, flat: 10, calc: flat }
    movement: { walk: 30, units: ft }
  details:
    cr: 0
    type: { value: humanoid, subtype: human }
    alignment: n
    source: { custom: Heirs Campaign }
  traits:
    size: med
    languages: { value: [common] }

ownership:
  default: 0
sort: 0
_key: '!actors!UniqueID16Chars'
```

### Simple Magic Item

```yaml
_id: UniqueID16Chars
name: Magic Item Name
type: equipment
img: icons/equipment/trinkets/gem-faceted-blue.webp
folder: FolderID16Chars

system:
  description:
    value: >-
      <p>Item description with effects.</p>
  rarity: uncommon
  attunement: required
  identified: true
  weight: { value: 1, units: lb }
  price: { value: 500, denomination: gp }
  type: { value: trinket }

ownership:
  default: 0
sort: 0
_key: '!items!UniqueID16Chars'
```

### Simple Spell

```yaml
_id: UniqueID16Chars
name: Spell Name
type: spell
img: icons/magic/symbols/rune-sigil-purple.webp
folder: SpellFolderID16

system:
  description:
    value: >-
      <p>Spell description with [[/damage 1d6 force]] damage.</p>
  level: 1
  school: evo
  properties: [vocal, somatic]
  activation: { type: action, value: 1 }
  duration: { units: inst }
  range: { value: '60', units: ft }
  target:
    affects: { type: creature, count: '1' }

ownership:
  default: 0
sort: 0
_key: '!items!UniqueID16Chars'
```

---

## Best Practices

1. **Unique IDs**: Always use unique 16-character alphanumeric IDs
2. **Database Keys**: **ALWAYS** include the `_key` field with the correct pattern:
   - `_key: '!actors!{_id}'` for actors
   - `_key: '!items!{_id}'` for items (weapons, equipment, spells, feats, etc.)
   - `_key: '!folders!{_id}'` for folders
3. **Folders**: Organize content in folders for easier navigation
4. **Descriptions**: Use HTML formatting and enrichers (see ENRICHERS.md)
5. **Images**: Use system icons (`icons/*`) when possible for consistency
6. **Source**: Set `source.custom` for campaign-specific content
7. **Testing**: Build and test in Foundry after creating new content
8. **Version Control**: Use descriptive filenames (lowercase-with-hyphens.yaml)
9. **Comments**: Add YAML comments (`#`) to document complex structures

---

## Related Documentation

- [ENRICHERS.md](ENRICHERS.md) - Text enricher reference
- [WORKFLOW.md](WORKFLOW.md) - Development workflow
- [WORKFLOW.md](WORKFLOW.md) - Markdown build system

---

**Reference Source:** [dnd5e system v5.2.x](https://github.com/foundryvtt/dnd5e/tree/5.2.x/packs/_source)

**Last Updated:** 2025-11-29
