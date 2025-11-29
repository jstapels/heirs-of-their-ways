# Heirs of Their Ways

A FoundryVTT module for the **Heirs of Their Ways** D&D 5e campaign.

## Overview

This module packages campaign-specific content for use with Foundry Virtual Tabletop v13+ and the D&D 5e system v5.2+. It includes adventures, NPCs, custom items, scenes, and campaign lore.

## Features

- **Adventure Content** - Complete adventures with scenes, encounters, and journals
- **NPCs & Creatures** - Custom and modified creatures for the campaign
- **Magic Items** - Unique magical items and artifacts
- **Campaign Lore** - World history, factions, and background information
- **Interactive Journals** - Rich journal entries using FoundryVTT enrichers

## Installation

### For FoundryVTT

Install directly from the module browser or use the manifest URL:

**Manifest URL:**
```
https://github.com/jstapels/heirs-of-their-ways/releases/latest/download/module.json
```

**Steps:**
1. Open FoundryVTT and navigate to Add-on Modules
2. Click "Install Module"
3. Paste the manifest URL above
4. Click Install

The module will automatically update when new releases are published.

### For Development

1. Clone this repository:
   ```bash
   git clone https://github.com/jstapels/heirs-of-their-ways.git
   ```
2. Link or copy to your FoundryVTT modules directory:
   ```bash
   ln -s /path/to/heirs-of-their-ways /path/to/FoundryVTT/Data/modules/heirs-of-their-ways
   ```
3. Enable the module in your world's module settings

## Project Structure

```
heirs-of-their-ways/
├── module.json              # FoundryVTT module manifest
├── README.md                # This file
├── CLAUDE.md                # Guide for AI assistants
├── docs/                    # Documentation
│   ├── ENRICHERS.md        # Text enrichers reference
│   └── WORKFLOW.md         # Development workflow guide
├── campaign-notes/          # Source notes in markdown
│   ├── adventures/         # Adventure outlines
│   ├── npcs/              # NPC descriptions
│   ├── locations/         # Location details
│   ├── items/             # Item descriptions
│   └── lore/              # World lore
├── source-data/            # JSON exports for version control
│   ├── actors/            # NPC/creature JSON
│   ├── items/             # Item JSON
│   ├── journals/          # Journal JSON
│   ├── scenes/            # Scene JSON
│   └── tables/            # Roll table JSON
├── assets/                 # Media files
│   ├── maps/              # Scene maps
│   ├── tokens/            # Token artwork
│   ├── images/            # Other images
│   └── sounds/            # Audio files
└── packs/                  # Compendium packs
    └── heirs-pack/        # Main adventure pack
```

## Usage

### Accessing Content

1. Enable the "Heirs of Their Ways" module in your world
2. Open the Compendium Packs sidebar tab
3. Browse the "Heirs Campaign" pack for content
4. Drag content into your world as needed

### For Game Masters

- **Adventures** - Import complete adventures with all necessary content
- **NPCs** - Drag NPCs from compendium to scenes
- **Items** - Add custom items to loot or NPC inventories
- **Journals** - Share lore and handouts with players

## Development

This module uses a modern development workflow with YAML sources and automated releases.

### Workflow

1. **Edit** YAML files in `packs/_source/heirs-pack/`
2. **Build** compendium packs with `npm run build:packs`
3. **Test** in FoundryVTT
4. **Commit** changes with descriptive messages
5. **Create PR** with appropriate version label
6. **Merge** to trigger automatic release

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for detailed development workflow.

### Automated Releases

When a PR is merged to `main`, GitHub Actions automatically:
- Bumps version based on PR labels (`version:major`, `version:minor`, `version:patch`)
- Builds compendium packs from YAML sources
- Creates release zip and manifest
- Publishes GitHub Release

See [docs/RELEASE.md](docs/RELEASE.md) for complete release process documentation.

### For Contributors

- Read [CLAUDE.md](CLAUDE.md) for AI-assisted development guidelines
- Check [docs/ENRICHERS.md](docs/ENRICHERS.md) for text enricher syntax
- Follow the workflow in [docs/WORKFLOW.md](docs/WORKFLOW.md)
- Review [docs/RELEASE.md](docs/RELEASE.md) before creating PRs

## Requirements

- **FoundryVTT** - Version 13 or higher
- **D&D 5e System** - Version 5.2 or higher

## Compatibility

- FoundryVTT v13+
- D&D 5e system v5.2+
- Tested on latest stable releases

## License

- **Software/Module:** MIT License
- **Content:** All campaign content © 2025 Jason Stapels
- **D&D 5e Content:** Uses material from System Reference Document 5.1 and 5.2 under CC BY 4.0

## Author

**Jason Stapels**
- Email: jstapels@gmail.com
- GitHub: [@jstapels](https://github.com/jstapels)

## Resources

- [FoundryVTT](https://foundryvtt.com/)
- [D&D 5e System](https://github.com/foundryvtt/dnd5e)
- [Module Documentation](docs/)

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/jstapels/heirs-of-their-ways/issues)
- Contact the author directly

---

*Happy adventuring in the world of Heirs of Their Ways!*
