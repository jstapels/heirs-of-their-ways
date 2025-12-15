---
type: feature
name: Hide
img: modules/heirs-of-their-ways/assets/images/actions/Hide.webp
system:
  identifier: hide
  source:
    revision: 1
    rules: '2024'
  uses:
    spent: 0
    recovery: []
    max: ''
  advancement: []
  prerequisites:
    items: []
    repeatable: false
    level: null
  properties: []
  requirements: ''
  type:
    value: ''
    subtype: ''
flags:
  dnd5e:
    riders:
      activity: []
      effect: []
---
With the Hide action, you try to conceal yourself. To do so, you must succeed on a DC 15 Dexterity (Stealth) check while you're Heavily Obscured or behind Three-Quarters Cover or Total Cover, and you must be out of any enemy's line of sight; if you can see a creature, you can discern whether it can see you. On a successful check, you have the Invisible condition. Make note of your check's total, which is the DC for a creature to find you with a Wisdom (Perception) check. You stop being hidden immediately after any of the following occurs: you make a sound louder than a whisper, an enemy finds you, you make an attack roll, or you cast a spell with a Verbal component.

```foundry-yaml
system:
  activities:
    09je4dH26ZSftrbK:
      type: check
      name: Stealth
      _id: 09je4dH26ZSftrbK
      sort: 0
      activation:
        type: action
        override: false
        condition: ''
      consumption:
        scaling:
          allowed: false
        spellSlot: true
        targets: []
      description:
        chatFlavor: ''
      duration:
        units: inst
        concentration: false
        override: false
      effects:
        - _id: 7n6BsPiajiPuJnPC
          level: {}
      range:
        units: self
        override: false
        special: ''
      target:
        template:
          contiguous: false
          units: ft
          type: ''
        affects:
          choice: false
          type: self
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ''
      check:
        associated:
          - ste
        dc:
          calculation: ''
          formula: '15'
        ability: ''
      flags: {}
      visibility:
        level: {}
        requireAttunement: false
        requireIdentification: false
        requireMagic: false
effects:
  - name: Hiding
    img: worlds/heir-of-their-ways/media/icons/Hide.webp
    _id: 7n6BsPiajiPuJnPC
    type: base
    system: {}
    changes:
      - key: flags.automated-conditions-5e.attack.bonus
        mode: 5
        value: bonus=0;once
        priority: null
      - key: flags.automated-conditions-5e.all.bonus
        mode: 5
        value: bonus=0;once;isSpell
        priority: null
    disabled: false
    duration:
      startTime: null
      combat: null
      seconds: null
      rounds: null
      turns: null
      startRound: null
      startTurn: null
    description: ''
    tint: '#ffffff'
    transfer: false
    statuses:
      - invisible
    sort: 0
    flags:
      dnd5e:
        riders:
          statuses: []
```
