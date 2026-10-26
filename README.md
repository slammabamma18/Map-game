# Cradle of Nations

A single-file world-history simulation: drop settlers on a real map and watch villages, nations, trade and wars unfold from the Stone Age to the Information Age. Everything is in `index.html` (open it in any browser; it is also published as a claude.ai artifact).

## Art pipeline

The simulation is untouched; the whole renderer (the second half of the script) was rebuilt around a few ideas that make the map look hand-painted while staying cheap on phones:

- **Terrain relief map.** The world is painted once into a 2x-resolution canvas: biome colours with noise mottling, hill-shading from a smoothed height field, domain-warped biome edges so cells do not read as squares, rounded coastlines with shallow water and foam, rivers as soft strokes, snow caps and dune ripples. Soil blessings, blight and fallout go into a separate cheap tint layer so a nuke never repaints the world.
- **Sprite atlas.** Houses (ten eras, several variants each, landmarks, farms, barns, windmills, silos, factories, towers), people (four-frame walk cycle, era clothing, tools, loads), animals, trees, boats, carts, trains and trucks, fields (by era, crop and season) are drawn once into offscreen canvases and stamped with `drawImage`. Sprites are regenerated at the exact zoom once a pinch settles so every stamp is an unscaled, pixel-aligned copy.
- **View caches.** The composed terrain layers and the static scenery (fields, trees, roads, town ground, buildings, harbours, mine works) are rasterised into canvases that cover the view plus a margin. Panning only copies them, pinching scales them, and they are repainted when the view leaves the margin or the zoom settles. Only animated details (walkers, animals, birds, smoke, windmill blades, boats, traffic, construction, water glints) are drawn every frame.
- **Adaptive quality.** Frame time is tracked and slow devices drop the water shimmer first, then crowd sizes.

Debug hooks on `window.__cradle`: `spriteSheet(zoom)` lays out every sprite, `toggle(pass, bool)` switches render passes, `PROF` and `QUAL` expose timings and the quality level.
