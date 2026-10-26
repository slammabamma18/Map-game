"""Pack the baked sprites (bake/*.png + bake/meta.json) into sheet.png and atlas.json."""
import json, os
from PIL import Image
B = 'bake'; meta = json.load(open(os.path.join(B, 'meta.json'))); sp = meta['sprites']
sp.sort(key=lambda s: -s['h'])
W = 2048; x = y = 0; shelf = 0; pad = 1; atlas = {}
for s in sp:
    if x + s['w'] + pad > W:
        x = 0; y += shelf + pad; shelf = 0
    atlas[s['name']] = {'x': x, 'y': y, 'w': s['w'], 'h': s['h'], 'ax': s['ax'], 'ay': s['ay']}
    x += s['w'] + pad; shelf = max(shelf, s['h'])
H = y + shelf + 1
sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for s in sp:
    a = atlas[s['name']]; sheet.paste(Image.open(os.path.join(B, s['name'] + '.png')).convert('RGBA'), (a['x'], a['y']))
sheet.save('sheet.png', optimize=True)
json.dump({'ppc': meta['ppc'], 'w': W, 'h': H, 's': atlas}, open('atlas.json', 'w'), separators=(',', ':'))
print('sheet', W, 'x', H, 'sprites', len(sp))
