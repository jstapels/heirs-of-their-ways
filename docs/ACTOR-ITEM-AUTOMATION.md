# Actor & Item Automation Guide (dnd5e)

Use this when creating or updating actor/item markdown so Foundry dnd5e can automate as much as possible.

## Canonical References (From `AGENTS.md`)

- `docs/WORKFLOW.md` - Build workflow and frontmatter pass-through rules.
- `docs/DND5E-YAML-STRUCTURE.md` - Full schema reference for actor/item fields and activities.
- `docs/ENRICHERS.md` - Inline roll/check/save syntax for prose descriptions.
- `src/README.md` - Source layout and authoring conventions.

## Core Rule

If a mechanic is natively supported by dnd5e sheet data, put it in frontmatter `system` and/or `effects` first, then keep prose focused on behavior and tactics.

Good examples:
- Damage resistance/immunity/vulnerability
- Condition immunity
- Save proficiencies
- Skills
- Spellcasting ability
- Magical weapon bonus (`+1/+2/+3`)
- Passive AC/save/trait adjustments from equipped items

Keep in prose:
- Tactics and roleplay notes
- Conditional logic that needs GM judgment
- Complex encounter scripts and lair behavior not modeled as a simple activity/effect

## Actor Automation Checklist

For `type: actor` documents:

1. Set core creature data in `system.details` and `system.attributes` (type, CR, AC, HP, movement, senses).
2. Move resistances and immunities into traits:
   - `system.traits.dr.value` (damage resistance)
   - `system.traits.di.value` (damage immunity)
   - `system.traits.dv.value` (damage vulnerability)
   - `system.traits.ci.value` (condition immunity)
3. Use save proficiencies in ability scores:
   - `system.abilities.con.proficient: 1`
4. Use `system.skills` for proficiencies/expertise, and optional `bonus` when needed.
5. Set `system.attributes.spellcasting` for caster NPCs (`int`, `wis`, or `cha`).
6. Remove redundant stat bullet lines from biography once structured fields exist.

## Item Automation Checklist

For `type: item` documents:

1. Use the right item base type in `system.type`.
2. For magic weapon pluses:
   - `system.magicalBonus: 1|2|3`
   - include `mgc` in `system.properties`.
3. For passive effects while equipped/attuned, use transfer effects (`effects[]` with `transfer: true`).
4. Keep descriptive prose, but do not rely on prose alone for resistances/AC/bonuses that can be automated.
5. Add `activities` when an item has a repeatable action that should be clickable in sheet/chat.

## Actor Template (Automation-First)

```yaml
---
type: actor
name: Example Temporal Stalker
_id: ExTempStalker001
img: ../assets/example-temporal-stalker.svg
system:
  type: npc
  details:
    type:
      value: monstrosity
      subtype: temporal hunter
    alignment: unaligned
    cr: 5
  attributes:
    ac:
      flat: 15
      calc: flat
    hp:
      value: 95
      max: 95
    movement:
      walk: 40
    senses:
      darkvision: 60
    prof: 3
  traits:
    size: lg
    dr:
      value:
        - necrotic
    ci:
      value:
        - charmed
    languages:
      value: []
  abilities:
    str:
      value: 18
    dex:
      value: 14
    con:
      value: 16
      proficient: 1
    int:
      value: 5
    wis:
      value: 12
    cha:
      value: 7
  skills:
    prc:
      value: 1
    ste:
      value: 1
---
```

## Embedded Action Template (Actor `items`)

Use this when you want clickable attacks/abilities on the actor sheet.

