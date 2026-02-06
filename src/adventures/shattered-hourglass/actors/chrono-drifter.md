---
type: actor
name: Chrono-Drifter
img: ../assets/chrono-drifter.svg
system:
  type: npc
  details:
    type:
      value: monstrosity
      subtype: temporal scavenger alpha
    alignment: unaligned
    cr: 5
  attributes:
    movement:
      walk: 40
    senses:
      darkvision: 60
    ac:
      flat: 14
      calc: flat
    hp:
      value: 85
      max: 85
    prof: 3
  traits:
    size: lg
    languages:
      value: []
  abilities:
    str:
      value: 17
    dex:
      value: 15
    con:
      value: 16
    int:
      value: 4
    wis:
      value: 12
    cha:
      value: 6
---

# Chrono-Drifter
*Large monstrosity, unaligned*

A wolf-like predator stitched together from different ages, its front half ancient and skeletal while its hindquarters remain vital and powerful. Its head blurs between puppy and elder as it snarls through multiple moments at once.

## Biography {.system.details.biography.value}
- **Damage Resistances:** necrotic, radiant
- **Condition Immunities:** exhaustion
- **Skills:** Perception +4, Stealth +5

**Temporal Flux.** At the start of each of its turns, roll 1d4:
- 1-2: Moves as normal.
- 3: Can take two Move actions this turn.
- 4: Partially phased; attacks against it have disadvantage until the start of its next turn.

**Age Drain.** When the Chrono-Drifter deals damage to a creature, it regains hit points equal to half the damage dealt (rounded down).

**Pack Tactics.** The Chrono-Drifter has advantage on attack rolls against a creature if at least one of its allies is within 5 feet of the creature and that ally is not incapacitated.

### Actions

**Multiattack.** The Chrono-Drifter makes two attacks: one with its bite and one with its claws.

**Temporal Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 12 (2d8 + 3) piercing damage plus 7 (2d6) necrotic damage. The target must succeed on a [[/save con dc 14]]{DC 14 Constitution save} or have disadvantage on the next attack roll or ability check it makes before the end of its next turn.

**Rending Claws.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) slashing damage.

**Temporal Howl (Recharge 5-6).** Each creature within 30 feet must make a [[/save wis dc 13]]{DC 13 Wisdom save}. On a failure, a creature takes 14 (4d6) psychic damage and is frightened until the end of its next turn. On a success, a creature takes half damage and is not frightened.
