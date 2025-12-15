---
type: actor
name: Ripple's Father
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: enthralled sea elf guard
    alignment: lawful evil
    cr: 0.25
  attributes:
    movement:
      walk: 30
      swim: 40
  traits:
    size: med
---

# Ripple's Father
*Enthralled sea elf guard*

An otherwise ordinary sea elf warrior whose eyes are clouded by aboleth mucus. He patrols mechanically, unaware of his daughter's attempts to reach him.

```foundry-yaml
system:
  abilities:
    str:
      value: 13
    dex:
      value: 12
    con:
      value: 12
    int:
      value: 10
    wis:
      value: 11
    cha:
      value: 10
  attributes:
    ac:
      flat: 16
      calc: flat
    hp:
      value: 11
      max: 11
    prof: 2
    movement:
      walk: 30
      swim: 40
  skills:
    prc:
      value: 1
  traits:
    size: med
    languages:
      value:
        - common
        - elvish
        - aquan
```

## Biography {.system.details.biography.value}
- Uses guard statistics with swim speed 40 ft.
- Stationed near the school and maintenance tunnel entrances.
- Saving him secures Ripple's heartfelt gratitude and a safer haven for survivors.

## Roleplaying Notes
- Brief flashes of concern surface if Ripple is mentioned, creating openings for non-lethal subdual.
