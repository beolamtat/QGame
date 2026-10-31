# COFFEE WORLD – TU TIÊN CÀ PHÊ

> **Bản tiếng Việt đầy đủ / Full Vietnamese translation:** [COFFEE_WORLD_MASTER_GDD_V2_VI.md](./COFFEE_WORLD_MASTER_GDD_V2_VI.md)

## MASTER GAME DESIGN DOCUMENT (GDD) v2.0 — GAMEPLAY-FIRST
Status: PROPOSED FOR PRODUCT REVIEW, not implemented. Date: 2026-11-01.
Branch: `feat/coffee-world-redesign`. Do not merge main without explicit approval.

### 0. Product contract
- Mobile-first H5 game, Phaser 4 + TypeScript + Vite. Landscape and portrait supported.
- Visual reference: polished, colorful, hand-painted Asian fantasy chibi 2.5D isometric, ornate gold/parchment HUD; visually consistent between scenes. Reference image is NOT a spritesheet.
- 70% coffee craft/farming/business; 30% reincarnation/cultivation fantasy. Real recipes are distinguished from fictional fantasy drinks.
- Tap/click ground to move, tap objects to approach and interact. No mandatory joystick; no step-by-step click-through disguised as gameplay.
- Brewing is a **playable instrument simulation**: every physical operation maps to player gesture, real-time audiovisual feedback, state change, error and recoverability.
- No placeholder economy values presented as live, no hard-coded fake gem/energy rewards, no browser alert(), no forced pay-to-win.
- Current code has a guided 5-step brewing modal; it is a **prototype to replace**, not an accepted implementation. Preserve save compatibility.

### 1. Experience pillars
1. Learn by doing: authentic equipment, measurable ratios and reasons; no magic "make coffee" button in learning mode.
2. Skill mastery: gestures improve with practice, manual extraction results depend on grind, dose, yield and workflow.
3. Farm-to-cup: seed → growth → harvest → processing → roast → brew → serve → payment → reinvest.
4. Living world: walkable farm, café, town, NPCs, quests, cultivation, regions and branches.
5. Mobile usability: touch targets >=44 CSS px, safe-area insets, adaptive HUD, no critical interactions obscured by chrome.

### 2. Complete screen inventory (24 primary/feature screens + 15 reusable overlays)
Navigation: Opening → Immortal Council → Character/Mentor → Farm ↔ Café ↔ Town ↔ World; Brew Academy and Brewing Workbench are entered from Café; Cultivation, Construction, Management and Character are overlays or dedicated scenes as specified.

