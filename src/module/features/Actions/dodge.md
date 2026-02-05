---
type: feature
name: Dodge
img: ../../assets/images/actions/Dodge.webp
system:
  identifier: dodge
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
    value: monster
    subtype: ""
  activities:
    b4mWLQ1oTZFbtet8:
      type: utility
      _id: b4mWLQ1oTZFbtet8
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
        - _id: P5MJxg5qDJrD2WZv
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
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ""
      roll:
        prompt: false
        visible: false
        formula: ""
        name: ""
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
  - name: Dodging
    img: systems/dnd5e/icons/svg/statuses/dodging.svg
    transfer: false
    _id: P5MJxg5qDJrD2WZv
    type: base
    system: {}
    changes: []
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
    statuses:
      - dodging
    sort: 0
    flags:
      dnd5e:
        riders:
          statuses: []
---

Until the start of your next turn, attack rolls against you have Disadvantage, and you make Dexterity saving throws with Advantage. You lose this benefit if you have the Incapacitated condition or if your Speed is 0.
