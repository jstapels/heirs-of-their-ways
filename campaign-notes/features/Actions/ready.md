---
type: feature
name: Ready
img: modules/heirs-of-their-ways/assets/images/actions/Ready.webp
system:
  identifier: ready
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
Prepare to take an action in response to a trigger you define.

```foundry-yaml
system:
  activities:
    CPWDSvNo33IELHuC:
      type: utility
      _id: CPWDSvNo33IELHuC
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
        - _id: cxEPKYuVCIqRkrnX
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
  - name: Readied
    img: worlds/heir-of-their-ways/media/icons/ready.svg
    _id: cxEPKYuVCIqRkrnX
    type: base
    system: {}
    changes:
      - key: flags.automated-conditions-5e.all.bonus
        mode: 5
        value: bonus=0;once
        priority: null
    disabled: false
    duration:
      startTime: null
      combat: null
      seconds: null
      rounds: 1
      turns: null
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
