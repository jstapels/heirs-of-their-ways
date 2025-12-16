---
type: actor
name: Veth'sora
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: aberration
      subtype: aboleth
    alignment: lawful evil
    cr: 10
  attributes:
    movement:
      swim: 40
    senses:
      darkvision: 120
  traits:
    size: huge
---

# Veth'sora
*Ancient aboleth claiming the Water Aether Orb*

A colossal fishlike aberration over twenty feet long, body dripping with mucus that clouds the surrounding water. Three baleful eyes regard intruders with ancient arrogance, and thick tentacles drift lazily until violence erupts.

```foundry-yaml
system:
  abilities:
    str:
      value: 21
    dex:
      value: 9
    con:
      value: 15
    int:
      value: 18
    wis:
      value: 15
    cha:
      value: 18
  attributes:
    ac:
      flat: 17
      calc: flat
    hp:
      value: 150
      max: 150
    prof: 4
    movement:
      walk: 10
      swim: 40
    senses:
      darkvision: 120
      special: "proficient in telepathy to 120 ft."
  skills:
    his:
      value: 6
    prc:
      value: 8
  traits:
    size: huge
    languages:
      value:
        - deep
      custom: "telepathy 120 ft."
```

## Biography {.system.details.biography.value}
- Drawn to the Water Aether Orb and now entrenched in the Pearlheart Chamber.
- Enhanced aboleth stats: HP 150; legendary actions (Tentacle, Psychic Lash [[/save INT 14]] for [[/damage 2d8 psychic]], Summon Thrall); lair actions including cold surge ([[/damage 2d6 cold]] on [[/save CON 14]]), mirror image, or charm ([[/save WIS 14]]).
- Near the orb, regenerates 10 HP/turn and raises psychic DCs by 2; orb can be ripped free with [[/check Athletics 15]].
- At 50 HP may attempt to flee, seeking to become a recurring threat.

## Tactics
- Dominates the strongest foe (often Threk) and uses enthralled villagers as shields.
- Commands Pearlescent telepathically and uses sharks for protection.
