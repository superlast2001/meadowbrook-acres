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
Press ` or F2 (desktop), tap the version label 5 times quickly, or tap DEV in the touch panel.

## Shopkeeper Rzel (v8: 24x38, new demon-samurai mask, outlined briefs)
Rzel (silver horned helmet-mask, half cyber-armor) stands behind the shop counter with a 2-frame idle (breathing + peace sign). Use Hand on him or the counter: greeting with choices Shop / Follow me / Bye. Following, he trails ~1.5 tiles behind, walks around obstacles via your trail, and warps to you if stuck or >10 tiles away. Hand on him while away: Stay here / Go back to shop (or Follow me). While he's away the counter shows a "Rzel is out" sign and the shop is closed. Follow state is saved. Dev cheat: "Rzel follow". Override art with `ASSETS.shopkeeper` (24x38; replaces all his frames). Sprite keys: shopkeeper_0/1, rzel_{down,up,left,right}_{0,1,2}.
