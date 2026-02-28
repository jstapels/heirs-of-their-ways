# Item Automation Templates

Use these templates for `type: item` markdown files.

References:
- `/Users/jstapels/Developer/heirs-of-their-ways/docs/ACTOR-ITEM-AUTOMATION.md`
- `/Users/jstapels/Developer/heirs-of-their-ways/docs/DND5E-YAML-STRUCTURE.md`
- `/Users/jstapels/Developer/heirs-of-their-ways/docs/WORKFLOW.md`

## Base Item Template

```yaml
---
type: item
name: Example Item
img: icons/svg/mystery-man.svg
system:
  type:
    value: wondrous
  rarity: uncommon
  attunement: false
---
```

## +1 Weapon Template (System-Native)

```yaml
---
type: item
name: Example Weapon +1
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

## Passive Resistance Template (Transfer Effect)

```yaml
---
type: item
name: Example Frost Cloak
img: icons/equipment/back/cloak-lined-blue.webp
system:
  type:
    value: wondrous
  rarity: uncommon
  attunement: required
effects:
  - name: Example Frost Cloak - Cold Resistance
    img: icons/equipment/back/cloak-lined-blue.webp
    _id: ExampleColdRes001
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

## Passive AC Bonus Template (Transfer Effect)

```yaml
---
type: item
name: Example Ring of Warding
img: icons/equipment/finger/ring-band-gold-blue.webp
system:
  type:
    value: ring
  rarity: rare
  attunement: required
effects:
  - name: Example Ring of Warding - AC Bonus
    img: icons/equipment/finger/ring-band-gold-blue.webp
    _id: ExampleRingAC0001
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

## Optional Reusable Activity Stub

Use `activities` for click-to-roll item actions (spells, saves, damage, utility).

```yaml
activities:
  ExampleActivity001:
    _id: ExampleActivity001
    type: utility
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
      value: ""
      units: self
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
    uses:
      spent: 0
      recovery: []
    sort: 0
```
