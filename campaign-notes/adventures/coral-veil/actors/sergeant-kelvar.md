---
type: actor
name: Sergeant Kelvar
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: enthralled sea elf guard
    alignment: lawful evil
    cr: 0.5
  attributes:
    movement:
      walk: 30
      swim: 40
  traits:
    size: med
---

# Sergeant Kelvar
*Enthralled sea elf patrol leader*

A broad-shouldered sea elf with scarred features and a trident at the ready. Once responsible for village security, he now leads enthralled patrols through the rings of Coral Veil.

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
- Commands small groups of enthralled villagers and reports directly to Pearlescent.
- Can be subdued non-lethally; breaking enthrallment later could restore him as a grateful ally.

## Roleplaying Notes
- Efficient and disciplined even under domination; reacts to signs of aboleth resistance with confusion.