| ID | Screen | UI / key widgets | Gameplay / exit |
|---|---|---|---|
| S00 | Boot / preload | Logo, progress, tips, mute, retry offline | Asset streaming, save migration; enter S01 or resume |
| S01 | Modern world prologue | Dialogue, skip, accessibility, tap guidance | Walk city, scripted accident and ambulance, transition |
| S02 | Five Immortals | Five NPC pedestals, dialogue, choice cards, compare, confirm | Talk to each, choose boon; no unskippable long cinematic |
| S03 | Rebirth & Mentor | Avatar customization, name, mentor dialogue, first quest | Create avatar, learn movement, get first plot |
| S04 | Farm | Shared HUD, minimap, quests, quick tools, contextual action, buildings | Walk, sow, water, harvest, store, roast, construct |
| S05 | Café interior | Shared HUD, order queue, customer bubbles, table status, machine hotspots | Walk, receive order, brew, serve, clean, collect payment |
| S06 | Town | Shared HUD, NPC markers, merchant, quest cues, local map | Talk, trade, accept quests, practice cultivation |
| S07 | World map | Pan/zoom, country pins, unlock cards, branch cards, travel confirm | Open regions and branches, view shipping routes |
| S08 | Coffee Academy | Course categories, mastery stars, progress, unlocks, mentor | Choose lesson or practice |
| S09 | Recipe Codex | Search/filter, recipe cards, method tabs, favorite, compare | Browse ingredients, tools, ratios, learn |
| S10 | Recipe Detail | Real-world notes, dose/yield, temperature, steps, common faults, equipment | Start tutorial / practice / order |
| S11 | Equipment Station | 3D/2.5D workstation, draggable gear, equipment condition, setup slots | Choose tools, clean/setup; enter brewing |
| S12 | Brewing Workbench | Large machine and props, hand interaction, live scale/timer, contextual coach | Perform all physical gestures; save actual brew metrics |
| S13 | Brew Evaluation | Score, tasting model, extraction chart, mistake timeline, next adjustment | Retry, save recipe variation, serve |
| S14 | Recipe Lab | Adjustable ingredients, saved variants, A/B comparison, naming | Experiment, save version, unlock signature drinks |
| S15 | Processing Shed | Cherry sorting, pulping/washing/drying, inventory batch, moisture stage | Turn cherries into green beans, quality tracked |
| S16 | Roastery | Roaster machine, heat/air controls, roast curve, first crack cues, cooling | Turn green beans into roast batch, track roast profile |
| S17 | Build / Decorate | Category palette, ghost preview, rotation, valid grid, cost, undo | Place/upgrade farm and café objects |
| S18 | Staff & Operations | Roster, assignments, shifts, wages, automation policy | Hire, train, delegate mastered recipes |
| S19 | Empire Dashboard | Profit/loss, inventory, shipping, branch KPI, upgrades | Manage multiple cafés and supply chains |
| S20 | Cultivation | Qi, realms, skill tree, consumables, breakthrough | Buff crop growth, stamina or craft quality with caps |
| S21 | Character / Wardrobe | Avatar, outfits, titles, XP, mastery, achievements | Customize appearance, view progression |
| S22 | Quests / Journal | Main, side, daily, tracked, claimable, story log | Track, claim, navigate to objectives |
| S23 | Challenge / Tournament | Rules, recipe requirements, score rubric, rank, rewards | Timed specialty coffee challenges; endgame progression |

Reusable overlays (15):
O01 Global HUD; O02 Pause/Settings; O03 Inventory; O04 NPC Dialogue; O05 Context Interaction; O06 Crop Detail; O07 Customer Order; O08 Equipment Tooltip; O09 Ingredient Detail; O10 Lesson Coach; O11 Error & Recovery; O12 Reward/Receipt; O13 Unlock/Confirmation; O14 Tutorial Accessibility; O15 Save/Sync/Error.
Overlays must not spawn independent scene worlds or obscure gestures.

### 3. Shared HUD specification
Landscape:
- top-left avatar/name/level/XP; top-middle real gold/gems/stamina; top-right mini-map + inbox + settings.
- left collapsible quest tracker; right collapsible 3–5 contextual actions; bottom quick tools and navigation dock.
- central gameplay clear, no fixed joystick; show contextual action only when near interactable.
Portrait:
- compact avatar and currency top, mini-map icon; quest tracker collapsed to chip; side actions collapse to radial/overflow; quickbar and nav become 1–2 rows with safe-area padding.
- Camera framing must keep selected character/interactive station visible above bottom overlays; pan/zoom and follow smoothing; avoid HUD overlaps.
Brewing station: hide world navigation, use minimal station-specific HUD (recipe, scale, timer, back/pause, coach). Allow two-finger zoom/pan only when not dragging tool.
Every button: idle/pressed/disabled/locked/loading/feedback states. Fonts remain legible at 360 CSS px viewport; honor reduced motion.

### 4. Brewing modes
A. LEARN: mentor demonstrates, one gesture at a time, tooltips explain cause/effect; can retry without losing scarce ingredients during initial tutorials.
B. PRACTICE: no forced order, adjustable settings, contextual hints, consumes practice stock or virtual sandbox stock; score and mistakes.
C. SERVICE: customer order, limited patience, actual inventory and equipment, must prepare drink and hand it off; quality affects tips and reputation.
D. EXPERIMENT: freeform ratios, save custom recipes and compare results.
Unlock progression: learn → demonstrate competence → practice mastery → service → staff automation. Automation never replaces initial hands-on learning.

