---
type: feature
name: Dash
img: ../../assets/images/actions/Dash.webp
system:
  identifier: dash
  source:
    revision: 1
    rules: "2024"
  uses:
    spent: 0
    recovery: []
    max: ""
  advancement: []
  prerequisites:
    items: []
    repeatable: false
    level: null
  properties: []
  requirements: ""
  type:
    value: ""
    subtype: ""
  activities:
    leku97bHQzgTDgJA:
      type: utility
      _id: leku97bHQzgTDgJA
      sort: 0
      activation:
        type: action
        override: false
        condition: ""
      consumption:
        scaling:
          allowed: false
        spellSlot: true
        targets: []
      description:
        chatFlavor: ""
      duration:
        units: inst
        concentration: false
        override: false
      effects:
        - _id: GGzo9qS7bZgPZeJd
          level: {}
      range:
        units: self
        override: false
        special: ""
      target:
        template:
          contiguous: false
          units: ft
          type: ""
        affects:
          choice: false
          type: self
          special: ""
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ""
      roll:
        prompt: false
        visible: false
        name: ""
        formula: ""
      name: ""
      flags: {}
      visibility:
        level: {}
        requireAttunement: false
        requireIdentification: false
        requireMagic: false
flags:
  dnd5e:
    riders:
      activity: []
      effect: []
effects:
  - name: Dashing
    img: icons/svg/wingfoot.svg
    _id: GGzo9qS7bZgPZeJd
    type: base
    system: {}
    changes:
      - key: system.attributes.movement.walk
        mode: 1
        value: "2"
        priority: null
      - key: system.attributes.movement.fly
        mode: 1
        value: "2"
        priority: null
      - key: system.attributes.movement.climb
        mode: 1
        value: "2"
        priority: null
      - key: system.attributes.movement.swim
        mode: 1
        value: "2"
        priority: null
      - key: system.attributes.movement.burrow
        mode: 1
        value: "2"
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
    description: ""
    tint: "#ffffff"
    transfer: false
    statuses: []
    sort: 0
    flags:
      dnd5e:
        riders:
          statuses: []
---

For the rest of the turn, give yourself extra movement equal to your Speed.
