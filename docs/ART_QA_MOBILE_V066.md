# QGame v0.6.6 — Art QA & Mobile Polish

## Scope and implementation
- Camera zoom adapts to viewport and orientation without enforcing the old 0.38 minimum on tiny screens; world bounds, player follow, collision targets and gameplay world coordinates are unchanged.
- Diagnostic attributes `data-camera-visible-world` and `data-camera-mode` support reproducible screenshot QA.
- HUD safe-area insets, compact stats, multi-line helper text, responsive controls and touch targets are improved for portrait and landscape phones.
- Toasts wrap on narrow displays. Order panel uses viewport-aware max height and does not trap scrolling.
- Screenshot regression captures 320×568, 390×844 and 844×390 viewport layouts, and asserts HUD fits within horizontal viewport and does not overlap top/bottom zones.
- Existing farm/café scene screenshots, 40-transition texture stress test and gameplay regression remain enabled.

## QA notes
Screenshots are attached to the Playwright HTML report, not automatically pixel-diff approved snapshots. The automated checks verify layout bounds and gameplay actions; artistic quality still needs visual human review. Physical phone FPS, GPU memory, thermal throttling and battery are not covered by browser emulation.

## Acceptance criteria
- Typecheck, unit tests and production build pass.
- Playwright desktop Chromium, mobile Chromium and mobile WebKit pass.
- No gameplay logic or save schema changes.
- No merge to `main`.

## Proposed next sprint — v0.6.7 (requires user approval)
Production asset pipeline: define artist-approved visual reference frames, add compressed WebP sprite atlases for hero/crops/props, enforce texture size budgets, and review actual iOS/Android performance. Preserve frame contracts and gameplay.
