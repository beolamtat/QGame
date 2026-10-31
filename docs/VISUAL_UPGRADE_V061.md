# Coffee World v0.6.1 — Visual Upgrade

## What changed
- Mobile camera now uses orientation-aware reference framing (landscape 950×580, portrait 690×930) with bounded zoom. World coordinates, movement speed and interaction radii are unchanged.
- Four-stage coffee crop atlas replaces multiple shape/text render objects per plot. Stages are `empty`, `seed`, `growing`, `ripe`. A single shared canvas-backed texture holds all frames (384×112 pixels).
- Farm and café backgrounds gained additional details using the existing **single batched Phaser Graphics object per zone**. No additional image downloads are required.
- Playwright records farm, café, portrait and landscape screenshots for review. These are artifacts, **not pixel-diff visual regression baselines**.
- DOM diagnostic attributes on `#game` expose `data-camera-zoom`, `data-viewport`, `data-atlas-frames` and `data-zone` for deterministic automated checks.

## Asset pipeline
1. Generate or paint artwork using a shared art direction: bright handcrafted fantasy, warm earth, pastel green, readable shapes at 360px width.
2. Export each crop stage as transparent 96×112 PNG/WebP, feet anchored at x=48, y≈100.
3. Pack the four frames into a single 384×112 atlas, or a trimmed atlas with JSON metadata.
4. Keep frame names stable: `empty`, `seed`, `growing`, `ripe`.
5. Replace only `registerCoffeeAtlas` implementation with Phaser's loader and atlas JSON. `makeCoffeePlant` and the existing plot state machine need no changes.
6. Keep atlas pages <=2048px for low-end mobile devices. Reuse shared textures; do not create per-plot textures.

## Performance choices
- 12 plots now share one texture and render one sprite each rather than per-plot leaf/fruit/ground shapes.
- The static environment is drawn by one Graphics object per scene; all decoration is batched rather than animated individually.
- Texture creation is guarded with `textures.exists` so scene switches reuse the same atlas.
- No new continuous animation timers; crop frame only changes when growth state changes.
- Camera zoom is clamped to avoid extreme mobile zoom.

## Quality gates
- `npm test` and `npm run build`.
- `npm run test:e2e` on desktop Chromium, mobile Chromium and mobile WebKit.
- Review screenshots from the Playwright report on GitHub Actions.
- Still needed: physical-device GPU FPS, thermal/battery profiling, tap comfort and human art review. No claim of production-quality hand-painted assets yet.

## Next art milestone
Replace procedural crop atlas with artist-produced WebP frames; then convert the character rig to real 8-direction spritesheets without changing gameplay logic.
