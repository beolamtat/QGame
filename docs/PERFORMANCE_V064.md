# Coffee World v0.6.4 — Performance & Memory Optimization

## Scope
No changes to the economy, player movement, crop growth timings, order rules, save schema, or world-map unlocks.

## Changes
- Added a **shared label texture atlas** for four plot states and three recipe nameplates. Previously every plot and customer created a Phaser.Text canvas, generating textures that could accumulate after scene rebuilds.
- Plot labels now use one Image frame each and only change frame when crop state changes; no text rasterization on the 500ms growth check.
- Customer recipe labels reuse the same atlas rather than generating a new text canvas for each order.
- NPC eyes now use vector shapes instead of a text glyph canvas.
- Explicitly clear references to plot-stage tracking when rebuilding a zone.
- Added a **40-transition Playwright stress test** (20 round trips), with sampled texture counts at 10/20/30/40 transitions and JS error capture. Existing functional regression tests remain in CI.

## Measurement and caveats
- `data-texture-count` reports Phaser TextureManager entries, **not GPU memory bytes**.
- `data-fps-estimate` measures game-loop frames / accumulated delta, **not GPU frame time**.
- Tests execute on Playwright Chromium desktop/mobile and mobile WebKit; they do not measure physical phone heat, battery, frame pacing, or sustained GPU load.
- A strict texture plateau is the desired gate; if tests detect growth, investigate ownership and lifecycle instead of simply increasing thresholds.

## Acceptance gates
1. `npm test` passes.
2. `npm run build` passes.
3. `npm run test:e2e` passes across three browser profiles.
4. 40 scene transitions do not exhibit continuing texture-count growth and no JS page errors.
5. No merge into `main` until user approval.

## Next sprint proposal (requires user approval)
v0.6.5 — Visual Art Upgrade: replace procedural placeholder art with consistent authored WebP spritesheets for hero, crops, and environment, while preserving atlas contracts and keeping mobile texture budgets.