```yaml
---
type: actor
name: Example Temporal Stalker
items:
  - _id: ExTmpBiteAtk001
    name: Temporal Bite
    type: weapon
    img: icons/weapons/fangs/fang-tooth-brown.webp
    system:
      quantity: 1
      type:
        value: natural
      properties:
        - mgc
      activities:
        ExTmpBiteAct001:
          _id: ExTmpBiteAct001
          type: attack
          activation:
            type: action
            value: 1
            condition: ""
            override: false
          consumption:
            targets: []
            scaling:
              allowed: false
              max: ""
            spellSlot: true
          description:
            chatFlavor: ""
          duration:
            concentration: false
            value: ""
            units: inst
            special: ""
            override: false
          effects: []
          range:
            value: "5"
            units: ft
            special: ""
            override: false
          target:
            template:
              contiguous: false
              units: ft
            affects:
              count: "1"
              type: creature
              choice: false
              special: ""
            prompt: true
            override: false
          attack:
            ability: str
            bonus: "6"
            critical:
              threshold: null
            flat: true
            type:
              value: melee
              classification: weapon
          damage:
            critical:
              bonus: ""
            includeBase: false
            parts:
              - number: 2
                denomination: 8
                bonus: "3"
                types:
                  - piercing
                custom:
                  enabled: false
                  formula: ""
                scaling:
                  mode: ""
                  number: null
                  formula: ""
              - number: 2
                denomination: 6
                bonus: ""
                types:
                  - necrotic
                custom:
                  enabled: false
                  formula: ""
                scaling:
                  mode: ""
                  number: null
                  formula: ""
          uses:
            spent: 0
            recovery: []
          sort: 0
---
```

## Item Template: +1 Weapon (System-Native)

```yaml
---
type: item
name: Example Blade +1
img: icons/weapons/swords/sword-guard-brown.webp
system:
  type:
    value: weapon
    baseItem: longsword
  properties:
    - mgc
  magicalBonus: 1
  rarity: uncommon
  attunement: false
---
```

## Item Template: Passive Resistance via Transfer Effect

```yaml
---
type: item
name: Example Cloak of Frostguard
img: icons/equipment/back/cloak-lined-blue.webp
system:
  type:
    value: wondrous
  rarity: uncommon
  attunement: required
effects:
  - name: Cloak of Frostguard - Cold Resistance
    img: icons/equipment/back/cloak-lined-blue.webp
    _id: ExCloakColdRes01
    type: base
    system: {}
    changes:
      - key: system.traits.dr.value
        mode: 2
        value: cold
        priority: null
    disabled: false
    duration:
      startTime: null
      seconds: null
      combat: null
      rounds: null
      turns: null
      startRound: null
      startTurn: null
    transfer: true
    flags: {}
    tint: "#ffffff"
    statuses: []
    sort: 0
---
```

## Item Template: Passive AC Bonus via Transfer Effect

```yaml
---
type: item
name: Example Warding Ring
img: icons/equipment/finger/ring-band-gold-blue.webp
system:
  type:
    value: ring
  rarity: rare
  attunement: required
effects:
  - name: Warding Ring - AC Bonus
    img: icons/equipment/finger/ring-band-gold-blue.webp
    _id: ExWardingRingAC1
    type: base
    system: {}
    changes:
      - key: system.attributes.ac.bonus
        mode: 2
        value: "+1"
        priority: null
    disabled: false
    duration:
      startTime: null
      seconds: null
      combat: null
      rounds: null
      turns: null
      startRound: null
      startTurn: null
    transfer: true
    flags: {}
    tint: "#ffffff"
    statuses: []
    sort: 0
---
```

## Prose + Enricher Guidance

Even with automation, keep clear rules text and use enrichers for table-facing readability:

- Checks: `[[/check Perception 15]]` or `[[/skill perception 15]]`
- Saves: `[[/save con dc 14]]`
- Damage: `[[/damage 2d8+4 bludgeoning]]`

See `/Users/jstapels/Developer/heirs-of-their-ways/docs/ENRICHERS.md` for syntax details.

## Validation Workflow

1. Build YAML:
   - `npm run build:yaml`
2. Optionally full build:
   - `npm run build`
3. Spot-check actor/item sheets in Foundry:
   - Traits tab reflects `dr/di/ci/dv`
   - Passive transfer effects apply when equipped/attuned
   - Activities appear and roll correctly

Generated outputs in `assets/` and `packs/` are build artifacts; do not commit them.
