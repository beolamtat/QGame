# Coffee World Redesign — Phases 1–4

## Design target
Reference supplied by product owner: colorful 2.5D isometric chibi game, ornate parchment/gold HUD, mobile-first, farm/café/town/world map, xianxia reincarnation. Do not copy pixels or assume the reference image is a reusable spritesheet. Keep the previous foundation and main branches unchanged.

## Phase 1 — Foundation and HUD
- Replaced the previous two-button HUD with avatar, level, gold/gems/energy display, quest/daily tabs, quick inventory, side actions, minimap, five-item bottom navigation.
- Responsive portrait/landscape, safe-area insets, touch-first click-to-move, Phaser 4 canvas and DOM overlays.
- Three in-world areas (farm, café, town) and existing global map overlay.
- UI gems/energy are **presentation-only** until their underlying economy is specified; do not represent them as earnable currency.

## Phase 2 — Interactive gameplay
- Reused original Economy.ts and Expansion.ts save keys and transactions: plots, plant/water/harvest, roasting, ingredient restock, recipes, customers, serving, upgrade, global country unlocks/branches/shipments/income.
- Added guided five-step brewing (grind, dose, tamp, extract, finish). This is a tutorial sequence, not a calibrated espresso simulation.
- Town NPC dialogue and merchant, plus cultivation interaction with persistent Qi and realm progression.

## Phase 3 — Story and cultivation
- Three-step prologue: real-world accident, five immortals, mentor Linh Mộc, then farm. Persistent story checkpoint and choice of cultivation/business balance.
- Path choice is recorded but **does not yet affect gameplay stats or dialogue branches**.
- Town visits, Qi practice and six named realms persist in their own versioned save; original economy data untouched.

## Phase 4 — Visual architecture / art placeholder
- Redesigned the scene composition and parchment/gold UI according to the provided visual direction.
- Temporary vector art uses isometric diamond floor, coffee plants, simple chibi characters, buildings, town, café and 2.5D depth sorting.
- **NOT production artwork.** No authored animated sprite atlas or premium farm/café environment has been integrated into this redesign. Visual replacement is a separate asset production effort after user gameplay review.

## Known risks / manual acceptance
- This branch was authored remotely. No reliable build, runtime CI or physical-device verification is claimed unless a passing run is linked.
- Manual check: prologue advance and resume, tap-to-move, each plot stage, roast, café brew five steps, serve order, restock, upgrade, town NPC and cultivation, world map expansion, portrait/landscape HUD, save after reload.
- Economy has real timed growth and expiring orders. Quest panels are descriptive, not yet a full reward/claim system.
- The previous e2e selectors are from the old HUD; they need migration for this redesign. Do not interpret their failure as a gameplay regression without inspecting the new UI.

## User review
Once the build is available, product owner plays and supplies bugs and design feedback. Do not merge to main.
