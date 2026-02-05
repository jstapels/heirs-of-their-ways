# AGENTS.md - Project & AI Assistant Guide

Contributor cheat sheet for keeping the Heirs of Their Ways module healthy and ship-ready.

## Project Overview
- **Module ID**: `heirs-of-their-ways`
- **System**: D&D 5e (dnd5e)
- **Foundry Compatibility**: v13+
- **Author**: Jason Stapels (jstapels@gmail.com)
- **Version**: See `module.json`

## Repository Structure
```
heirs-of-their-ways/
├── README.md               # Project overview and user guide
├── module.json             # FoundryVTT module manifest (CRITICAL)
├── AGENTS.md               # This file
├── docs/                   # Documentation
│   ├── ENRICHERS.md         # Text enrichers reference
│   └── WORKFLOW.md          # Development workflow guide
├── src/                     # Markdown source notes
│   ├── README.md            # Campaign notes guide
│   ├── module/              # Module-level content
│   │   ├── actors/          # NPCs and PCs
│   │   ├── items/           # Items and loot
│   │   ├── features/        # Feats/spells/abilities
│   │   ├── journals/        # Lore, locations, DM notes
│   │   ├── scenes/          # Shared scenes/maps
│   │   ├── tables/          # Shared roll tables
│   │   └── assets/          # Module assets (source)
│   └── adventures/          # Adventure-specific content
│       └── <adventure>/     # e.g., fight-the-dragon/
│           ├── overview.md  # Adventure overview (type: adventure)
│           ├── actors/
│           ├── items/
│           ├── features/
│           ├── journals/
│           ├── scenes/
│           ├── tables/
│           └── assets/      # Adventure assets (source)
├── source-data/             # Legacy JSON exports (optional)
├── assets/                  # Built assets (generated)
└── packs/                   # Compendium packs (generated)
    ├── _source/             # YAML sources (generated)
    ├── heirs-actors/
    ├── heirs-items/
    ├── heirs-features/
    ├── heirs-journals/
    ├── heirs-scenes/
    └── heirs-tables/
```

## Critical Files
- `module.json` is the module manifest that Foundry reads. Changes affect how the module loads, what packs exist, and compatibility.

## Documentation References
- `docs/ENRICHERS.md` for FoundryVTT v13 + DnD5e v5.2 enrichers.
- `docs/WORKFLOW.md` for the development workflow and examples.
- `src/README.md` for campaign note conventions.
- `docs/DND5E-YAML-STRUCTURE.md` for DnD5e field references.
- `source-data/README.md` for legacy JSON exports (use sparingly).

## Build System
This module is markdown-first with frontmatter:
- **Sources**: `src/` markdown + frontmatter
- **Assets**: `src/**/assets/` (copied to `assets/` on build)
- **YAML**: `packs/_source/` (generated)
- **LevelDB**: `packs/heirs-*` (generated)

**Key Commands:**
```bash
npm run build              # Markdown → YAML → LevelDB
npm run build:assets       # Copy src assets → assets/
npm run build:yaml         # Markdown → YAML only
npm run build:packs        # YAML → LevelDB
npm run extract:packs      # LevelDB → YAML
npm run clean:packs        # Standardize YAML formatting
npm test                   # Build checks
```

## Compendium Packs
- `heirs-actors` — Actor
- `heirs-items` — Item
- `heirs-features` — Item (feats/spells)
- `heirs-journals` — JournalEntry
- `heirs-scenes` — Scene
- `heirs-tables` — RollTable

## Workflow Notes
- Write markdown in `src/` and keep all document data in frontmatter.
- Avoid inline `foundry-yaml` blocks.
- Use `document:` in frontmatter for top-level fields not otherwise covered.
- Place media in `src/**/assets/` and use relative paths in frontmatter or markdown image links.
- Build outputs (`assets/`, `packs/`) are generated and should not be committed.

## Coding Style & Naming Conventions
- Use 2-space indentation for JSON/YAML.
- Filenames/directories: kebab-case (e.g., `chapter-1-awakening.md`).
- Keep content edits in markdown/frontmatter; avoid hand-editing LevelDB output.
- Include Foundry enrichers directly in markdown when needed.

## Testing Guidelines
- Run `npm run build` before commits.
- Spot-check in FoundryVTT v13+ with dnd5e 5.2: ensure enrichers roll, assets resolve, packs load.
- For Foundry-edited content: `npm run extract:packs`, migrate changes into `src/`, then rebuild.

## Commit & Pull Request Guidelines
- Use focused commit messages describing content/workflow changes.
- Feature branches: prefer `claude/<session-id>`.
- PRs should summarize changes, list build/test commands run, note assets added, include screenshots for scenes/journals when practical.
- Apply GitHub release labels (`version:patch|minor|major`) to drive automated version bumps.

## Release & Versioning Notes
- Follow semantic versioning in `module.json`.
- Generated pack outputs are build artifacts—do not commit them.
- Keep spoilers in appropriate directories and avoid leaking private player info.

## Dungeon Master Assistant Brief
- Role: Act as a D&D 5e (2024) DM assistant for Aevir; help summarize sessions and propose adventures for level 6→7 PCs. VTT: FoundryVTT with dnd5e; use enrichers (https://github.com/foundryvtt/dnd5e/wiki/Enrichers) in checks/saves/rolls.
- Tone/content: Rich, vivid area descriptions with multiple solutions (combat and non-combat). Keep in-character vs out-of-character knowledge separate unless told otherwise.
- NPCs: On first mention, give name, basic stats/skills, brief background, portrait prompt, RP hooks. For hostile NPCs, note key features/equipment; prefer Monster Manual 2025 bases, else include full stats.
- Loot: Sprinkle consumable and permanent magic items in adventures.
- Party: Mishko Wolansk (triton bard), Matiejus “Mats” Torvaldr (harengon monk), Threk Shadowtusk (luxodon paladin), Ilizar Escrinos (human rogue). DM: Jason/Jay.
- Arc focus: Loamvale region; antagonists include Lord Varrick and Lucien Darkwood.
