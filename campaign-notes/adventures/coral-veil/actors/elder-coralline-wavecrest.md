---
type: actor
name: Elder Coralline Wavecrest
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: sea elf druid
    alignment: neutral good
    cr: 8
  attributes:
    movement:
      walk: 30
      swim: 40
    senses:
      darkvision: 60
  traits:
    size: med
---

# Elder Coralline Wavecrest
*Sea elf druid and leader of Coral Veil*

An elderly sea elf with silver-blue skin, white hair that drifts like seafoam, and storm-gray eyes full of grief and resolve. Her robes are woven from kelp and shells; she leans on a white coral staff topped with a softly glowing pearl.

```foundry-yaml
system:
  abilities:
    str:
      value: 10
    dex:
      value: 12
    con:
      value: 18
    int:
      value: 14
    wis:
      value: 17
    cha:
      value: 14
  attributes:
    ac:
      flat: 15
      calc: flat
    hp:
      value: 85
      max: 85
    prof: 3
    movement:
      walk: 30
      swim: 40
  skills:
    med:
      value: 2
    nat:
      value: 2
    prc:
      value: 3
  traits:
    size: med
    languages:
      value:
        - common
        - elvish
        - aquan
```

## Biography {.system.details.biography.value}
- Village matriarch guiding ~20 free sea elves in the outer tunnels.
- Sent Thalindra to the surface while she organizes resistance against Veth'sora.
- Knows the aboleth's name (Veth'sora), the count of enthralled villagers, and that enthrallment can be broken if victims are kept alive and away from water.
- Begs for a chance to save her daughter Pearlescent if possible.

## Roleplaying Notes
- Speaks slowly and deliberately; protective of her people above all else.
- Pragmatic about losses but clings to hope for family.
- Offers tactical guidance, coordinates distractions, and provides rewards if the village survives.
