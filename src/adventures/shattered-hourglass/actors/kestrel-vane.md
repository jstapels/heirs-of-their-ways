---
type: actor
name: Kestrel Vane
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: human mercenary captain
    alignment: neutral
    cr: 6
  attributes:
    movement:
      walk: 30
    senses:
      darkvision: 0
    ac:
      flat: 17
      calc: flat
    hp:
      value: 95
      max: 95
    prof: 3
  traits:
    size: med
    languages:
      value:
        - common
        - dwarvish
  abilities:
    str:
      value: 16
    dex:
      value: 16
    con:
      value: 14
    int:
      value: 13
    wis:
      value: 12
    cha:
      value: 14
---

# Kestrel Vane
*Medium humanoid (human), neutral*

A pragmatic recovery captain leading a rival team in the lower temple. Kestrel negotiates when profitable and fights surgically when cornered.

## Biography {.system.details.biography.value}
- **Skills:** Athletics +6, Insight +4, Perception +4, Persuasion +5

**Tactical Commander.** As a bonus action, Kestrel chooses one ally that can hear her. That ally can move up to half speed without provoking opportunity attacks.

### Actions

**Multiattack.** Kestrel makes three attacks with her saber or light crossbow.

**Saber.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* [[/damage 1d8+4 slashing]].

**Light Crossbow.** *Ranged Weapon Attack:* +7 to hit, range 80/320 ft., one target. *Hit:* [[/damage 1d8+4 piercing]].

**Flash Powder (2/day).** Creatures in a 10-foot radius make a [[/save CON 14]]{DC 14 Constitution save} or are blinded until the end of their next turn.
