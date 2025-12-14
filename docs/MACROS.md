# Heirs of Their Ways - Useful Macros

This document contains ready-to-use macros for your FoundryVTT D&D 5e campaign. To use a macro, create a new macro in Foundry and paste the code.

---

## Table of Contents

- [DM Tools](#dm-tools)
- [Player Tools](#player-tools)
- [Combat Helpers](#combat-helpers)
- [Utility Macros](#utility-macros)

---

## DM Tools

### Quick NPC Roller

Quickly roll ability checks or saving throws for NPCs without opening their sheet.

```javascript
// Quick NPC Roller - Select a token and run this macro
// Type: script

const token = canvas.tokens.controlled[0];
if (!token) {
  ui.notifications.warn("Please select a token first.");
  return;
}

const actor = token.actor;
const abilities = ["str", "dex", "con", "int", "wis", "cha"];
const skills = Object.keys(actor.system.skills);

const content = `
  <form>
    <div class="form-group">
      <label>Roll Type:</label>
      <select name="rollType">
        <option value="ability">Ability Check</option>
        <option value="save">Saving Throw</option>
        <option value="skill">Skill Check</option>
      </select>
    </div>
    <div class="form-group">
      <label>Ability/Skill:</label>
      <select name="ability">
        ${abilities.map(a => `<option value="${a}">${a.toUpperCase()}</option>`).join("")}
      </select>
    </div>
    <div class="form-group">
      <label>Advantage/Disadvantage:</label>
      <select name="mode">
        <option value="normal">Normal</option>
        <option value="advantage">Advantage</option>
        <option value="disadvantage">Disadvantage</option>
      </select>
    </div>
  </form>
`;

new Dialog({
  title: `Roll for ${actor.name}`,
  content,
  buttons: {
    roll: {
      icon: '<i class="fas fa-dice-d20"></i>',
      label: "Roll",
      callback: async (html) => {
        const rollType = html.find('[name="rollType"]').val();
        const ability = html.find('[name="ability"]').val();
        const mode = html.find('[name="mode"]').val();

        const options = {
          advantage: mode === "advantage",
          disadvantage: mode === "disadvantage"
        };

        if (rollType === "ability") {
          await actor.rollAbilityTest(ability, options);
        } else if (rollType === "save") {
          await actor.rollAbilitySave(ability, options);
        } else {
          await actor.rollSkill(ability, options);
        }
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "roll"
}).render(true);
```

---

### Group Skill Check

Roll a skill check for all selected tokens at once.

```javascript
// Group Skill Check - Select multiple tokens and run
// Type: script

const tokens = canvas.tokens.controlled;
if (tokens.length === 0) {
  ui.notifications.warn("Please select at least one token.");
  return;
}

const skills = {
  "acr": "Acrobatics",
  "ani": "Animal Handling",
  "arc": "Arcana",
  "ath": "Athletics",
  "dec": "Deception",
  "his": "History",
  "ins": "Insight",
  "itm": "Intimidation",
  "inv": "Investigation",
  "med": "Medicine",
  "nat": "Nature",
  "prc": "Perception",
  "prf": "Performance",
  "per": "Persuasion",
  "rel": "Religion",
  "slt": "Sleight of Hand",
  "ste": "Stealth",
  "sur": "Survival"
};

const content = `
  <form>
    <div class="form-group">
      <label>Skill:</label>
      <select name="skill">
        ${Object.entries(skills).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}
      </select>
    </div>
    <div class="form-group">
      <label>DC (optional):</label>
      <input type="number" name="dc" placeholder="Leave blank to just roll"/>
    </div>
  </form>
`;

new Dialog({
  title: "Group Skill Check",
  content,
  buttons: {
    roll: {
      icon: '<i class="fas fa-dice-d20"></i>',
      label: "Roll All",
      callback: async (html) => {
        const skill = html.find('[name="skill"]').val();
        const dc = html.find('[name="dc"]').val();

        let results = [];

        for (const token of tokens) {
          const roll = await token.actor.rollSkill(skill, { chatMessage: false });
          results.push({
            name: token.name,
            total: roll.total,
            success: dc ? roll.total >= parseInt(dc) : null
          });
        }

        // Create summary message
        let summary = `<h3>Group ${skills[skill]} Check</h3>`;
        if (dc) summary += `<p><strong>DC:</strong> ${dc}</p>`;
        summary += "<table><tr><th>Character</th><th>Roll</th>";
        if (dc) summary += "<th>Result</th>";
        summary += "</tr>";

        for (const r of results.sort((a, b) => b.total - a.total)) {
          summary += `<tr><td>${r.name}</td><td>${r.total}</td>`;
          if (dc) summary += `<td>${r.success ? "✓ Pass" : "✗ Fail"}</td>`;
          summary += "</tr>";
        }
        summary += "</table>";

        ChatMessage.create({
          content: summary,
          whisper: ChatMessage.getWhisperRecipients("GM")
        });
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "roll"
}).render(true);
```

---

### Rest Manager

Quickly apply short or long rest to selected tokens.

```javascript
// Rest Manager - Apply rest to selected tokens
// Type: script

const tokens = canvas.tokens.controlled;
if (tokens.length === 0) {
  ui.notifications.warn("Please select at least one token.");
  return;
}

const tokenNames = tokens.map(t => t.name).join(", ");

new Dialog({
  title: "Rest Manager",
  content: `
    <p>Apply rest to: <strong>${tokenNames}</strong></p>
    <form>
      <div class="form-group">
        <label>Rest Type:</label>
        <select name="restType">
          <option value="short">Short Rest</option>
          <option value="long">Long Rest</option>
        </select>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" name="dialog" checked/>
          Show individual rest dialogs
        </label>
      </div>
    </form>
  `,
  buttons: {
    rest: {
      icon: '<i class="fas fa-bed"></i>',
      label: "Rest",
      callback: async (html) => {
        const restType = html.find('[name="restType"]').val();
        const showDialog = html.find('[name="dialog"]').is(':checked');

        for (const token of tokens) {
          if (restType === "short") {
            await token.actor.shortRest({ dialog: showDialog });
          } else {
            await token.actor.longRest({ dialog: showDialog });
          }
        }

        ui.notifications.info(`${restType === "short" ? "Short" : "Long"} rest applied to ${tokens.length} character(s).`);
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "rest"
}).render(true);
```

---

## Player Tools

### Quick Heal

Quickly apply healing to your character.

```javascript
// Quick Heal - Apply healing dice to your character
// Type: script

const actor = game.user.character;
if (!actor) {
  ui.notifications.warn("You don't have an assigned character.");
  return;
}

const currentHP = actor.system.attributes.hp.value;
const maxHP = actor.system.attributes.hp.max;

const content = `
  <p><strong>${actor.name}</strong>: ${currentHP}/${maxHP} HP</p>
  <form>
    <div class="form-group">
      <label>Healing:</label>
      <input type="text" name="healing" placeholder="e.g., 2d8+4 or 15"/>
    </div>
  </form>
`;

new Dialog({
  title: "Quick Heal",
  content,
  buttons: {
    heal: {
      icon: '<i class="fas fa-heart"></i>',
      label: "Heal",
      callback: async (html) => {
        const healingFormula = html.find('[name="healing"]').val();
        if (!healingFormula) return;

        const roll = await new Roll(healingFormula).evaluate();
        await roll.toMessage({ flavor: `${actor.name} heals` });

        const newHP = Math.min(currentHP + roll.total, maxHP);
        await actor.update({ "system.attributes.hp.value": newHP });

        ui.notifications.info(`Healed ${roll.total} HP. Now at ${newHP}/${maxHP}.`);
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "heal"
}).render(true);
```

---

### Spend Hit Dice

Quickly spend hit dice during a short rest.

```javascript
// Spend Hit Dice - Use hit dice for healing
// Type: script

const actor = game.user.character;
if (!actor) {
  ui.notifications.warn("You don't have an assigned character.");
  return;
}

const classes = Object.values(actor.classes);
if (classes.length === 0) {
  ui.notifications.warn("Your character has no classes.");
  return;
}

const currentHP = actor.system.attributes.hp.value;
const maxHP = actor.system.attributes.hp.max;
const conMod = actor.system.abilities.con.mod;

let hdOptions = "";
for (const cls of classes) {
  const available = cls.system.levels - cls.system.hitDiceUsed;
  hdOptions += `<option value="${cls.identifier}" ${available <= 0 ? "disabled" : ""}>
    ${cls.name} (d${cls.system.hitDice}) - ${available} available
  </option>`;
}

const content = `
  <p><strong>${actor.name}</strong>: ${currentHP}/${maxHP} HP</p>
  <p>Constitution Modifier: ${conMod >= 0 ? "+" : ""}${conMod}</p>
  <form>
    <div class="form-group">
      <label>Class:</label>
      <select name="class">${hdOptions}</select>
    </div>
    <div class="form-group">
      <label>Number of dice:</label>
      <input type="number" name="count" value="1" min="1"/>
    </div>
  </form>
`;

new Dialog({
  title: "Spend Hit Dice",
  content,
  buttons: {
    spend: {
      icon: '<i class="fas fa-dice"></i>',
      label: "Spend",
      callback: async (html) => {
        const classId = html.find('[name="class"]').val();
        const count = parseInt(html.find('[name="count"]').val()) || 1;

        const cls = classes.find(c => c.identifier === classId);
        const available = cls.system.levels - cls.system.hitDiceUsed;
        const toSpend = Math.min(count, available);

        if (toSpend <= 0) {
          ui.notifications.warn("No hit dice available for that class.");
          return;
        }

        const formula = `${toSpend}d${cls.system.hitDice} + ${toSpend * conMod}`;
        const roll = await new Roll(formula).evaluate();
        await roll.toMessage({ flavor: `${actor.name} spends ${toSpend} Hit Dice` });

        const newHP = Math.min(currentHP + roll.total, maxHP);
        await actor.update({ "system.attributes.hp.value": newHP });
        await cls.update({ "system.hitDiceUsed": cls.system.hitDiceUsed + toSpend });

        ui.notifications.info(`Healed ${roll.total} HP using ${toSpend} Hit Dice.`);
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "spend"
}).render(true);
```

---

## Combat Helpers

### Apply Damage/Healing

Quickly apply damage or healing to selected tokens.

```javascript
// Apply Damage/Healing - Select tokens and apply HP changes
// Type: script

const tokens = canvas.tokens.controlled;
if (tokens.length === 0) {
  ui.notifications.warn("Please select at least one token.");
  return;
}

const tokenNames = tokens.map(t => `${t.name} (${t.actor.system.attributes.hp.value}/${t.actor.system.attributes.hp.max})`).join("<br>");

const content = `
  <p>Selected tokens:</p>
  <p style="font-size: 0.9em;">${tokenNames}</p>
  <form>
    <div class="form-group">
      <label>Amount:</label>
      <input type="text" name="amount" placeholder="e.g., 15 or 2d6+3"/>
    </div>
    <div class="form-group">
      <label>Type:</label>
      <select name="type">
        <option value="damage">Damage</option>
        <option value="healing">Healing</option>
        <option value="temphp">Temp HP</option>
      </select>
    </div>
    <div class="form-group damage-options">
      <label>Resistance/Vulnerability:</label>
      <select name="multiplier">
        <option value="1">Normal</option>
        <option value="0.5">Resistant (half)</option>
        <option value="2">Vulnerable (double)</option>
        <option value="0">Immune</option>
      </select>
    </div>
  </form>
`;

new Dialog({
  title: "Apply Damage/Healing",
  content,
  buttons: {
    apply: {
      icon: '<i class="fas fa-check"></i>',
      label: "Apply",
      callback: async (html) => {
        const amountFormula = html.find('[name="amount"]').val();
        const type = html.find('[name="type"]').val();
        const multiplier = parseFloat(html.find('[name="multiplier"]').val());

        if (!amountFormula) return;

        const roll = await new Roll(amountFormula).evaluate();
        let amount = Math.floor(roll.total * (type === "damage" ? multiplier : 1));

        for (const token of tokens) {
          const actor = token.actor;
          const hp = actor.system.attributes.hp;

          if (type === "damage") {
            // Apply damage (considering temp HP first)
            let remaining = amount;
            let newTemp = hp.temp || 0;

            if (newTemp > 0) {
              const tempDamage = Math.min(remaining, newTemp);
              newTemp -= tempDamage;
              remaining -= tempDamage;
            }

            const newHP = Math.max(0, hp.value - remaining);
            await actor.update({
              "system.attributes.hp.value": newHP,
              "system.attributes.hp.temp": newTemp
            });
          } else if (type === "healing") {
            const newHP = Math.min(hp.max, hp.value + amount);
            await actor.update({ "system.attributes.hp.value": newHP });
          } else if (type === "temphp") {
            // Temp HP doesn't stack, take higher value
            const newTemp = Math.max(hp.temp || 0, amount);
            await actor.update({ "system.attributes.hp.temp": newTemp });
          }
        }

        const typeLabel = type === "damage" ? "damage" : type === "healing" ? "healing" : "temp HP";
        ChatMessage.create({
          content: `Applied ${roll.total} ${typeLabel} to ${tokens.length} token(s).`
        });
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "apply"
}).render(true);
```

---

### Toggle Condition

Quickly toggle conditions on selected tokens.

```javascript
// Toggle Condition - Add/remove conditions from selected tokens
// Type: script

const tokens = canvas.tokens.controlled;
if (tokens.length === 0) {
  ui.notifications.warn("Please select at least one token.");
  return;
}

const conditions = [
  "Blinded", "Charmed", "Deafened", "Exhaustion",
  "Frightened", "Grappled", "Incapacitated", "Invisible",
  "Paralyzed", "Petrified", "Poisoned", "Prone",
  "Restrained", "Stunned", "Unconscious"
];

const content = `
  <p>Select condition to toggle on ${tokens.length} token(s):</p>
  <form>
    <div class="form-group">
      <select name="condition">
        ${conditions.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join("")}
      </select>
    </div>
  </form>
`;

new Dialog({
  title: "Toggle Condition",
  content,
  buttons: {
    toggle: {
      icon: '<i class="fas fa-sync"></i>',
      label: "Toggle",
      callback: async (html) => {
        const conditionId = html.find('[name="condition"]').val();

        for (const token of tokens) {
          const existing = token.actor.effects.find(e =>
            e.statuses.has(conditionId)
          );

          if (existing) {
            await existing.delete();
          } else {
            const effect = CONFIG.statusEffects.find(e => e.id === conditionId);
            if (effect) {
              await token.actor.createEmbeddedDocuments("ActiveEffect", [{
                label: effect.name,
                icon: effect.icon,
                statuses: [conditionId]
              }]);
            }
          }
        }

        ui.notifications.info(`Toggled ${conditionId} on ${tokens.length} token(s).`);
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "toggle"
}).render(true);
```

---

## Utility Macros

### Roll on Compendium Table

Roll on a roll table from the module's compendium.

```javascript
// Roll on Compendium Table - Quick access to campaign tables
// Type: script

const pack = game.packs.get("heirs-of-their-ways.heirs-tables");
if (!pack) {
  ui.notifications.warn("Could not find the heirs-tables compendium.");
  return;
}

const tables = await pack.getDocuments();
if (tables.length === 0) {
  ui.notifications.warn("No tables found in compendium.");
  return;
}

const content = `
  <form>
    <div class="form-group">
      <label>Select Table:</label>
      <select name="table">
        ${tables.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
      </select>
    </div>
  </form>
`;

new Dialog({
  title: "Roll on Table",
  content,
  buttons: {
    roll: {
      icon: '<i class="fas fa-dice"></i>',
      label: "Roll",
      callback: async (html) => {
        const tableId = html.find('[name="table"]').val();
        const table = tables.find(t => t.id === tableId);
        if (table) {
          await table.draw();
        }
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "roll"
}).render(true);
```

---

### Token Light Toggle

Quickly toggle light sources on a token.

```javascript
// Token Light Toggle - Cycle through common light sources
// Type: script

const token = canvas.tokens.controlled[0];
if (!token) {
  ui.notifications.warn("Please select a token.");
  return;
}

const lightPresets = {
  "none": { dim: 0, bright: 0, color: null, animation: { type: null } },
  "candle": { dim: 10, bright: 5, color: "#ff9329", animation: { type: "torch", speed: 2, intensity: 2 } },
  "torch": { dim: 40, bright: 20, color: "#ff9329", animation: { type: "torch", speed: 5, intensity: 5 } },
  "lamp": { dim: 60, bright: 30, color: "#ff9329", animation: { type: "torch", speed: 2, intensity: 2 } },
  "bullseye": { dim: 120, bright: 60, color: "#ff9329", animation: { type: "torch", speed: 2, intensity: 2 }, angle: 60 },
  "light-cantrip": { dim: 40, bright: 20, color: "#ffffff", animation: { type: null } },
  "darkvision": { dim: 60, bright: 0, color: null, animation: { type: null } }
};

const content = `
  <form>
    <div class="form-group">
      <label>Light Source:</label>
      <select name="light">
        <option value="none">None (Off)</option>
        <option value="candle">Candle (5/10 ft)</option>
        <option value="torch">Torch (20/40 ft)</option>
        <option value="lamp">Hooded Lantern (30/60 ft)</option>
        <option value="bullseye">Bullseye Lantern (60/120 ft, 60°)</option>
        <option value="light-cantrip">Light Cantrip (20/40 ft)</option>
        <option value="darkvision">Darkvision (60 ft dim)</option>
      </select>
    </div>
  </form>
`;

new Dialog({
  title: `Light Source - ${token.name}`,
  content,
  buttons: {
    apply: {
      icon: '<i class="fas fa-lightbulb"></i>',
      label: "Apply",
      callback: async (html) => {
        const lightType = html.find('[name="light"]').val();
        const preset = lightPresets[lightType];

        const update = {
          "light.dim": preset.dim,
          "light.bright": preset.bright,
          "light.color": preset.color,
          "light.animation.type": preset.animation?.type || null,
          "light.animation.speed": preset.animation?.speed || 5,
          "light.animation.intensity": preset.animation?.intensity || 5
        };

        if (preset.angle) {
          update["light.angle"] = preset.angle;
        } else {
          update["light.angle"] = 360;
        }

        await token.document.update(update);
        ui.notifications.info(`${token.name}: ${lightType === "none" ? "Light off" : lightType + " light"}`);
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel"
    }
  },
  default: "apply"
}).render(true);
```

---

## Installation Notes

1. Create a new macro in Foundry (right-click the macro bar)
2. Set the macro type to "Script"
3. Paste the JavaScript code
4. Give it an appropriate name and icon
5. Drag to your macro bar for quick access

### Recommended Icons

- DM Tools: `icons/svg/d20.svg`
- Healing: `icons/svg/heal.svg`
- Damage: `icons/svg/blood.svg`
- Conditions: `icons/svg/daze.svg`
- Rest: `icons/svg/sleep.svg`
- Light: `icons/svg/light.svg`
- Tables: `icons/svg/dice-target.svg`
