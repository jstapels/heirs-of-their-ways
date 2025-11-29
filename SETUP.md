# Setup Guide

Quick setup guide for the Heirs of Their Ways campaign module.

## First Time Setup

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **FoundryVTT** v13+ with DnD5e v5.2+

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jstapels/heirs-of-their-ways.git
   cd heirs-of-their-ways
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the compendium packs:**
   ```bash
   npm run build:packs
   ```

4. **Link to FoundryVTT:**

   **Option A: Symbolic Link (recommended for development)**
   ```bash
   # Windows (run as Administrator)
   mklink /D "C:\Users\YourName\AppData\Local\FoundryVTT\Data\modules\heirs-of-their-ways" "C:\path\to\heirs-of-their-ways"

   # macOS/Linux
   ln -s /path/to/heirs-of-their-ways ~/foundrydata/Data/modules/heirs-of-their-ways
   ```

   **Option B: Copy files**
   ```bash
   # Copy the entire directory to your FoundryVTT modules folder
   cp -r heirs-of-their-ways /path/to/FoundryVTT/Data/modules/
   ```

5. **Enable in FoundryVTT:**
   - Launch FoundryVTT
   - Create or open a DnD5e world
   - Go to Settings → Manage Modules
   - Enable "Heirs of Their Ways"
   - Save and reload

## Development Workflow

### Editing Content

1. **Edit YAML source files:**
   ```bash
   # Edit files in packs/_source/heirs-pack/
   # - actors/   (NPCs, creatures)
   # - items/    (weapons, armor, magic items)
   # - journals/ (adventures, lore)
   # - scenes/   (maps, encounters)
   # - tables/   (random tables)
   ```

2. **Build the packs:**
   ```bash
   npm run build:packs
   ```

3. **Refresh FoundryVTT:**
   - Press F5 in FoundryVTT to reload
   - Or restart FoundryVTT

4. **Test your changes:**
   - Open the Compendium Packs tab
   - Browse "Heirs Campaign" pack
   - Verify your content appears correctly

### Creating New Content

#### Method 1: Write YAML Directly

1. Create a new `.yaml` file in the appropriate directory:
   ```bash
   # Example: Creating an NPC
   code packs/_source/heirs-pack/actors/my-npc.yaml
   ```

2. Use example files as templates:
   - `actors/example-npc.yaml`
   - `items/example-weapon.yaml`
   - `journals/example-journal.yaml`

3. Build and test:
   ```bash
   npm run build:packs
   # Refresh FoundryVTT
   ```

#### Method 2: Create in FoundryVTT First

1. Create content in FoundryVTT UI
2. Add to the "Heirs Campaign" compendium
3. Extract to YAML:
   ```bash
   npm run extract:packs
   ```
4. Find your new YAML file in `packs/_source/heirs-pack/`
5. Edit and enhance with comments
6. Rebuild:
   ```bash
   npm run build:packs
   ```

#### Method 3: Use Claude Code

1. Write notes in `campaign-notes/`:
   ```bash
   code campaign-notes/npcs/my-npc.md
   ```

2. Ask Claude to generate YAML:
   ```
   "Generate a YAML actor file for the NPC described in
    campaign-notes/npcs/my-npc.md"
   ```

3. Build and test:
   ```bash
   npm run build:packs
   ```

## Common Commands

```bash
# Build all packs (YAML → LevelDB)
npm run build:packs

# Build specific pack
npm run build:packs -- heirs-pack

# Extract all packs (LevelDB → YAML)
npm run extract:packs

# Extract specific pack
npm run extract:packs -- heirs-pack

# Clean/standardize YAML formatting
npm run clean:packs

# Install/update dependencies
npm install
```

## Directory Structure Quick Reference

```
📁 campaign-notes/      # Your planning notes (markdown)
📁 packs/_source/       # ⭐ Edit YAML here! (version controlled)
  └─ heirs-pack/
     ├─ actors/
     ├─ items/
     ├─ journals/
     ├─ scenes/
     └─ tables/
📁 packs/heirs-pack/    # Compiled LevelDB (auto-generated)
📁 assets/              # Images, maps, tokens, sounds
📁 docs/                # Documentation
📁 utils/               # Build scripts
```

## Troubleshooting

### Build fails

**Problem:** `npm run build:packs` fails

**Solutions:**
- Check YAML syntax (use a validator online)
- Look for indentation errors (must be 2 spaces, no tabs)
- Check the error message for the file and line number
- Compare with example files

### Changes don't appear in Foundry

**Problem:** Edited YAML but don't see changes

**Solutions:**
1. Did you run `npm run build:packs`?
2. Did you refresh FoundryVTT (F5)?
3. Check the compendium is unlocked (right-click → unlock)
4. Look in FoundryVTT console (F12) for errors

### Module doesn't appear in Foundry

**Problem:** Module not listed in Manage Modules

**Solutions:**
- Check `module.json` exists and is valid JSON
- Verify the module is in the correct directory
- Check file permissions
- Look in FoundryVTT console (F12) for errors
- Restart FoundryVTT

### Git shows binary file changes

**Problem:** Git wants to commit LevelDB files

**Solution:**
- `.gitignore` should exclude `packs/*/` except `packs/_source/`
- Only commit YAML files in `packs/_source/`
- Run `git status` to verify

### npm install fails

**Problem:** Dependencies won't install

**Solutions:**
- Update Node.js to v18+
- Delete `node_modules` and `package-lock.json`:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Check internet connection
- Try using `npm install --legacy-peer-deps`

## Next Steps

1. Read [docs/WORKFLOW.md](docs/WORKFLOW.md) for detailed workflow
2. Read [docs/ENRICHERS.md](docs/ENRICHERS.md) for enricher syntax
3. Read [packs/_source/README.md](packs/_source/README.md) for YAML format
4. Check example files in `packs/_source/heirs-pack/`
5. Start creating your campaign content!

## Getting Help

- Check the [documentation](docs/)
- Review example files
- Look at [FoundryVTT docs](https://foundryvtt.com/kb/)
- Check [DnD5e system wiki](https://github.com/foundryvtt/dnd5e/wiki)
- Open an [issue on GitHub](https://github.com/jstapels/heirs-of-their-ways/issues)

---

Happy creating! 🎲
