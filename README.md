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
