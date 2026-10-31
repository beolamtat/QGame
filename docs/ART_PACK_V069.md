# v0.6.9 — Native-resolution Art Pack & Visual QA

## Scope
- 24 distinct procedural chibi hero frames: 8 facings × idle, walk A, walk B, with directional face/hair/apron and leg/arm motion.
- Six individually painted props: shrub, flowerpot, coffee sack, crate, lantern, cup; added ink/lighting detail.
- Farm and café illustrations at native 1600×1000 with layered greenery, orchard, roof, café shelves, ceramic details, furniture and ambient lighting.
- Deterministic browser export of Phaser Canvas2D source textures into **actual binary WebP** files under `public/assets/*-v069.webp`.
- Review-only `/?art=v069`: Phaser preloads all four binary textures; frame names, original world coordinates, collision/interaction targets, game economy and save format unchanged.
- The original Canvas2D mode remains the default pending visual approval. `/?art=webp` still reviews v0.6.8 placeholders.
- CI renders files via `node scripts/export-art.mjs`, checks browser WebP decode, dimensions, frame pixel uniqueness, per-asset transfer budgets, captures farm/café screenshots, and stress-tests 40 zone transitions on desktop Chromium, mobile Chromium and mobile WebKit.
- Generated binaries are committed by the CI bot **only after tests pass**, to the existing development branch; never to `main`.

## Important limitations
The pack is **improved hand-coded stylized artwork**, not commissioned or professionally illustrated artwork. Visual approval requires looking at screenshots on real phones; automated browser tests cannot guarantee aesthetic quality. FPS counters and browser tests are not equivalent to profiling on physical low-end Android/iOS devices. Do not claim final production art until visual signoff.

## Next sprint (requires user approval)
**v0.7.0 — Interactive Coffee Brewing Vertical Slice**: preserve current economy but introduce a guided interactive brewing station (grind, dose/tamp, extraction, milk/latte art), touch feedback and short learning notes, instrumented with mobile E2E tests. Only begin after explicit user confirmation.
