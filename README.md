# Cradle of Nations

A single-file world-history simulation: drop settlers on a real map and watch villages, nations, trade and wars unfold from the Stone Age to the Information Age. Everything is in `index.html` (open it in any browser; it is also published as a claude.ai artifact).

## Art pipeline

The simulation is untouched; the whole renderer (the second half of the script) was rebuilt around a few ideas that make the map look hand-painted while staying cheap on phones:

- **Terrain relief map.** The world is painted once into a 2x-resolution canvas: biome colours with noise mottling, hill-shading from a smoothed height field, domain-warped biome edges so cells do not read as squares, rounded coastlines with shallow water and foam, rivers as soft strokes, snow caps and dune ripples. Soil blessings, blight and fallout go into a separate cheap tint layer so a nuke never repaints the world.
- **Rendered assets.** Buildings, people, animals, trees, vehicles and boats are real 3D models, all CC0: KayKit's Medieval Hexagon Pack and City Builder Bits (Kay Lousberg), Kenney's City Kit, Nature Kit, Car Kit, Mini Characters, pirate ships and city-builder kit, and Quaternius's farm animals and wildlife. `tools/render` (a three.js page driven by Playwright) renders every model under one oblique orthographic camera and one key light with soft shadows at 200 px per map cell, packs the crops into `sheet.png` with `atlas.json`, and the build embeds both in `index.html`. Characters are baked as walk-cycle, idle, carry and work frames from the models' own animations. Fields, water, smoke and fire remain procedural.
- **Sprite atlas.** Every sheet crop and remaining procedural sprite is cut once into a small canvas at the current zoom and stamped with `drawImage`. Sprites are regenerated at the exact zoom once a pinch settles so every stamp is an unscaled, pixel-aligned copy.
- **Settlement plans.** Towns are no longer laid out on the tile grid. Each settlement gets a seeded plan: radial streets with a ring road for organic eras, rotated grids for classical and modern ones, buildings placed along both sides of the streets facing them, then infilled; civic buildings (market, tavern, blacksmith, church, well, barracks) are sprinkled through, the capital's landmark stands at the centre (castle, palace, tower), walled eras get a stone ring with towers and a gate, and construction shows as timber-frame stages.
- **View caches.** The composed terrain layers and the static scenery (fields, trees, roads, town ground, buildings, harbours, mine works) are rasterised into canvases that cover the view plus a margin. Panning only copies them, pinching scales them, and they are repainted when the view leaves the margin or the zoom settles. Only animated details (walkers, animals, birds, smoke, windmill blades, boats, traffic, construction, water glints) are drawn every frame.
- **Adaptive quality.** Frame time is tracked and slow devices drop the water shimmer first, then crowd sizes.

## Rebuilding the sprite sheet

The render tooling lives in the session scratch directory during development (`render/index.html`, `bake.js`, the packer) and needs the model packs cloned next to it; see the commit message for sources. Rendering all 300 sprites takes about half a minute in headless Chromium with SwiftShader.

Debug hooks on `window.__cradle`: `spriteSheet(zoom)` lays out every sprite, `toggle(pass, bool)` switches render passes, `PROF` and `QUAL` expose timings and the quality level.
