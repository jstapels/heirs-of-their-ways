# Item Name

## Basic Information
- **Type:** Weapon / Armor / Wondrous Item / Potion / etc.
- **Rarity:** Common / Uncommon / Rare / Very Rare / Legendary / Artifact
- **Attunement:** Required / Not Required
- **Value:** X gp

## Description
Physical description of the item. What does it look like? Any notable markings?

## Properties
Game mechanics and effects:

> **Item Name**
> *Type, Rarity (requires attunement)*
>
> Description of the item's properties and how it works.
>
> - Property 1
> - Property 2
> - Property 3

## History
The story behind this item. Who made it? Why? What is its legend?

## Quirks (Optional)
Unusual behaviors or personality traits:
- [Quirk 1]

## Sentience (If Applicable)
- **Intelligence:** X
- **Wisdom:** X
- **Charisma:** X
- **Communication:** Telepathy / Speech / Emotion
- **Personality:** Description
- **Goals:** What the item wants

## Curse (If Applicable)
Any negative effects that aren't immediately apparent.

## Finding This Item
How might characters encounter this item?
- [Method 1]
- [Method 2]

---

## YAML Reference

When creating the item in YAML format:

```yaml
_id: UniqueID16Chars
name: Item Name
type: equipment  # weapon, equipment, consumable
img: icons/path/to/icon.webp
folder: FolderID16Chars

system:
  description:
    value: >-
      <p>Item description with [[/damage 1d8 slashing]] if applicable.</p>
  rarity: rare
  attunement: required
  price:
    value: 1000
    denomination: gp
  weight:
    value: 3
    units: lb

_key: '!items!UniqueID16Chars'
```
