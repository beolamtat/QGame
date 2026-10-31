# Visual Upgrade v0.6.2 — Character spritesheet

The hero now renders as a single sprite with a shared, deterministic **1920×112** texture containing 24 named frames (8 compass directions × idle / two walking poses). Movement, tap-to-interact, action timing, orders and economy are unchanged.

## Art handoff contract
- Frame dimensions: **80×112**, transparent background.
- Frame order: `n-0`, `n-1`, `n-2`, `ne-0` ... `nw-2`.
- Feet aligned near y=100; the sprite is anchored at `(.5,.9)`.
- `0` idle, `1` and `2` alternating walking frames.
- Keep the same silhouette, hat and apron in all directions.
- Source asset must be exportable as a single atlas and independently previewable.

## Technical implementation
- `HeroAtlas.ts` draws initial artwork to a canvas atlas and registers 24 Phaser texture frames once.
- `CharacterAnimation.ts` selects a frame based on the existing eight-direction movement vector.
- Frame changes only on animation transitions; there are no per-frame canvas redraws.
- Character display tree shrinks to a single sprite in one container.
- Playwright captures a movement screenshot and checks atlas persistence across zone switching and reload.

## Remaining art/performance work
The generated artwork is still stylized placeholder art, **not commissioned illustration**. To replace it with production sprites, retain frame names and use `scene.load.atlas` or a prepacked spritesheet instead of the procedural registration function. Check device FPS and texture memory on physical Android/iOS devices before making performance claims.
