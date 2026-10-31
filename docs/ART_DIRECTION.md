# Coffee World — Art Direction v0.2

## Visual language
- **Camera:** 2D top-down three-quarter view, fixed angle, no isometric diamond grid.
- **Style:** colorful hand-painted Chinese fantasy cartoon, cozy coffee-growing world.
- **Palette:** jade green #3D9561, warm cream #F3D7AA, coffee brown #79543E, cherry red #A9574E, gold #E8C67E.
- **Rendering:** environment layers behind characters; y-sorted interactive objects; separate HUD.
- **Mobile:** landscape first, clear silhouettes and generous touch targets.

## Current phase-2 implementation
- Illustrated procedural farm environment: planting beds, workshop roof, paths, fence, pond, flowers.
- Illustrated procedural café environment: warm tiled floor, windows, coffee machines, furniture and plants.
- Fantasy-inspired HUD skin, character hat, idle breathing tween.
- No downloaded third-party artwork; all graphics are authored in code.

## Production asset pipeline (not yet implemented)
1. Draw individual orthographic/top-down 3/4 sprites for ground, walls, crops, furniture, characters.
2. Export transparent PNG or WebP and package in atlases.
3. Standardize character pivot at feet; 4/8-direction walk, harvest, brew, serve.
4. Build Tiled map with collisions, navigation and occlusion layers.
5. Replace procedural art progressively without changing gameplay data.
6. Profile draw calls, memory and frame time on real mid-range phones.

## Acceptance criteria for final visual pass
- Same camera/projection across farm and café.
- Character sprite never clipped by props; correct depth sorting.
- Readable HUD on 16:9 and 19.5:9 landscape.
- No background-only gameplay or fake interactions.
- Stable 60 FPS target, subject to device profiling.

**Status:** Procedural visual upgrade committed; not equivalent to final mockup art. Build and on-device QA are still pending.
