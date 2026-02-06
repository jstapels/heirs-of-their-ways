---
type: actor
name: Chrono-Mage Adept
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: mage, temporal
    alignment: neutral evil
    cr: 4
  attributes:
    movement:
      walk: 30
    senses:
      darkvision: 60
    ac:
      flat: 13
      calc: flat
    hp:
      value: 52
      max: 52
    prof: 2
  traits:
    size: med
    languages:
      value:
        - common
        - draconic
  abilities:
    str:
      value: 9
    dex:
      value: 14
    con:
      value: 12
    int:
      value: 16
    wis:
      value: 13
    cha:
      value: 11
---

# Chrono-Mage Adept
*Medium humanoid, neutral evil*

An arcane operative studying leaked time magic in the temple's upper reaches.

## Biography {.system.details.biography.value}
- **Skills:** Arcana +5, History +5
- **Spell Save DC:** 13, **Spell Attack:** +5

**Suggested Spells:** *Misty Step, Hold Person, Magic Missile, Mirror Image, Slow.*

**Fractured Casting.** Once per short rest, when the adept casts a spell of 1st level or higher, it can teleport up to 15 feet to an unoccupied space it can see.
