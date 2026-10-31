# QGame Coffee World — Visual Art Upgrade v0.6.5

## Delivered
- A cohesive, illustrated **farm scene plate** with aligned planting beds, curved pathways, a pond, meadow details and roasting workshop. Existing 12 plot positions, roaster hit target, player movement and world camera bounds are unchanged.
- A cohesive, illustrated **café scene plate** with warm tiled floor, wood-and-marble bar, espresso stations, seating, pendant lights and decorative menu.
- Two **1600×1000 Canvas2D texture plates**, generated once each, registered in Phaser's shared TextureManager. Switching zones reuses textures; the scene only adds one static Image for the background. No animated background allocations or network asset downloads.
- More detailed crop sprites (soil, leaf veins) and hero sprites (shirt seams, apron, hat highlight), keeping the existing frame names and animations.
- Playwright screenshots for farm, café, mobile portrait and landscape; additional 20-transition texture budget regression.

## Art direction
Warm cozy mobile farming simulation; leafy green, ochre soil, soft golden sunlight, caramel wood, teal water. Static plates are **hand-authored procedural Canvas2D art**, not commissioned/AI-rendered final production PNGs. They are a meaningful visual iteration but not a substitute for artist-authored high-resolution assets.

## Performance and caveats
- Two plates occupy approximately 12.8 MB of uncompressed RGBA texture data in total (1600×1000×4×2), excluding mipmaps/overhead; only one is rendered per scene, both remain registered for fast transitions.
- Crop, hero, prop and label atlases are shared and cached.
- This release does **not** certify physical-device FPS, memory, battery use or visual quality. Review Playwright screenshots before approving a production art direction.
- Existing economy, save schema, world-map, movement and interaction rules are unchanged.

## Release gate
`npm test`, `npm run build`, `npm run test:e2e` in desktop Chromium, mobile Chromium and mobile WebKit. Do not merge `main` without user approval.

## Proposed next sprint — v0.6.6 (approval required)
Art QA and device polish: inspect actual screenshots on representative mobile screen sizes, refine camera framing and HUD occlusion, then export and substitute external compressed WebP assets if their quality and GPU memory are demonstrably better. Follow with physical-device FPS profiling before gameplay expansion.
