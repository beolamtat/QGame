# Coffee World v0.6.3 — Environment asset and mobile performance pass

## Delivered
- Six-frame shared props atlas: shrub, flowerpot, coffee sack, crate, lantern and coffee cup.
- Consistent illustrated palette across farm and café, with decorative texture sprites sharing one 576×112 canvas texture.
- Refined farm path highlights and pond reflections. Removed duplicate Graphics potted plants in café in favor of atlas sprites.
- Existing crop and hero atlases, gameplay, save format, interaction coordinates and camera behavior remain unchanged.
- Read-only diagnostics exposed on `#game`: `data-fps-estimate`, `data-display-objects`, `data-texture-count`, `data-prop-atlas-frames`. FPS is a rough frame-loop estimate **not GPU frame time**.
- E2E checks scene-switch memory stability, object-count ceilings, texture-count ceilings and captures farm/café screenshots.

## Performance policy
- All six props share a single texture, registered once in Phaser's TextureManager.
- Decorative props are static, no timers/tweens per prop.
- `WorldArt` keeps a single Graphics display object per scene.
- Do not allocate new textures on scene transitions.
- Capture actual FPS, dropped frames, GPU memory and thermal behavior on physical devices before claiming 60 FPS.

## Artwork handoff
The current sprites are self-contained Canvas2D illustrations rather than external AI-generated assets. To replace them with polished artwork:
1. Export each prop at 96×112 px transparent, anchored at bottom-center.
2. Pack frames into a single WebP/PNG atlas with names matching `PROP_FRAMES`.
3. Replace `registerPropAtlas` implementation with `scene.load.atlas` or compatible spritesheet loading.
4. Preserve world positions, object depths and gameplay hit targets.
5. Review screenshots in GitHub Actions artifacts on both portrait and landscape viewports.

## Release gate
`npm test`, `npm run build`, `npm run test:e2e` on Chromium desktop/mobile and WebKit mobile. This is functional regression coverage, **not** a pixel-diff or physical-device performance certification.
