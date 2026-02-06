---
type: actor
name: Serpent of Moments (Chrono-Hydra)
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: monstrosity
      subtype: hydra, temporal
    alignment: chaotic evil
    cr: 11
  attributes:
    movement:
      walk: 30
      swim: 30
    senses:
      darkvision: 120
    ac:
      flat: 17
      calc: flat
    hp:
      value: 225
      max: 225
    prof: 4
  traits:
    size: huge
    languages:
      value: []
  abilities:
    str:
      value: 20
    dex:
      value: 14
    con:
      value: 20
    int:
      value: 6
    wis:
      value: 14
    cha:
      value: 10
---

# Serpent of Moments (Chrono-Hydra)
*Huge monstrosity, chaotic evil*

A hydra warped by failed temporal bindings. Each head moves to a different rhythm: one predicts, one lags, one snaps in brutal stutter-steps.

## Biography {.system.details.biography.value}
- **Saving Throws:** Con +9, Wis +6
- **Damage Resistances:** force, psychic
- **Condition Immunities:** charmed, frightened
- **Skills:** Perception +10

**Reactive Heads.** The hydra starts with 5 heads. While it has more than 1 head, it has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious.

**Many-Headed.** The hydra gets one reaction per round for each head beyond one.

**Chronal Backwash.** When the hydra takes 25 or more damage from a single source, the attacker makes a [[/save CON 15]]{DC 15 Constitution save} or takes [[/damage 2d8 force]] and cannot take reactions until the start of its next turn.

**Temporal Regrowth.** At the start of its turn, if it has fewer than 5 heads and took no fire damage since its last turn, it regrows one head and regains 15 hit points.

### Actions

**Multiattack.** The hydra makes a number of bite attacks equal to its current heads.

**Bite.** *Melee Weapon Attack:* +9 to hit, reach 10 ft., one target. *Hit:* 10 (1d10 + 5) piercing damage plus [[/damage 1d6 force]].

**Rift Spit (Recharge 5-6).** The hydra spits unstable temporal matter in a 30-foot cone. Creatures in the area must make a [[/save DEX 16]]{DC 16 Dexterity save}. On a failure, a creature takes [[/damage 6d6 force]] and its initiative is reduced by 5 until the end of the next round. On a success, it takes half damage.

### Lair Actions (Initiative 20)

Choose one:
- **Dragged Second:** One creature makes a [[/save WIS 15]]{DC 15 Wisdom save} or is slowed until initiative 20 next round.
- **Fracture Wave:** Creatures in a 20-foot radius make a [[/save DEX 15]]{DC 15 Dexterity save} or are pushed 10 feet and knocked prone.
- **Echoed Strike:** The hydra repeats one successful bite attack against the same target.
