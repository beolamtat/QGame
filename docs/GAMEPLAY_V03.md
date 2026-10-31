# Coffee World — Gameplay v0.3

## Core loop
1. **Farm:** tap an empty plot to plant (3 coins); tap again to water; after 12 seconds it ripens; tap to harvest (+3 green beans).
2. **Roasting:** tap the roaster building or **Rang 3 hạt** to turn 3 green beans into 3 roasted beans.
3. **Café:** switch zones, view active customer orders (up to 4), tap the counter to brew the oldest order.
4. **Serve:** approach the corresponding customer and tap to deliver a prepared drink for coins. Each customer has a 90-second patience timer.
5. **Grow:** buy milk/chocolate restocks (20 coins), upgrade café (100 × current level) for higher revenue and unlock Mocha orders at level 2.

## Recipes
| Drink | Roasted beans | Milk | Chocolate | Base revenue |
| --- | ---: | ---: | ---: | ---: |
| Espresso | 2 | 0 | 0 | 25 |
| Latte | 2 | 1 | 0 | 40 |
| Mocha | 2 | 1 | 1 | 55 |

## Technical design
- `src/game/Economy.ts` owns gameplay state, recipes, growth timers and persistence.
- `src/main.ts` owns player movement, interactions, NPC visual actors and HUD.
- `src/game/WorldArt.ts` owns decorative environment drawing.
- State persists to `localStorage`; active orders reset when reopening the game.
- Tap/click interaction uses an 85-pixel object selection radius; player moves near objects before interacting.
- No server, account, payment or multiplayer system is included.

## Known limitations / QA
- Graphics and characters are placeholders, not production sprite sheets.
- Customers have simple ambient movement and order timers, not obstacle-aware navigation.
- Prepared drinks are currently a shared count, not a recipe-specific inventory. The order being served is not matched to a prepared drink type; this needs fixing before release.
- No real device/browser QA or confirmed production build has been performed.
- Economy balancing, NPC collision, onboarding and accessibility are pending.

## Suggested test path
1. Enter farm → harvest a ripe tree.
2. Roast 3 beans → switch to café.
3. Brew Espresso (or obtain milk for Latte).
4. Serve a customer → verify coins.
5. Return to farm → plant an empty plot, water, wait 12 seconds, harvest.
6. Purchase ingredients, upgrade and reload to verify save persistence.
