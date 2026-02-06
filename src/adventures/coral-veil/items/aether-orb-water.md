---
type: item
name: Aether Orb (Water Aspect)
img: icons/svg/mystery-man.svg
system:
  type:
    value: wondrous
  rarity: rare
  attunement: required
effects:
  - name: Aether Orb (Water) - Cold Resistance
    img: icons/svg/mystery-man.svg
    _id: CoVeAetherOrbDR1
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

# Aether Orb (Water Aspect)
*Wondrous item, rare (requires attunement)*

A fist-sized sphere swirling with miniature ocean currents; distant whale song hums when held.

**Properties:**
- You can breathe underwater and gain a swimming speed equal to your walking speed.
- You have resistance to cold damage.
- Once per long rest, you can cast *Control Water* without expending a spell slot.
- You can sense the approximate direction of other Aether Orbs within 1 mile.

**Dual Orb Effect:** When carried alongside the Necrotic Aether Orb, the bearer experiences unsettling visions of drowning or decay.

**Source:** Recovered from the Pearlheart Chamber after defeating Veth'sora.
