---
type: actor
name: Scabrine
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: fey
      subtype: sea hag
    alignment: chaotic evil
    cr: 3
  traits:
    size: med
---

# Scabrine
*Impulsive sea hag*

An impatient, violent member of the coven who can be goaded into rash actions that break the hags' unity.

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
- Uses standard sea hag statistics as part of the coven.
- Prone to charging first when provoked; flees if badly wounded or isolated.
- Negotiations falter quickly if she feels disrespected.

## Roleplaying Notes
- Quick to snarl and threaten; baiting her can fracture the coven's negotiations.
