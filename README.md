# Meadowbrook Acres
Open `index.html` in a browser. Single file, no assets.

## Adding / editing a weather event
Edit the `EVENTS` array at the top of the script. Each day, the first event whose `trigger(day, r)` returns true (r = one random number 0..1 rolled per day) is used, so order matters; keep `sunny` (always true) last.
Fields:
- `id`, `name` – identifier and HUD label
- `tint` – optional CSS rgba overlay
- `trigger(day, r)` – e.g. `(d,r)=>d%7==0` or `(d,r)=>r<0.1`
- `particle` – `null` or `{color, shape:'drop'|'square', count, speed}`
- `onDayStart(game)`, `onTick(game, dt)` – hooks; helpers: `waterAll()`, `spawnPickup(game, itemId)`, `game.msg(text)`
New collectibles go in `ITEMS` (`{name, sell, color}`) plus an `inv` entry in `newGame()`; the shop sells everything in `ITEMS`.
Example:
```js
{ id:'snow', name:'Snow', tint:'rgba(255,255,255,0.15)', trigger:(d,r)=>r<0.1,
  particle:{color:'#fff', shape:'square', count:120, speed:3} },
```

## v3 visuals
Camera follows the player on a 60x45 tile map (16px pixel-art tiles, 3x on desktop, ~9 tiles across on portrait phones). All art is generated procedurally at startup into offscreen canvases (`SPR`).

## Replacing art (ASSETS)
Set `ASSETS.<key> = 'url.png'` near the top of the script; the image replaces the procedural sprite of the same key (use the same pixel size). Run `listSpriteKeys()` in the browser console for every key and size (e.g. `tree_0 32x40`, `farmer_down_1 16x20`, `crop_corn_4 16x24`, `grass_0 16x16`).

Saves from v1/v2 are migrated automatically onto the new map.

