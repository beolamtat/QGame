# Coffee World v0.5 — QA and stabilization

## Automated tests
Run:
```sh
npm install
npm test
npm run build
```
GitHub Actions executes tests before TypeScript/Vite production build. Test cases cover:
- Harvest once, plant, water, ripen on schedule.
- Roast and brew ingredient accounting.
- Reject wrong drink and expired order, prevent double service.
- Upgrade/restock pricing and order cap.
- Country unlock and branch purchase idempotency.
- Shipment delivery timer, single claim and duplicate prevention.
- Offline income cap and branch level cap.
- Recovery of the starter branch from malformed save data.

## Fixes included
- Persistent drink inventory normalized to recipe-specific prepared drinks.
- Browser storage failures no longer crash save attempts.
- Background Phaser input blocked while the world-map modal is open.
- Customer animation tweens cleaned when customers are recreated.
- Growth completion persisted.
- Starter branch upgrades cost coins; branch income capped at 10 minutes per collection.
- Shipment and order identity checks tightened.

## Manual mobile QA (NOT YET VERIFIED)
1. Open on Android Chrome and iPhone Safari in landscape.
2. Tap every farm plot, verify move-and-interact and that controls don't obscure targets.
3. Harvest, roast, brew and deliver the matching recipe; verify resource totals.
4. Switch farm/café while walking and during brewing; verify no ghost action.
5. Open map while player moves; verify player stops and tapping map never moves character.
6. Unlock a country, build a branch, send and claim shipment once.
7. Reload during crop growth and shipment; verify remaining time and saved state.
8. Background/foreground the browser; verify NPC timers and no crashes.
9. Test at 360x740, 390x844, 844x390 and desktop 1280x720.
10. Profile frame time and memory on a mid-range phone; target stable 30+ FPS.

## Release gate
- Automated tests pass.
- TypeScript and production build pass.
- Manual mobile QA complete on at least one Android and one iOS device.
- No known economy duplication or blocking progression bug.
- No merge to main until these gates are met.

**Note:** Automated logic tests do not simulate Phaser rendering or real touch events. The app still requires manual device/browser testing.
