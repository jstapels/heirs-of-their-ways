---
type: actor
name: Echo Blade
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: undead
      subtype: temporal assassin echo
    alignment: neutral evil
    cr: 3
  attributes:
    movement:
      walk: 35
    senses:
      darkvision: 60
    ac:
      flat: 15
      calc: flat
    hp:
      value: 45
      max: 45
    prof: 2
  traits:
    size: med
    languages:
      value:
        - common
  abilities:
    str:
      value: 11
    dex:
      value: 17
    con:
      value: 12
    int:
      value: 10
    wis:
      value: 12
    cha:
      value: 9
---

# Echo Blade
*Medium undead, neutral evil*

A repeating assassin imprint trapped in the temple's archive, striking in the same lethal patterns across different moments.

## Biography {.system.details.biography.value}
- **Skills:** Acrobatics +5, Stealth +5
- **Damage Resistances:** necrotic

**Phase Slip (Reaction).** When hit by an attack, the echo blade can halve the attack's damage.

### Actions

**Multiattack.** The echo blade makes two Shortsword attacks.

**Shortsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* [[/damage 1d6+3 piercing]] plus [[/damage 1d6 necrotic]].

**Repeating Strike (Recharge 6).** After hitting with a shortsword, the echo blade immediately repeats that attack against the same target.
