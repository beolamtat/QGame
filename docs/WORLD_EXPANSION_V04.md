# Coffee World v0.4 — World Expansion MVP

## What's playable
Open **🌏 Bản đồ** from the farm or café HUD. The illustrated map is a stylized navigation view, **not a geographically accurate political map**.

Six destinations are available as a progression prototype:
- 🇻🇳 Việt Nam: starter country with a free level-1 branch.
- 🇨🇳 Trung Quốc: unlock 180 coins; build branch 120.
- 🇯🇵 Nhật Bản: unlock 350; build branch 200.
- 🇧🇷 Brazil: unlock 550; build branch 300.
- 🇫🇷 Pháp: unlock 750; build branch 400.
- 🇺🇸 Hoa Kỳ: unlock 1000; build branch 550.

## Gameplay rules
1. Earn coins by serving café orders.
2. Unlock a destination, then build its branch.
3. Collect branch income after at least one minute; at most ten minutes accrue per collection.
4. Upgrade branches (max level 5) to multiply income.
5. Roast green coffee beans in the farm; send **5 roasted beans** to a foreign branch.
6. Wait 30 seconds, then manually claim shipment revenue.
7. Only one unclaimed shipment per country is allowed.

World expansion progress is saved separately in localStorage key `coffee-world-expansion-v01`. Coins and roasted beans are shared with the main game save. No network sync is implemented.

## Explicit limitations
- Six destinations are **fictional gameplay nodes on an abstract map**, not full country borders.
- No separate playable farm/café scene for each country yet.
- Shipping uses a timer, not a vehicle pathfinding simulation.
- Branch income is manual collection and not a server-side economy.
- Do not interpret country marker positions as geographic accuracy.
- Full mobile touch testing, browser runtime QA and performance profiling are pending.

## QA checklist
- Unlock fails if coins are insufficient and does not subtract funds.
- Branch construction requires unlocking and charges once.
- Shipping requires 5 roasted beans, consumes exactly 5, blocks duplicate shipments.
- Shipping can be claimed only after 30 seconds, only once.
- Income can be collected only after a full minute; capped at ten accrued minutes.
- Reload preserves unlocks, branches and pending shipment timers.
- Map closes via the close button and backdrop.
- Farm and café remain playable after opening/closing the map.
- CI build and mobile landscape viewport pass.
