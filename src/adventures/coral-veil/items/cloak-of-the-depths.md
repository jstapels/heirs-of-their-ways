---
type: item
name: Cloak of the Depths
img: icons/svg/mystery-man.svg
system:
  type:
    value: wondrous
  rarity: uncommon
  attunement: false
effects:
  - name: Cloak of the Depths - Cold Resistance
    img: icons/svg/mystery-man.svg
    _id: CoVeCloakDepthDR
    type: base
    system: {}
    changes:
      - key: system.traits.dr.value
        mode: 2
        value: cold
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

# Cloak of the Depths
*Wondrous item, uncommon*

A dark blue cloak that ripples like water even when dry; tiny bioluminescent organisms give it a faint glow.

**Properties:**
- You have resistance to cold damage.
- You can breathe underwater.
- While underwater, you have advantage on Stealth checks.

**Source:** Veth'sora's hoard.
