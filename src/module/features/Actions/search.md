---
type: feature
name: Search
img: ../../assets/images/actions/Search.webp
system:
  identifier: search
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
    LQBdqkQzx1drdwgC:
      type: check
      name: Insight
      _id: LQBdqkQzx1drdwgC
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
          - ins
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
    3FtnnES2Hr9ceg0a:
      type: check
      name: Medicine
      _id: 3FtnnES2Hr9ceg0a
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
          - med
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
    AQY5j0jkH55JlNkQ:
      type: check
      name: Perception
      _id: AQY5j0jkH55JlNkQ
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
          - prc
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
    dQGI6VNEkJhGwOmx:
      type: check
      name: Survival
      _id: dQGI6VNEkJhGwOmx
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
          - sur
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

Make a Wisdom (Insight, Medicine, Perception, or Survival) check.
