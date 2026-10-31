# v0.6.8 — Binary WebP Art Pipeline & Mobile Review

## Shipped
- Four **actual binary WebP files** committed using the GitHub Git Blob/Tree API (no Base64 in JavaScript): `public/assets/hero-v068.webp`, `props-v068.webp`, `farm-v068.webp`, `cafe-v068.webp`.
- Hero: 24 frames (8 directions × 3 poses), 40×56 each, 960×56 total, 238 bytes.
- Props: 6 frames, 48×56 each, 288×56 total, 468 bytes.
- Farm and café review plates: each 800×500, 1090 and 1190 bytes.
- **Total compressed binary size: 2986 bytes**. All images are lossless WebP; browser decode and RIFF/WEBP headers verified in Playwright.
- Phaser preload registers named frames on the binary textures; hero and props are scaled ×2, backgrounds stretched to the original 1600×1000 world, preserving gameplay hit areas and world coordinates.
- Existing Canvas2D illustrated art remains the default. The binary replacement is available at **`/?art=webp`** for screenshot comparison. This is intentional: the new ultra-small placeholder plates are not artist-approved and would visibly downgrade the existing artwork if enabled globally.
- E2E checks both art paths, binary file sizes, decoded dimensions, frame counts, browser screenshots, and scene transitions.

## Important honesty and limitations
These are **functional compressed binary assets, not high-quality production artwork**. They use simplified shapes and repeated placeholder character frames; they do not yet demonstrate eight visually distinct facing directions or distinct walking poses. The 800×500 background plates are half-resolution and will look softer than the 1600×1000 Canvas2D illustrations. Therefore the current illustrated art stays default until the user approves a real art pack. No gameplay code or save schema was changed.

**Mobile GPU memory**: compressed network sizes do not represent decoded texture memory. At RGBA8, the two 800×500 plates consume ~3.2 MB together; hero ~215 KB, props ~65 KB, excluding driver overhead. The original full-size backgrounds are still cached when default mode is used.

## Next sprint requiring approval
**v0.6.9 — Artist-Quality Art Pack & Visual Signoff.** Produce or source professionally art-directed hero sprites with 24 visibly distinct frames, unique six prop designs, and crisp 1600×1000 environment artwork; enforce screenshot visual signoff and real-device performance before switching default to WebP. Do not merge main without approval.
