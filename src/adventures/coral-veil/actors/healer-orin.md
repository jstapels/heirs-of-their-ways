---
type: actor
name: Healer Orin
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: enthralled sea elf
    alignment: lawful evil
    cr: 1
  attributes:
    movement:
      walk: 30
      swim: 40
    senses:
      darkvision: 60
    ac:
      flat: 13
      calc: flat
    hp:
      value: 16
      max: 16
    prof: 2
  traits:
    size: med
    languages:
      value:
        - common
        - elvish
        - aquan
  abilities:
    str:
      value: 11
    dex:
      value: 14
    con:
      value: 12
    int:
      value: 11
    wis:
      value: 13
    cha:
      value: 11
  skills:
    nat:
      value: 2
    prc:
      value: 3
    ste:
      value: 3
    sur:
      value: 3
---

# Healer Orin
*Enthralled sea elf medic*

A sea elf man with an oily glaze over his eyes and mucus dripping from his gills. Movements are jerky and unnatural, and his voice blends his own frightened tone with Veth'sora's psychic command.

## Biography {.system.details.biography.value}
- Former village healer; retains medical knowledge even while enthralled.
- Guards supplies in the Healing House (potions and healer's kit).
- Suffers psychic backlash (3d6 damage) if he resists Veth'sora or strays too far.
- Can be talked down for a minute with appeals to his healer oath ([[/check Persuasion 15]] or [[/check Insight 14]]).

## Roleplaying Notes
- First enthralled foe encountered; shows that thralls can still be saved.
- Pleads subconsciously for help even while compelled to attack.