### 5. Interaction grammar: each step is a mini-game
Every action specifies: gesture, scene object, live signal, success band, failure modes, recovery, accessibility alternative.
- Drag: move beans to grinder hopper, portafilter to grinder/machine, cup under grouphead, pitcher to steam wand.
- Hold: grind button, steam lever, tamp pressure, pouring water; provide haptic where available and visible analog.
- Swipe/rotate: turn grinder adjustment ring, distribute grounds with WDT, lock portafilter, stir, swirl.
- Trace: gooseneck pour path and latte-art strokes; support coarse assisted gestures on small screens.
- Timing: stop shot at target mass, start/stop steam, pour blooming and pulses.
- Precision: dosing scale, fill line, brew temperature and water quantity.
- Rhythm: gentle tapping, bloom waiting, controlled pouring; avoid punishing motor disabilities.
All operations must animate object movement, play appropriate SFX, update state in real time and show corrective feedback. **No "Next" button that advances a brewing action without performing it.**
Accessibility: tap-to-select then tap destination alternative to drag; hold-to-auto-fill; adjustable sensitivity, slow practice, subtitles and visual cues; no single mandatory fine-motor gesture.

### 6. Espresso hands-on session: detailed state machine
START_ORDER → CHOOSE_BEANS → WEIGH_BEANS → SET_GRIND → GRIND → DOSE_BASKET → DISTRIBUTE → TAMP → PURGE_GROUP → LOCK_PORTAFILTER → PLACE_CUP_SCALE → EXTRACT → STOP_AT_TARGET → EVALUATE → SERVE/CLEAN.
Step contracts:
1. Choose beans: tap bag, inspect origin/roast/freshness; selection influences extraction model.
2. Weigh: drag beans onto scale; tap/hold to add or remove, target 18g reference ±0.3g.
3. Grind: rotate grinder collar; choose fine/medium/coarse continuous setting; grind hold until dose reached; grinder retains setting.
4. Dose: drag portafilter to chute, distribute grounds; uneven distribution increases channeling risk.
5. WDT: trace circular motion to distribute; optional for easier levels but improves consistency.
6. Tamp: vertical press with pressure meter; reward levelness/consistency, not an arbitrary single force threshold.
7. Purge: short water flush, visual steam; optional station habit.
8. Lock: drag/rotate portafilter to grouphead; snap animation and confirmation.
9. Cup/scale: place cup on scale, tare, check readiness.
10. Extract: tap brew switch, observe flow, mass and timer continuously; stop by tap when target output reached.
11. Evaluate: compare dose, beverage mass, shot time, extraction balance proxy; tasting feedback and one actionable next adjustment.
12. Serve: carry cup to customer; clean station and reset tool state.
Reference exercise: 18g in, 36g out (1:2), ~25–30 seconds, ~90–96°C; *starting range*, not universal correctness. Espresso output measured in grams; water temperature and pressure depend on machine.
Simulation: `flowRate = f(grind, dose, puckPrep, beanRoast, machine)`; yield integrates flow over time. Time is an OUTPUT, never independently slider-controlled in service. Channeling introduces flow variance. Taste quality is heuristic, not lab-validated sensory prediction.
Errors: coarse grind → faster flow, under-extraction tendency; overly fine → slow/choked; uneven prep → channeling; too long/short yield → altered balance. Provide non-deterministic but bounded variability, never pretend real-world physics accuracy.

### 7. Phin Vietnamese coffee session
Tools: phin body/filter/press/lid, grinder, kettle, scale, cup, condensed milk, ice.
Gameplay states: CHOOSE_BEANS → GRIND → DOSE → LEVEL → PLACE_PRESS → ADD_CONDENSED_MILK (if ordered) → BLOOM → WAIT → POUR → DRIP → REMOVE_PHIN → STIR → ADD_ICE → SERVE.
- Tap and drag phin parts in correct order; rotate filter plate gently (design depends on phin).
- Pour water by hold/drag kettle; weight meter and flow feedback; blooming wait with visual expansion; timer continues.
- Flow speed depends on grind, dose, filter compression and pour; not a pre-scripted timer.
- Optional condensed milk measure by mass and stir mini-game; ice affects dilution.
- Reference start: 20–25g coffee, 80–120g water, ~20–35g condensed milk for sữa đá, adjust by roast and preference. These are recipe examples, not immutable standards.
- Assess drip, strength, sweetness, dilution and customer preference.

