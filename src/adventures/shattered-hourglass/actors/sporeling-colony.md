---
type: actor
name: Sporeling Colony
img: ../assets/sporeling-colony.svg
system:
  type: npc
  details:
    type:
      value: plant
      subtype: temporal spore mass
    alignment: unaligned
    cr: 3
  attributes:
    movement:
      walk: 10
    senses:
      blindsight: 60
    ac:
      flat: 12
      calc: flat
    hp:
      value: 68
      max: 68
    prof: 2
  traits:
    size: lg
    languages:
      value: []
  abilities:
    str:
      value: 16
    dex:
      value: 6
    con:
      value: 16
    int:
      value: 1
    wis:
      value: 8
    cha:
      value: 1
---

# Sporeling Colony
*Large plant, unaligned*

A dense fungal mass that grows and shrinks in slow pulses, its spores leaking time itself.

## Biography {.system.details.biography.value}
- **Damage Resistances:** cold, fire
- **Damage Immunities:** poison
- **Condition Immunities:** blinded, deafened, exhaustion, poisoned

**Rooted.** The colony cannot be knocked prone or moved against its will.

**Temporal Spores.** Any creature that starts its turn within 10 feet of the colony must succeed on a [[/save con dc 13]]{DC 13 Constitution save} or be affected by one of the following (roll 1d4):
- 1: The creature is slowed (as *Slow*) until the end of its turn.
- 2: The creature ages 1d10 years (cosmetic; reverses when leaving the hall).
- 3: The creature is stunned until the end of its turn by a future vision.
- 4: The creature is unaffected.

**Regeneration.** The colony regains 5 hit points at the start of its turn if it has at least 1 hit point.

### Actions

**Slam.** *Melee Weapon Attack:* +5 to hit, reach 10 ft., one target. *Hit:* 13 (3d6 + 3) bludgeoning damage.

**Spore Burst (Recharge 5-6).** The colony releases temporal spores in a 20-foot radius. Each creature in that area must make a [[/save con dc 13]]{DC 13 Constitution save}. On a failure, a creature takes 10 (3d6) poison damage and is poisoned for 1 minute. While poisoned in this way, the creature experiences time disjointedly and has disadvantage on attack rolls and ability checks. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.
