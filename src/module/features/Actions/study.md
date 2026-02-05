---
type: feature
name: Study
img: ../../assets/images/actions/Study.webp
system:
  identifier: study
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
    Wq9m43fQz1D2UUOi:
      type: check
      name: Arcana
      _id: Wq9m43fQz1D2UUOi
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
          - arc
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
    qbz40SLjXaNVVNud:
      type: check
      name: History
      _id: qbz40SLjXaNVVNud
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
          - his
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
    1XU1Hu8hssYgK5B8:
      type: check
      name: Investigation
      _id: 1XU1Hu8hssYgK5B8
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
          - inv
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
    3WFYeEXDSncZraKY:
      type: check
      name: Nature
      _id: 3WFYeEXDSncZraKY
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
          - nat
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
    hOfy39BbkhMQ1hcj:
      type: check
      name: Religion
      _id: hOfy39BbkhMQ1hcj
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
          - rel
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

Make an Intelligence (Arcana, History, Investigation, Nature, or Religion) check.
