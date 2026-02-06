---
type: item
name: Chrono-Drifter Hide
img: icons/svg/mystery-man.svg
system:
  type:
    value: armor
  rarity: uncommon
  attunement: required
effects:
  - name: Chrono-Drifter Hide - Necrotic Resistance
    img: icons/svg/mystery-man.svg
    _id: ShHrDriftHideDR
    type: base
    system: {}
    changes:
      - key: system.traits.dr.value
        mode: 2
        value: necrotic
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

# Chrono-Drifter Hide
*Armor (leather), uncommon (requires attunement)*

Tough leather stitched from the Chrono-Drifter's hide, faintly warm to the touch and heavy with lingering temporal residue.

**Properties:**
- You have resistance to necrotic damage.
- Once per long rest, when you take damage, you can use your reaction to heal for half the damage taken (rounded down), borrowing vitality from a past moment.
