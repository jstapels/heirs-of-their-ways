---
type: feature
name: Help
img: ../../assets/images/actions/Help.webp
system:
  identifier: help
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
  activities: {}
flags: {}
effects:
  - name: Helped
    img: worlds/heir-of-their-ways/media/icons/help.svg
    _id: HZidbmHY5XbeYB47
    type: base
    system: {}
    changes:
      - key: flags.automated-conditions-5e.grants.attack.advantage
        mode: 5
        value: once
        priority: null
      - key: flags.automated-conditions-5e.grants.check.advantage
        mode: 5
        value: once
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


