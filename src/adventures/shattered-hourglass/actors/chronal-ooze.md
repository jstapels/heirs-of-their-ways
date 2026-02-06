---
type: actor
name: Chronal Ooze
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: ooze
      subtype: time-distorted mass
    alignment: unaligned
    cr: 4
  attributes:
    movement:
      walk: 20
      climb: 20
    senses:
      blindsight: 60
    ac:
      flat: 13
      calc: flat
    hp:
      value: 75
      max: 75
    prof: 2
  traits:
    size: lg
    languages:
      value: []
  abilities:
    str:
      value: 17
    dex:
      value: 8
    con:
      value: 18
    int:
      value: 2
    wis:
      value: 8
    cha:
      value: 2
---

# Chronal Ooze
*Large ooze, unaligned*

A gelatinous organism infused with fractured temporal runoff. It engulfs targets and spits them back out of sync.

## Biography {.system.details.biography.value}
- **Damage Resistances:** acid, force
- **Condition Immunities:** blinded, charmed, deafened, frightened, prone

**Time Smear.** A creature hit by the ooze's pseudopod makes a [[/save CON 13]]{DC 13 Constitution save} or has its speed reduced by 10 feet until the end of its next turn.

### Actions

**Pseudopod.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* [[/damage 2d8+3 bludgeoning]] plus [[/damage 1d6 acid]].

**Chronal Spasm (Recharge 5-6).** Each creature within 10 feet makes a [[/save DEX 13]]{DC 13 Dexterity save}. On failure, a creature takes [[/damage 3d6 force]] and can't take reactions until the start of its next turn.
