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

## Shopkeeper (v5)
Rzel, a masked rocker with a flame guitar, stands behind the shop counter (2-frame strum idle). Use Hand on him or the counter for a greeting, then the shop opens. Override his art with `ASSETS.shopkeeper` (16x32).
