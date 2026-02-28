# Actor Automation Template

Use this template for `type: actor` markdown files.

References:
- `/Users/jstapels/Developer/heirs-of-their-ways/docs/ACTOR-ITEM-AUTOMATION.md`
- `/Users/jstapels/Developer/heirs-of-their-ways/docs/DND5E-YAML-STRUCTURE.md`
- `/Users/jstapels/Developer/heirs-of-their-ways/docs/ENRICHERS.md`
- `/Users/jstapels/Developer/heirs-of-their-ways/docs/WORKFLOW.md`

```yaml
---
type: actor
name: Example Creature Name
_id: ExampleActor00001
img: ../assets/example-creature.webp
system:
  type: npc
  details:
    type:
      value: monstrosity
      subtype: optional subtype
    alignment: unaligned
    cr: 5
  attributes:
    ac:
      flat: 15
      calc: flat
    hp:
      value: 90
      max: 90
    movement:
      walk: 30
      swim: 0
      fly: 0
      climb: 0
      burrow: 0
    senses:
      darkvision: 60
    prof: 3
    spellcasting: int
  traits:
    size: lg
    dr:
      value:
        - necrotic
    di:
      value: []
    dv:
      value: []
    ci:
      value:
        - charmed
    languages:
      value:
        - common
      custom: ""
  abilities:
    str:
      value: 18
    dex:
      value: 14
    con:
      value: 16
      proficient: 1
    int:
      value: 8
    wis:
      value: 12
    cha:
      value: 10
  skills:
    prc:
      value: 1
    ste:
      value: 1
    arc:
      value: 1
      bonus: 1
---
```

## Biography {.system.details.biography.value}

Write lore, roleplay, and tactics here. Keep system-automated mechanics in frontmatter when possible.

- Trigger checks like [[/check Perception 15]].
- Trigger saves like [[/save con dc 14]].
- Trigger damage like [[/damage 2d8+4 bludgeoning]].

### Actions

Keep readable prose actions here for GM clarity. If you want clickable sheet actions, embed item activities.

## Optional Embedded Attack Item (`items`)

Add this under frontmatter if you want clickable actor-sheet attacks:

```yaml
items:
  - _id: ExampleBiteItem01
    name: Bite
    type: weapon
    img: icons/weapons/fangs/fang-tooth-brown.webp
    system:
      type:
        value: natural
      properties:
        - mgc
      activities:
        ExampleBiteAct01:
          _id: ExampleBiteAct01
          type: attack
          activation:
            type: action
            value: 1
            condition: ""
            override: false
          consumption:
            targets: []
            scaling:
              allowed: false
              max: ""
            spellSlot: true
          description:
            chatFlavor: ""
          duration:
            concentration: false
            value: ""
            units: inst
            special: ""
            override: false
          effects: []
          range:
            value: "5"
            units: ft
            special: ""
            override: false
          target:
            template:
              contiguous: false
              units: ft
            affects:
              count: "1"
              type: creature
              choice: false
              special: ""
            prompt: true
            override: false
          attack:
            ability: str
            bonus: "6"
            critical:
              threshold: null
            flat: true
            type:
              value: melee
              classification: weapon
          damage:
            critical:
              bonus: ""
            includeBase: false
            parts:
              - number: 2
                denomination: 8
                bonus: "3"
                types:
                  - piercing
                custom:
                  enabled: false
                  formula: ""
                scaling:
                  mode: ""
                  number: null
                  formula: ""
          uses:
            spent: 0
            recovery: []
          sort: 0
```
