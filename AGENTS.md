# Repository Guidelines

Contributor cheat sheet for keeping the Heirs of Their Ways module healthy and ship-ready.

## Project Structure & Module Organization
- Core sources live in `packs/_source/heirs-pack/` (YAML actors/items/journals/scenes/tables); compiled LevelDB output goes to `packs/heirs-pack/` (generated).
- Campaign drafting happens in `campaign-notes/` markdown; journals are built from these files.
- Build utilities are in `utils/` (e.g., `build-yaml.mjs`, `packs.mjs`); documentation in `docs/`; assets in `assets/`; legacy JSON exports in `source-data/`.
- `module.json` is critical for Foundry metadata—coordinate changes and keep paths consistent.

## Build, Test, and Development Commands
- `npm run build` — Build journals then packs (full build).
- `npm run build:journals` — Convert `campaign-notes/` markdown to journal YAML.
- `npm run build:packs` — Compile YAML sources to LevelDB compendium; use `-- heirs-pack` to scope.
- `npm run extract:packs` — Extract LevelDB packs back to YAML when editing Foundry-first changes.
- `npm run clean:packs` — Normalize YAML formatting.
- `npm run build:release` — Build packs and create the distributable zip/manifest.

## Coding Style & Naming Conventions
- Use 2-space indentation for JSON/YAML; prefer readable inline comments in YAML where helpful.
- Filenames/directories: kebab-case (e.g., `chapter-1-awakening.md`, `flaming-sword.yaml`).
- Keep content edits in YAML/markdown; avoid hand-editing LevelDB output.
- When writing notes, include Foundry enrichers directly (see `docs/ENRICHERS.md`) to keep builds faithful.

## Testing Guidelines
- Run `npm run build` before commits; it validates markdown → YAML → packs.
- Spot-check in FoundryVTT v13+ with the dnd5e 5.2 system: ensure enrichers roll, assets resolve, packs load.
- For Foundry-edited content, `npm run extract:packs` then rebuild to confirm clean diffs.

## Commit & Pull Request Guidelines
- Write focused commit messages describing content or workflow changes (e.g., “Add Coral Veil NPCs to heirs-pack”).
- Feature branches typically use `claude/<session-id>`; avoid pushing directly to `main`.
- PRs should summarize changes, list build/test commands run, note any asset additions, and include screenshots for scenes/journals when practical.
- Apply GitHub release labels (`version:patch|minor|major`) to drive automated version bumps; bump scripts (`npm run version:*`) if adjusting manually.

## Release & Versioning Notes
- Follow semantic versioning in `module.json`; coordinate any compatibility changes.
- Generated pack outputs may be large—commit only necessary build artifacts and keep assets optimized.
- Keep campaign-sensitive spoilers in appropriate directories and avoid leaking private player info.

## Dungeon Master Assistant Brief
- Role: Act as a D&D 5e (2024) DM assistant for Aevir; help summarize sessions and propose adventures for level 6→7 PCs. VTT: FoundryVTT with dnd5e; use enrichers (https://github.com/foundryvtt/dnd5e/wiki/Enrichers) in checks/saves/rolls.
- Tone/content: Rich, vivid area descriptions with multiple solutions (combat and non-combat). Keep in-character vs out-of-character knowledge separate unless told otherwise.
- NPCs: On first mention, give name, basic stats/skills, brief background, portrait prompt, RP hooks. For hostile NPCs, note key features/equipment; prefer Monster Manual 2025 bases, else include full stats.
- Loot: Sprinkle consumable and permanent magic items in adventures.
- Party: Mishko Wolansk (triton bard), Matiejus “Mats” Torvaldr (harengon monk), Threk Shadowtusk (luxodon paladin), Ilizar Escrinos (human rogue). DM: Jason/Jay.
- Arc focus: Loamvale region; antagonists include Lord Varrick and Lucien Darkwood.
