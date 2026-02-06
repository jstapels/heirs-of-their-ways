---
type: actor
name: Temporal Sentinel
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: construct
      subtype: ancient temporal guardian
    alignment: unaligned
    cr: 5
  attributes:
    movement:
      walk: 30
    senses:
      darkvision: 60
    ac:
      flat: 17
      calc: flat
    hp:
      value: 90
      max: 90
    prof: 3
  traits:
    size: lg
    languages:
      value: []
  abilities:
    str:
      value: 18
    dex:
      value: 10
    con:
      value: 16
    int:
      value: 6
    wis:
      value: 12
    cha:
      value: 6
---

# Temporal Sentinel
*Large construct, unaligned*

A bronze guardian rebuilt from obsolete warding machinery and humming with unstable chronal charge.

## Biography {.system.details.biography.value}
- **Damage Resistances:** force, lightning
- **Condition Immunities:** charmed, frightened, paralyzed, poisoned

**Anchor Stride.** The sentinel ignores difficult terrain caused by magical effects.

### Actions

**Multiattack.** The sentinel makes two Slam attacks.

**Slam.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* [[/damage 2d8+4 bludgeoning]] plus [[/damage 1d6 force]].

**Stasis Field (Recharge 5-6).** One creature within 30 feet must make a [[/save CON 14]]{DC 14 Constitution save}. On a failed save, it is restrained until the end of its next turn and takes [[/damage 2d8 force]].
