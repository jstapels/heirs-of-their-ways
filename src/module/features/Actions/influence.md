---
type: feature
name: Influence
img: ../../assets/images/actions/Influence.webp
system:
  identifier: influence
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
    aJJCxLGLPpiClDNt:
      type: check
      name: Deception
      _id: aJJCxLGLPpiClDNt
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
      effects: []
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
          type: ""
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ""
      check:
        associated:
          - dec
        dc:
          calculation: ""
          formula: ""
        ability: ""
      flags: {}
      visibility:
        level: {}
        requireAttunement: false
        requireIdentification: false
        requireMagic: false
    gkQY6qMXmBgOoDlU:
      type: check
      name: Intimidation
      _id: gkQY6qMXmBgOoDlU
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
      effects: []
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
          type: ""
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ""
      check:
        associated:
          - itm
        dc:
          calculation: ""
          formula: ""
        ability: ""
      flags: {}
      visibility:
        level: {}
        requireAttunement: false
        requireIdentification: false
        requireMagic: false
    IN7yE2PXVLohF9fA:
      type: check
      name: Performance
      _id: IN7yE2PXVLohF9fA
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
      effects: []
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
          type: ""
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ""
      check:
        associated:
          - prf
        dc:
          calculation: ""
          formula: ""
        ability: ""
      flags: {}
      visibility:
        level: {}
        requireAttunement: false
        requireIdentification: false
        requireMagic: false
    SbtOupoB9ehHPe5q:
      type: check
      name: Persuasion
      _id: SbtOupoB9ehHPe5q
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
      effects: []
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
          type: ""
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ""
      check:
        associated:
          - per
        dc:
          calculation: ""
          formula: ""
        ability: ""
      flags: {}
      visibility:
        level: {}
        requireAttunement: false
        requireIdentification: false
        requireMagic: false
    rL4Lv0Me0UVIlJst:
      type: check
      name: Animal Handling
      _id: rL4Lv0Me0UVIlJst
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
      effects: []
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
          type: ""
        override: false
        prompt: true
      uses:
        spent: 0
        recovery: []
        max: ""
      check:
        associated:
          - ani
        dc:
          calculation: ""
          formula: ""
        ability: ""
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
effects: []
---

Make a Charisma (Deception, Intimidation, Performance, or Persuasion) or Wisdom (Animal Handling) check to alter a creature's attitude.
