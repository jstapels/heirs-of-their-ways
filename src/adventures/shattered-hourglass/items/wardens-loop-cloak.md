---
type: item
name: Warden's Loop Cloak
img: icons/svg/mystery-man.svg
system:
  type:
    value: wondrous
  rarity: rare
  attunement: required
effects:
  - name: Warden's Loop Cloak - AC Bonus
    img: icons/svg/mystery-man.svg
    _id: ShHrLoopCloakAC
    type: base
    system: {}
    changes:
      - key: system.attributes.ac.bonus
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
---

# Warden's Loop Cloak
*Wondrous item, rare (requires attunement)*

A deep amber mantle that ripples as if rewinding itself.

**Properties:**
- +1 bonus to AC.
- When you are hit by an attack, you can use your reaction to impose disadvantage on that attack roll. Once used, this property can't be used again until the next dawn.
- You have advantage on initiative rolls.

**Ending Link:** Recommended reward for the **Reseal** ending.
