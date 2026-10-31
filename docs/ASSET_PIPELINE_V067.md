# Coffee World v0.6.7 — Production Asset Pipeline (first integration)

## Implemented
- Added an actual **lossless WebP crop spritesheet**, 384×112, four frames of 96×112, 816 compressed bytes.
- Kept the exact `empty`, `seed`, `growing`, `ripe` frame contracts and world coordinates.
- Preload WebP once through Phaser's image loader; `registerCoffeeAtlas` adds the same frame names to the decoded texture. The old Canvas2D renderer remains as a fallback when the preloaded texture is missing.
- Instrumented `data-asset-format`, `data-crop-webp-bytes`, and the existing texture counters.
- Added E2E tests for WebP decode and repeated zone transitions across Chromium desktop, Chromium mobile and WebKit mobile.

## Important limitations
This sprint delivers **one functional WebP proof-of-integration for crops**, not a complete commercial-quality hero, props and environment art replacement. The initial spritesheet is a simple illustrated placeholder, not artist-approved final art. Existing hero, props and environment remain Canvas2D textures.

The connected GitHub file writer only accepts UTF-8. For this reason the compressed WebP bytes are embedded as a Base64 data URI in `src/assets/cropWebp.ts` rather than stored as a standalone binary file. This avoids runtime canvas rasterization for crops but increases JavaScript transfer size and is **not** the ideal production delivery format. A future GitHub binary upload route should migrate the atlas to `public/assets/*.webp`.

## Asset acceptance gates
- Crop WebP: 384×112, four 96×112 frames, 816 compressed bytes.
- Crop atlas must register all four named frames without changing gameplay.
- No texture growth on repeated farm/café transitions.
- Existing unit, build and E2E checks must pass.

## Next sprint proposal (requires approval)
**v0.6.8 — Complete binary art pipeline & visual review.** Establish binary asset upload and build-time validation, replace hero (24 frames), props (6 frames) and environment plates with art-directed compressed files; approve visual reference screenshots and profile physical Android/iOS devices. Do not label these assets production-ready without visual acceptance.
