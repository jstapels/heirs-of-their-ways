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

1. **Edit markdown source files (recommended):**
   ```bash
   # Edit files in src/
   # Frontmatter defines document data (type, system, effects, etc.)
   ```

2. **Build everything:**
   ```bash
   npm run build
   ```

3. **Refresh FoundryVTT:**
   - Press F5 in FoundryVTT to reload
   - Or restart FoundryVTT

4. **Test your changes:**
   - Open the Compendium Packs tab
   - Browse the "Heirs: *" packs
   - Verify your content appears correctly

### Creating New Content

#### Method 1: Write Markdown (Frontmatter-First)

1. Create a new `.md` file in `src/`:
   ```bash
   # Example: Creating an NPC
   code src/module/actors/my-npc.md
   ```

2. Add frontmatter and content (see `docs/WORKFLOW.md` for examples)
   - Place images in `src/**/assets/` and reference them with relative paths

3. Build and test:
   ```bash
   npm run build
   # Refresh FoundryVTT
   ```

#### Method 2: Create in FoundryVTT First

1. Create content in FoundryVTT UI
2. Add to the appropriate "Heirs: *" compendium
3. Extract to YAML:
   ```bash
   npm run extract:packs
   ```
4. Use the extracted YAML for reference, then migrate changes into `src/`
5. Rebuild:
   ```bash
   npm run build:packs
   ```

#### Method 3: Use Claude Code

1. Write notes in `src/`:
   ```bash
   code src/module/actors/my-npc.md
   ```

2. Ask Claude to generate frontmatter-first markdown:
   ```
   "Generate a frontmatter-first markdown actor file for the NPC described in
    src/module/actors/my-npc.md"
   ```

3. Build and test:
   ```bash
   npm run build
   ```

## Common Commands

```bash
# Build markdown → YAML → LevelDB
npm run build

# Copy src assets → assets/
npm run build:assets

# Build markdown → YAML only
npm run build:yaml

# Build packs from YAML only (YAML → LevelDB)
npm run build:packs

# Build specific pack
npm run build:packs -- heirs-actors   # or heirs-items/heirs-journals/etc.

# Extract all packs (LevelDB → YAML)
npm run extract:packs

# Extract specific pack
npm run extract:packs -- heirs-actors   # or heirs-items/heirs-journals/etc.

# Clean/standardize YAML formatting
npm run clean:packs

# Install/update dependencies
npm install

# Run build checks
npm test

# Create a new adventure scaffold
npm run create -- my-new-adventure
```

## Directory Structure Quick Reference

```
📁 src/                 # Markdown source (module + adventures)
📁 packs/_source/       # YAML sources (generated)
📁 packs/heirs-actors/  # Compiled LevelDB (generated)
📁 packs/heirs-items/
📁 packs/heirs-features/
📁 packs/heirs-journals/
📁 packs/heirs-scenes/
📁 packs/heirs-tables/
📁 assets/              # Built assets (generated)
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
- `.gitignore` should exclude build outputs (`packs/`, `assets/`, `dist/`)
- Only commit source files in `src/`
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
3. Read [docs/DND5E-YAML-STRUCTURE.md](docs/DND5E-YAML-STRUCTURE.md) for YAML format
4. Check example files in `src/module/` and `src/adventures/`
5. Start creating your campaign content!

## Getting Help

- Check the [documentation](docs/)
- Review example files
- Look at [FoundryVTT docs](https://foundryvtt.com/kb/)
- Check [DnD5e system wiki](https://github.com/foundryvtt/dnd5e/wiki)
- Open an [issue on GitHub](https://github.com/jstapels/heirs-of-their-ways/issues)

---

Happy creating! 🎲