### 8. Method-specific mini-games (not reusing one generic animation)
- V60: grind medium, wet filter, tare, bloom 30–45s, spiral controlled pour in pulses, mass curve, drawdown; example 15g coffee:250g water.
- French Press: coarse grind, pour, steep, break crust/press slowly, decant; timing and fines feedback.
- AeroPress: filter, grind, load, pour, stir, cap, press with smooth pressure gauge.
- Moka Pot: water to safe level, basket dose, assemble, heat, stop before sputtering; safety guard.
- Cold Brew: coarse grind, choose ratio, steep simulation via game clock, filter, dilute/serve; real-world reference 12–18h chilled, recipes vary.
- Milk steam: fill pitcher, position steam tip, introduce air then vortex, temperature gauge, avoid scorching; milk safety and handling.
- Latte Art: pour height/flow + gesture path; assisted template first, freehand later. Scoring based on coherence, not pixel-perfect drawing.
- Blending: add ingredients, measure syrup, control blend duration, ice; texture and sweetness.
- Fantasy drinks: clearly labeled fictional; mystical interactions can be playful but must not teach false real-world coffee rules.

### 9. Recipe library and progression
Launch scope proposal: 24 recipes, unlocked gradually, with 12 core lessons fully authored first.
Families: Espresso (espresso, doppio, ristretto, lungo, americano, long black); Milk (latte, cappuccino, flat white, cortado, macchiato, mocha); Vietnamese (đen phin, sữa đá, bạc xỉu, trứng, muối); Manual (V60, French Press, AeroPress); Cold (cold brew, iced latte, espresso tonic, affogato). Count = 24.
Every recipe schema: id, family, origin, equipment, ingredient mass/volume, grind range, water/milk temperature, target output, brewing steps, tool gestures, error hints, sensory notes, variation range, prerequisite lessons, mastery thresholds, customer preferences, real-vs-fictional label.
Recipe defaults are starting points, NOT authoritative universal standards. Do not teach exact extraction score as scientifically validated.
Example: espresso 18g→36g, 25–30s; latte espresso 36g + steamed milk ~150–220ml depending cup; V60 15g:250g; cold brew 80g:800g steep 12–18h; Vietnamese phin 20–25g coffee + ~80–120g water. Check each recipe with credible barista sources before final publication.
Difficulty tiers: beginner with generous assisted gestures; intermediate timing/ratios; expert consistency, customer preference and signature recipes.

### 10. Café full service loop
Spawn customer → enter/seat or takeout → display bubble → approach and accept order → check inventory → brew station → prepare drink hands-on → place cup on serving tray → approach customer/table → serve → satisfaction reaction → collect payment/tip → clean table/tools → next order.
Customer state machine: ARRIVING, QUEUING, ORDERING, WAITING, SERVED, PAYING, LEAVING, UPSET.
Order data: drink, size, temperature, sweetness, milk preference, tolerance, time, customer patience; no misleading "correct" recipe for personal preference.
Quality score proposed: ingredients/recipe 25, technique 30, extraction/balance 30, presentation/service 15; heuristic, configurable, transparent. Payment = base price + tip/reputation modifiers; no instant cash without service.
Staff automation: hire/train, assign jobs, learned recipe skill determines consistency; player may manually intervene on special orders. Daily accounting, stock, wages, cleanup and upgrades.

### 11. Farm → processing → roastery integration
Plots: EMPTY → PLANTED → GROWING → RIPE → HARVESTED, with watering, fertilizer and pest events only if fun and fair. Batch inventory persists.
Processing: sort cherries, depulp/wash or natural processing, dry to target, store green beans; mini-games scale from guided to automation.
Roast: preheat, load batch, control heat/air, observe roast curve and first-crack cues, cool; roast level affects flavor and grind/extraction.
All ingredients have batch ID, origin, quantity, quality, timestamp and storage state. No ingredient duplication between farm/café scenes.
Cultivation perks: bounded bonuses (growth speed, crop resilience, stamina, exploration); never replace core brewing skill.

