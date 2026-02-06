---
type: actor
name: Warden Ilyra
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: undead
      subtype: temporal echo custodian
    alignment: lawful neutral
    cr: 7
  attributes:
    movement:
      walk: 30
      fly: 30
    senses:
      darkvision: 60
    ac:
      flat: 16
      calc: flat
    hp:
      value: 110
      max: 110
    prof: 3
  traits:
    size: med
    languages:
      value:
        - common
        - elvish
      custom: telepathy 60 ft.
  abilities:
    str:
      value: 12
    dex:
      value: 16
    con:
      value: 16
    int:
      value: 14
    wis:
      value: 15
    cha:
      value: 14
---

# Warden Ilyra
*Medium undead, lawful neutral*

A translucent guardian whose features flicker across multiple life stages. Ilyra can be an ally, a gatekeeper, or a miniboss depending on party choices.

## Biography {.system.details.biography.value}
- **Damage Resistances:** necrotic, psychic
- **Condition Immunities:** charmed, frightened
- **Skills:** Insight +6, Perception +6, Religion +5

**Custodian's Oath.** Ilyra cannot willingly leave the lower temple, and prioritizes containment over personal survival.

**Temporal Rebuke (Reaction).** When a creature within 30 feet succeeds on an attack against Ilyra, that creature makes a [[/save WIS 14]]{DC 14 Wisdom save} or suffers disadvantage on its next attack roll before the end of its next turn.

### Actions

**Multiattack.** Ilyra makes two Echo Blade attacks.

**Echo Blade.** *Melee Spell Attack:* +6 to hit, reach 5 ft., one target. *Hit:* [[/damage 2d8+3 force]].

**Anchor Pulse (Recharge 5-6).** Each creature of Ilyra's choice within 15 feet makes a [[/save CON 14]]{DC 14 Constitution save}. On a failure, a creature takes [[/damage 3d8 radiant]] and is restrained until the end of its next turn.
