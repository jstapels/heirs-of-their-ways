---
type: item
name: Ring of Protection
img: icons/equipment/finger/ring-cabochon-gold-blue.webp
system:
  identifier: ring-of-protection
  source:
    revision: 1
    rules: "2024"
  unidentified:
    description: "*Unidentified*: A finely worked ring set with a deep blue cabochon. It hums faintly with protective magic."
  identified: true
  quantity: 1
  weight:
    value: 0
    units: lb
  price:
    value: 4000
    denomination: gp
  rarity: rare
  attunement: required
  attuned: false
  equipped: false
  type:
    value: ring
    baseItem: ""
  properties:
    - mgc
flags: {}
---

*Ring, Rare (Requires Attunement)*

You gain a +1 bonus to Armor Class and saving throws while wearing this ring.

```foundry-yaml
effects:
  - name: Ring of Protection
    img: icons/equipment/finger/ring-cabochon-gold-blue.webp
    _id: RingProtectEff01
    type: base
    system: {}
    changes:
      - key: system.attributes.ac.bonus
        mode: 2
        value: "+1"
        priority: null
      - key: system.bonuses.abilities.save
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
```
