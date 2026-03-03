---
type: actor
name: Skirk Ashgut
_id: EmBlSkirkAshgut1
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: goblin alchemist
    alignment: neutral evil
    cr: 4
  attributes:
    movement:
      walk: 30
    senses:
      darkvision: 60
    ac:
      flat: 15
      calc: flat
    hp:
      value: 66
      max: 66
    prof: 2
  traits:
    size: sm
    languages:
      value:
        - common
        - goblin
  abilities:
    str:
      value: 8
    dex:
      value: 16
    con:
      value: 14
    int:
      value: 12
    wis:
      value: 13
    cha:
      value: 10
  skills:
    ste:
      value: 2
    nat:
      value: 1
    arc:
      value: 1
---

# Skirk Ashgut
*Small humanoid (goblin), neutral evil*

A goblin survivor from Session 6 who now serves as Dain's smoke-maker and trap trigger.

## Biography {.system.details.biography.value}
**Smoke Brewer.** Skirk carries volatile resin pouches that can produce the Numbing Smoke effect described in the adventure overview.

### Actions

**Rust Knife.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* [[/damage 1d4+3 piercing]].

**Ash Bomb (3/day).** Creatures in a 15-foot sphere make [[/save CON 14]] or are poisoned until end of their next turn.

**Cinder Dart.** *Ranged Weapon Attack:* +5 to hit, range 30/90 ft., one target. *Hit:* [[/damage 2d6 fire]].
