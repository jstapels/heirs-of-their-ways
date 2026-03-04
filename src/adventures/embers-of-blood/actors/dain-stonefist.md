---
type: actor
name: Dain Stonefist
_id: EmBlDainStonef01
img: icons/svg/mystery-man.svg
system:
  type: npc
  details:
    type:
      value: humanoid
      subtype: human ranger
    alignment: lawful neutral
    cr: 9
  attributes:
    movement:
      walk: 35
    senses:
      darkvision: 0
    ac:
      flat: 18
      calc: flat
    hp:
      value: 168
      max: 168
    prof: 4
  traits:
    size: med
    languages:
      value:
        - common
        - goblin
  abilities:
    str:
      value: 14
    dex:
      value: 20
    con:
      value: 16
    int:
      value: 12
    wis:
      value: 18
    cha:
      value: 10
  skills:
    ste:
      value: 2
    sur:
      value: 2
    prc:
      value: 2
    ins:
      value: 1
---

# Dain Stonefist
*Medium humanoid (human), lawful neutral*

Mara Stonefist's older brother. Dain is a disciplined hunter who hid his vendetta behind calm manners and ranger professionalism.

## Biography {.system.details.biography.value}
**Revenant Tracker.** Dain marks one creature he can see within 90 feet as his quarry for 1 minute. Dain's weapon attacks against that target deal an extra [[/damage 1d6]] damage.

### Actions

**Multiattack.** Dain makes three attacks with Emberwood Longbow or two attacks with Stonefist Blades.

**Emberwood Longbow.** *Ranged Weapon Attack:* +10 to hit, range 150/600 ft., one target. *Hit:* [[/damage 1d8+5 piercing]] plus [[/damage 1d6 fire]] against his quarry.

**Stonefist Blades.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* [[/damage 1d6+5 slashing]].

**Snare Shot (Recharge 5-6).** A hit target must make [[/save STR 16]] or become restrained by anchored line until the end of its next turn.

### Bonus Actions

**Skirmisher's Step.** Dain moves up to half his speed without provoking opportunity attacks from one creature he has attacked this turn.