### 12. Interaction & mobile performance
- World map isometric 2.5D; render order by feet/base Y; static terrain chunked, props sprites, occlusion, pooling, texture atlas.
- For brewing, camera transitions to large close-up workstation, *not* isometric tiny tools. Touchable equipment >44px; larger active zone for precision tasks.
- Portrait: workstation can zoom/reflow, HUD collapses; avoid text over hands/tools; two-finger camera control when not holding tool.
- Use pointer capture, cancellation on lost pointer, safe gestures, reduced-motion option, adaptive graphics quality, compressed WebP/AVIF atlases with fallback.
- Target smooth play on mid-range mobile; measure actual FPS, memory, initial load and touch latency on real devices before setting numeric acceptance thresholds.
- Assets: environment layered backgrounds, building/plant state sprites, character atlases, workstation equipment sprites with movable parts, effects, HUD 9-slice, sound library.
- One giant AI concept image is reference ONLY, never substitute for gameplay layers.

### 13. Data and engineering contracts
Modules:
`scenes/{Farm,Cafe,Town,WorldMap,Opening,ImmortalCouncil,Academy,BrewingStation,Roastery,Processing}.ts`
`systems/{Movement,Interaction,Farm,Inventory,Processing,Roast,BrewPhysics,Recipe,Customer,Economy,Quest,Cultivation,Save}.ts`
`ui/{SharedHUD,BrewHUD,RecipeCodex,OrderPanel,ResultsPanel,MobileLayout}.ts`
`data/{recipes,equipment,beans,customers,lessons,quests,regions}.ts`
`assets/{world,characters,stations,ui,audio}`
Brewing domain model:
`BrewSession {mode,recipeId,beanBatchId,equipment,settings,step,measurements,actions,errors,quality,startedAt,finishedAt}`
Actions event log `{at,tool,gesture,amount,valid}`; deterministic seeded evaluation for test/replay; no direct DOM mutation inside domain systems.
Use versioned save schema, migrate current localStorage keys, never reset players on update. Service orders and ingredient transactions should be idempotent. Avoid full world redraw every pointer event.

### 14. Milestones and acceptance gates
P0 Design approval: screen inventory, HUD landscape/portrait, two complete station storyboards (Espresso + Phin), art and interaction grammar signed off. NO gameplay code before approval.
P1 Engine: movement, interactions, camera, save, HUD, scene transitions, test on mobile.
P2 Farm supply: plots, growth, harvest, inventory, processing and roast batch.
P3 Espresso vertical slice: every gesture from weigh to serve playable, no Next-only progression; evaluate and recover from wrong grind.
P4 Phin vertical slice: assemble, bloom, pour, drip, milk, ice, serve.
P5 Academy/codex: lessons, tooltips, mastery, 12 authored lessons.
P6 Café service: customer AI, orders, serving, payments, cleanup, satisfaction.
P7 Extend to 24 recipes and method-specific mini-games, milk steaming/latte art.
P8 Town, NPC, cultivation, reincarnation prologue.
P9 World expansion, staff automation, economy and endgame.
P10 Production polish: layered reference-quality art, VFX, sound, localization, accessibility, performance, QA.
Acceptance for any minigame:
[ ] physical gesture not fake next; [ ] visible object movement; [ ] responsive live gauges; [ ] wrong input affects result; [ ] feedback explains why; [ ] retry/undo path; [ ] mouse and touch; [ ] portrait and landscape; [ ] accessible alternate input; [ ] save/restore; [ ] real inventory transaction where relevant.
No milestone is complete solely because UI appears or a screenshot matches reference.

### 15. Known current implementation gap
Existing `src/game/Progression.ts` exposes `BREW_STEPS` = grind/dose/tamp/extract/finish but has no instrument simulation or real step gesture contracts. Existing `src/main.ts` combines scenes/UI and uses placeholder art. Gems and energy may be display-only; quest claim may be incomplete. Previous redesign documentation described phases 1–4 as a prototype. This GDD supersedes its design requirements; it does NOT imply these features are already implemented.

### 16. Decisions requiring product signoff
- Approve S00–S23 screen inventory and O01–O15 overlays.
- Approve 24 recipe launch scope with first 12 deep lessons.
- Approve Learn/Practice/Service/Experiment modes.
- Approve Espresso + Phin as mandatory fully interactive vertical slices.
- Approve scoring as an approximate gameplay heuristic and no false universal recipes.
- Approve UI wireframes for both orientations and illustrated asset production before coding.