## Dev cheat menu (v4)
Press ` or F2 (desktop), tap the version label (e.g. "v0.09") 5 times quickly, or tap DEV in the touch panel.

## Shopkeeper Rzel (v0.0.0.25: reference-matched grey mask, crescent horns, thin eyes + fangs, friendship hearts)
Rzel (silver horned helmet-mask, half cyber-armor) stands behind the shop counter with a 2-frame idle (breathing + peace sign). Use Hand on him or the counter: greeting with choices Shop / Follow me / Bye. Following, he trails ~1.5 tiles behind, walks around obstacles via your trail, and warps to you if stuck or >10 tiles away. Hand on him while away: Stay here / Go back to shop (or Follow me). While he's away the counter shows a "Rzel is out" sign and the shop is closed. Follow state is saved. Dev cheat: "Rzel follow". Override art with `ASSETS.shopkeeper` (24x40; replaces all his frames). Sprite keys: shopkeeper_0/1, rzel_{down,up,left,right}_{0,1,2}.

## Versioning
The on-screen label now uses v0.0.0.N numbering (current: v0.0.0.26; next: v0.0.0.27, ...).

### Rzel friendship (v0.10)
0-5 hearts (100 pts each) shown in his dialogue box. Talking once per day: +15. One Gift per day (dialogue choice; gives your best item): chocolate = favorite +80, melon/corn = liked +45, radish = neutral +20. Greetings are tiered by hearts (0-1 teasing, 2-3 flirty, 4-5 devoted) plus rain/chocolate-rain lines. Saved in the save file (`rzel: {pts, talkDay, giftDay}`). Dev cheats: +1 heart, Reset hearts.

### Rzel sprite (v0.0.0.24)
Rzel now uses the user-provided pixel art, cleaned to its native 47x94 grid with a transparent background and embedded as a data URL in `ASSETS.shopkeeper`. It is drawn ~30 world px tall (about 1.5x the farmer) with no smoothing, a 1px breathing bob, and a walking bob/sway (mirrored when walking left). The procedural sprite remains as a fallback if that line is removed.


### Rzel character sheet (v0.0.0.24)
Out in the world Rzel is drawn with the chibi sprites (`ASSETS.rzel_c_normal|blush|mad|smile`), about 24 world px tall. He shows the blush/mad/smile chibi for about 3s after a gift or a heart change, with a breathing bob and a step bob/sway. While you talk to him, the large FRONT body view (`ASSETS.rzel_front`) stands beside the dialogue box (and beside the shop panel when there's room), and the mood portrait (`ASSETS.rzel_p_*`) shows in the name box: normal for general greetings, smile for 2-3 heart lines and liked/neutral gifts, blush for 4-5 hearts, chocolate and heart gains, mad for empty-handed or repeat gifts. The side and back views are embedded for later. Remove the ASSETS lines to fall back to the procedural sprite.

### Chibi farmer (v0.0.0.24)
The player is now an original chibi farmer (straw hat, blue overalls) in Rzel's chibi style: big head, bold outlines, soft 3-tone shading. It's embedded as `ASSETS.farmer_sheet`: 4 directions x (idle + 3 walk frames), each 48x72, drawn at 16x24 world px to match chibi Rzel's pixel density. Hitboxes are unchanged. Remove the line to fall back to the procedural farmer.

### v0.0.0.24
The farmer's left/right frames are now true side profiles: face and body turned, hat brim forward, one eye, angled legs stepping forward and back with opposite arm swing (left mirrors right). The up/down walk frames lift the legs more clearly.

### v0.0.0.24
Chibi Rzel walks in the direction he's moving: side-profile chibi frames (left, right mirrored) and a back-view chibi for walking up, built from the character sheet's side/back views, each with idle + 3 walk frames (`ASSETS.rzel_walk`). Walking down, standing at the counter and mood flashes use the front mood chibis.

### v0.0.0.24
Fixed Rzel facing the wrong way when walking right. The sheet's 'SIDE (LEFT)' view shows his left side, so it actually faces right; the left frames now mirror it. His facing uses a smoothed movement vector with hysteresis (no jitter flips), and when he stops he turns toward the player. Side/back chibi frames are bulkier.

### v0.0.0.24
Rzel's world sprite now uses normal proportions (`ASSETS.rzel_world`) built from the sheet's full-body front, back and side views. It's cleaned to a 22-colour palette, despeckled and outlined, about 32 world px tall (~1.3x the farmer). Each direction has idle + 3 walk frames. Moods appear only in the dialogue (full-body front + expression portrait). The chibi sheets stay embedded but unused in the world.


## v0.0.0.22
- Weather only outdoors (rain on windows indoors); walkable shop with shelves, decor and Rzel's counter (open 8:00-17:00).
- Context-aware greetings, idle chatter and reactions; scripted dialogue topics (Chat / Your day / Flirt / Gift / Follow) with memory.
- Optional LLM hook: set `window.MEADOW_AI={endpoint,model,headers}` before load; falls back to scripted lines. No key needed.
- Schedules for Rzel, Mabel and Pip; bed ends the day, passing out at 2am costs 10% gold (max 1000).
- Day/night lighting with lamps, 4 seasons, Halloween festival.
- Hearts + Social panel (R), one gift per NPC per day, heart events (2/4/6/8/10/14), bouquet dating, pendant proposal, wedding, spouse routines.
- Tabbed DEV menu (Character / Item / Time / Weather).

## v0.0.0.24
- Phone portrait: game view ~80% of the screen, compact controls (46px D-pad, 72px USE), Help/Save/Load/Social/DEV/Controls moved into a menu button.
- Spouse lines are now time-aware (morning/lunch/evening).

## v0.0.0.24
- Phone controls ~25% smaller (36px D-pad/tools, 54px USE); bar ~15% height so game view ~85%.

## v0.0.0.25
- New villager **Ares**: cocky playful warrior (spiked black/red hair, red shades, golden sword). World sprite ~Rzel height, 4-dir walk, portraits (happy/smug/serious/surprised).
- Schedule: morning training, midday patrol, afternoon shop/plaza, evening cottage, sleep. Own red-roof cottage.
- Romance like Rzel: hearts, bouquet dating, pendant proposal, wedding, spouse routines. Loves Iron Ore; likes chocolate/corn.
- Social panel + DEV Character tab support Ares (hearts/status/events).

## v0.0.0.26
- **Ares** redrawn from the provided character sheet (turnaround + expressions + chibis), not the old photo.
- Outfit: red wraparound sunglasses, spiked black hair with red tips, fingerless gloves, red loincloth (PG), golden sword, barefoot, hyper-muscular.
- World sprite uses the sheet's chibi row (4 dirs); dialogue uses full-body FRONT + expression portraits (normal tongue-out, smile, blush+hearts, mad, serious).
- Previews: `v26-ares-world.png`, `v26-ares-portrait.png`.
