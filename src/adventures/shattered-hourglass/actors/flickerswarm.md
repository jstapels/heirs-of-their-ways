---
type: actor
name: Flickerswarm
img: ../assets/flickerswarm.svg
system:
  type: npc
  details:
    type:
      value: monstrosity
      subtype: temporal vermin swarm
    alignment: unaligned
    cr: 2
  attributes:
    movement:
      walk: 30
      climb: 30
    senses:
      darkvision: 30
    ac:
      flat: 13
      calc: flat
    hp:
      value: 36
      max: 36
    prof: 2
  traits:
    size: med
    languages:
      value: []
  abilities:
    str:
      value: 6
    dex:
      value: 16
    con:
      value: 10
    int:
      value: 2
    wis:
      value: 10
    cha:
      value: 3
---

# Flickerswarm
*Medium swarm of Tiny monstrosities, unaligned*

A skittering tide of rats and moths stuttering between moments, leaving trails of amber dust that shimmer in the air.

## Biography {.system.details.biography.value}
- **Damage Resistances:** bludgeoning, piercing, slashing
- **Condition Immunities:** charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned

**Swarm.** The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny creature. The swarm cannot regain hit points or gain temporary hit points.

**Temporal Scatter.** When the swarm takes damage, it can use its reaction to split into two spaces within 15 feet of its current location. The damage is applied, then the swarm reforms in one of those spaces (its choice).

### Actions

**Bites.** *Melee Weapon Attack:* +5 to hit, reach 0 ft., one creature in the swarm's space. *Hit:* 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half its hit points or fewer. The target must succeed on a [[/save con dc 12]]{DC 12 Constitution save} or be outlined in flickering amber light until the end of its next turn. While outlined, the target cannot benefit from being invisible, and attack rolls against it have advantage.
