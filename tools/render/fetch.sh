#!/bin/sh
# Fetch the CC0 model packs the bake renders from. Run from tools/render; models land in ./dl.
set -e
mkdir -p dl && cd dl
git clone --depth 1 https://github.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0
git clone --depth 1 https://github.com/KayKit-Game-Assets/KayKit-City-Builder-Bits-1.0
git clone --depth 1 https://github.com/KenneyNL/Starter-Kit-City-Builder citybuilder
git clone --depth 1 https://github.com/pmndrs/market-assets market        # Kenney pirate ships, cannon, tower
git clone --depth 1 https://github.com/simondevyoutube/Quick_3D_RPG rpg   # Quaternius farm animals (resources/monsters)
mkdir -p nf && cd nf && curl -sSL -o nf.tgz https://registry.npmjs.org/@netforge/asset-library-files/-/asset-library-files-0.2.0.tgz && tar xzf nf.tgz && cd ..   # Kenney + Quaternius mirror
cd .. && npm init -y >/dev/null && npm install three@0.170.0 playwright
echo "Serve this directory (python3 -m http.server 8787) then: node bake.js && python3 pack.py"
