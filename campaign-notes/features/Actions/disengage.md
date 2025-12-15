---
type: feature
name: Disengage
img: modules/heirs-of-their-ways/assets/images/actions/Disengage.webp
system:
  identifier: disengage
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
Your movement doesn't provoke Opportunity Attack for the rest of the turn.

```foundry-yaml
system:
  activities:
    sHwoG8QOP5nybiHu:
      type: utility
      _id: sHwoG8QOP5nybiHu
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
        - _id: 2wPsbZDjiuyKxwpz
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
          special: ''
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ''
      roll:
        prompt: false
        visible: false
        name: ''
        formula: ''
      name: ''
      flags: {}
      visibility:
        level: {}
        requireAttunement: false
        requireIdentification: false
        requireMagic: false
effects:
  - name: Disengaging
    img: worlds/heir-of-their-ways/media/icons/disengage.svg
    _id: 2wPsbZDjiuyKxwpz
    type: base
    system: {}
    changes: []
    disabled: false
    duration:
      startTime: null
      combat: null
      seconds: null
      rounds: null
      turns: 1
      startRound: null
      startTurn: null
    description: ''
    tint: '#ffffff'
    transfer: false
    statuses: []
    sort: 0
    flags:
      dnd5e:
        riders:
          statuses: []
```
