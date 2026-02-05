# Source Data (Legacy)

This directory is reserved for legacy JSON exports from FoundryVTT. The current workflow for this project is **markdown → YAML → packs**.

## Current Recommendation

- Prefer `src/` (markdown + frontmatter) and generated packs.
- Use `npm run extract:packs` if you edit content in Foundry.
- Use JSON exports only as a last resort or for migration between worlds.

If you need JSON exports, keep them clearly labeled and treat them as temporary artifacts.
