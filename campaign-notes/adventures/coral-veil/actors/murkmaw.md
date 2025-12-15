---
type: actor
name: Murkmaw
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: fey
      subtype: sea hag coven leader
    alignment: neutral evil
    cr: 3
  traits:
    size: med
---

# Murkmaw
*Sea hag coven leader*

Calculating and fond of riddles, Murkmaw leads the trio of hags haunting the descent shaft. She collects teeth from victims and prefers deals that leave her with leverage.

```foundry-yaml
system:
  abilities:
    str:
      value: 16
    dex:
      value: 12
    con:
      value: 16
    int:
      value: 12
    wis:
      value: 12
    cha:
      value: 13
  attributes:
    ac:
      flat: 14
      calc: flat
    hp:
      value: 52
      max: 52
    prof: 2
    movement:
      walk: 30
      swim: 40
    senses:
      darkvision: 60
  skills:
    prc:
      value: 1
    ste:
      value: 1
  traits:
    size: med
    languages:
      value:
        - common
        - aquan
```

## Biography {.system.details.biography.value}
- Uses standard sea hag statistics, fighting viciously but fleeing once the coven is weakened.
- Interested in magical payments, dangerous secrets, or binding favors.
- Can be intimidated with proof of greater threats ([[/check Intimidation 16]]), especially mentions of the Marrow Titan.

## Roleplaying Notes
- Speaks in riddles and bargains; weighs whether alliance or betrayal serves her best.
