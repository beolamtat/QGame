# Coffee World v0.6 — Animated Gameplay Pass

## Scope implemented
- Reusable eight-direction character rig (N, NE, E, SE, S, SW, W, NW).
- Direction-aware walk cycles with leg/arm swing, gentle idle breathing and interaction pose.
- Lightweight transient particles for planting, watering, harvesting, roasting, brewing and serving.
- Floating reward numbers and timed brewing progress indicator.
- All effects use Phaser display objects and tweens; no large textures or external asset downloads.

## Current art status
**This is an animation foundation using procedural Phaser shapes, not production sprite artwork.** The characters are direction-aware but not yet true hand-drawn frame-by-frame 8-direction sprites. Production art remains a separate milestone.

## Asset contract for later sprite atlases
Use one atlas per character archetype with the following animations:
- `idle_{n,ne,e,se,s,sw,w,nw}` at 6–8 FPS.
- `walk_{n,ne,e,se,s,sw,w,nw}` at 10–12 FPS.
- `harvest_{direction}`, `water_{direction}`, `brew_{direction}` at 8–12 FPS.
- Nominal cell size 96×128 px, trimmed atlas, pivot at feet, consistent collision radius.
- Prefer WebP atlas pages under 2048×2048 for mobile, with texture compression where supported.

The gameplay layer owns movement and interactions. `CharacterAnimation.ts` owns pose and facing; `InteractionFX.ts` owns visual feedback. Replace only rendering functions when real sprite atlases are ready.

## Mobile QA
- Walk in eight directions and verify consistent facing.
- Confirm tap-to-move reaches farm plots, café counter and customers.
- Confirm no player input behind the world-map overlay.
- Verify harvest particles do not persist after completion.
- Verify brewing progress finishes exactly once and no ingredient duplication occurs.
- Monitor FPS and memory on mid-range Android and iOS devices.

## Release gates
Run `npm test` and `npm run build`. Device/browser QA is still required; CI cannot validate visual quality, touch feel or GPU performance.
