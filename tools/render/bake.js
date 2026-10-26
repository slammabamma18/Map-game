// Bake the final sprite set: every entry rendered at PPC pixels per map cell.
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const PPC=200, SIZE=512, V=1.6; const pxPerUnit=SIZE/(2*V);
const D='/dl/'; const KM=D+'KayKit-Medieval-Hexagon-Pack-1.0/addons/kaykit_medieval_hexagon_pack/Assets/gltf/'; const KC=D+'KayKit-City-Builder-Bits-1.0/addons/kaykit_city_builder_bits/Assets/gltf/'; const NF=D+'nf/package/library/lowpoly/'; const CB=D+'citybuilder/models/'; const QM=D+'rpg/resources/monsters/'; const MK=D+'market/files/models/';
const E=[]; const add=(name,url,cpu,opts)=>E.push({name,url,cpu,opts:opts||{}});
// KayKit medieval buildings in four roof colours (cpu = map cells per model unit)
const KMB=0.35;
for(const c of ['yellow','green','red','blue']){ for(const b of ['home_A','home_B','tavern','market','blacksmith','church','castle','tower_A','tower_B','windmill','watermill','lumbermill','mine','barracks','archeryrange','well']){ add(`km.${b}.${c}`,KM+`buildings/${c}/building_${b}_${c}.gltf`,KMB,{yaw:0}); if(b==='home_A'||b==='home_B')add(`km.${b}.${c}.r`,KM+`buildings/${c}/building_${b}_${c}.gltf`,KMB,{yaw:270}); } }
for(const b of ['wall_straight','wall_corner_A_outside','wall_straight_gate','fence_wood_straight','fence_stone_straight'])add('km.'+b,KM+'buildings/neutral/'+b+'.gltf',KMB,{});
for(const b of ['scaffolding','stage_A','stage_B','stage_C','destroyed','bridge_A'])add('km.'+b,KM+'buildings/neutral/building_'+b+'.gltf',KMB,{});
for(const n of ['tree_single_A','tree_single_B','trees_A_small','trees_B_medium','trees_A_medium','rock_single_A','rock_single_B','rock_single_C','tree_single_A_cut'])add('km.'+n,KM+'decoration/nature/'+n+'.gltf',KMB,{});
for(const n of ['tent','barrel','crate_A_big','wheelbarrow','sack','resource_lumber','resource_stone','pallet','target','weaponrack'])add('km.'+n,KM+'decoration/props/'+n+'.gltf',KMB,{});
// KayKit city bits
for(const b of ['building_A','building_B','building_C','building_D','building_E','building_F','building_G','building_H','watertower'])add('kc.'+b,KC+b+'.gltf',0.17,{});
for(const b of ['car_sedan','car_taxi','car_police','car_hatchback','car_stationwagon'])add('kc.'+b,KC+b+'.gltf',0.3,{yaw:90});
for(const b of ['streetlight','bush','trafficlight_A','dumpster','bench'])add('kc.'+b,KC+b+'.gltf',0.25,{});
// Kenney kits via the netforge mirror
for(const b of ['building_a','building_b','building_c','building_d','building_e','building_f','building_g','building_h'])add('nf.'+b,NF+b+'.glb',0.34,{});
for(const b of ['skyscraper_a','skyscraper_b','skyscraper_c'])add('nf.'+b,NF+b+'.glb',0.34,{});
add('nf.hangar',NF+'hangar.glb',0.2,{}); add('nf.generator',NF+'generator.glb',0.3,{}); add('nf.generator_large',NF+'generator_large.glb',0.3,{}); add('nf.column',NF+'column.glb',0.3,{}); add('nf.obelisk',NF+'obelisk.glb',0.3,{}); add('nf.satellite_dish',NF+'satellite_dish.glb',0.25,{});
add('nf.tent',NF+'tent.glb',0.29,{}); add('nf.tent.r',NF+'tent.glb',0.29,{yaw:120}); add('nf.campfire',NF+'campfire.glb',0.3,{}); add('nf.fence',NF+'fence.glb',0.3,{}); add('nf.log',NF+'log.glb',0.3,{}); add('nf.stump',NF+'stump.glb',0.3,{});
for(const b of ['tree_oak','tree_pine','tree_pine_tall','tree_palm','tree_autumn','tree_dark','tree_fat','bush','bush_large','rock_large','rock_small','rock_tall'])add('nf.'+b,NF+b+'.glb',0.42,{});
for(const b of ['cargo_ship','miner_ship'])add('nf.'+b,NF+b+'.glb',0.25,{yaw:90});
for(const b of ['sedan','taxi','police_car','van','truck','truck_flat','delivery_van','delivery_flat','ambulance','firetruck','garbage_truck','tractor','digger'])add('nf.'+b,NF+b+'.glb',0.11,{yaw:90});
for(const b of ['barrel','barrels','crate','chest'])add('nf.'+b,NF+b+'.glb',0.2,{});
// characters: walk cycle, work and carry poses, facing screen-right (mirrored in game for left)
for(const c of ['mini_male_a','mini_male_b','mini_male_c','mini_male_d','mini_male_e','mini_male_f','mini_female_a','mini_female_b','mini_female_c','mini_female_d','mini_female_e','mini_female_f']){ for(let f=0;f<4;f++)add(`ch.${c}.walk${f}`,NF+c+'.glb',0.25,{anim:'walk',t:f/4,yaw:90}); add(`ch.${c}.idle`,NF+c+'.glb',0.25,{anim:'idle',t:0.2,yaw:90}); add(`ch.${c}.work0`,NF+c+'.glb',0.25,{anim:'pick-up',t:0.3,yaw:90}); add(`ch.${c}.work1`,NF+c+'.glb',0.25,{anim:'pick-up',t:0.55,yaw:90}); add(`ch.${c}.hold`,NF+c+'.glb',0.25,{anim:'holding-right',t:0.2,yaw:90}); }
for(const a of ['deer','stag','fox','wolf']){ for(let f=0;f<2;f++)add(`an.${a}.walk${f}`,NF+a+'.glb',0.06,{anim:'Walk',t:f/2+0.1,yaw:90}); add(`an.${a}.idle`,NF+a+'.glb',0.06,{anim:'Eating',t:0.4,yaw:90}); }
for(const [a,tex,cpu] of [['Pig','Pig_Texture.png',0.0032],['Chicken','Chicken_Texture.png',0.0022]]){ for(let f=0;f<2;f++)add(`an.${a.toLowerCase()}.walk${f}`,QM+'FBX/'+a+'.fbx',cpu,{anim:'Walk',t:f/2+0.1,yaw:90,texture:QM+'Textures/'+tex}); add(`an.${a.toLowerCase()}.idle`,QM+'FBX/'+a+'.fbx',cpu,{anim:'Idle',t:0.3,yaw:90,texture:QM+'Textures/'+tex}); }
// Kenney city builder starter kit, pirate ships and bits from the pmndrs market mirror
for(const b of ['building-small-a','building-small-b','building-small-c','building-small-d','building-garage','pavement-fountain'])add('cb.'+b,CB+b+'.glb',0.32,{});
add('mk.ship-light',MK+'ship-light/model.gltf',0.075,{yaw:90}); add('mk.ship-dark',MK+'ship-dark/model.gltf',0.075,{yaw:90}); add('mk.boat-small',MK+'boat-small/model.gltf',0.17,{yaw:90}); add('mk.boat-large',MK+'boat-large/model.gltf',0.17,{yaw:90}); add('mk.cannon',MK+'cannon/model.gltf',0.12,{}); add('mk.tower',MK+'tower/model.gltf',0.14,{});
(async()=>{ const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}); const page=await browser.newPage({viewport:{width:600,height:600}});
  page.on('pageerror',e=>console.log('PAGEERROR',e.message));
  await page.goto('http://127.0.0.1:8787/render/index.html'); await page.waitForFunction(()=>window.__ready,null,{timeout:30000});
  fs.mkdirSync(path.join(__dirname,'bake'),{recursive:true}); const meta=[]; const t0=Date.now(); let fails=0;
  // normalise the FBX animals by height instead of unit scale: measure first
  for(const e of E){ try{ let opts=Object.assign({},e.opts); let s=e.cpu*PPC/pxPerUnit; if(e.name.startsWith('an.pig')||e.name.startsWith('an.chicken')){ const probe=await page.evaluate(async([u,o])=>await window.renderModel(u,Object.assign({},o,{scale:0.001})),[e.url,opts]); const hcells=e.name.startsWith('an.pig')?0.14:0.11; s=hcells*PPC/pxPerUnit/(probe.native.y*0.001/0.001)*1; s=hcells*PPC/(probe.native.y*pxPerUnit); } opts.scale=s; opts.view=V;
      const r=await page.evaluate(async([u,o])=>await window.renderModel(u,o),[e.url,opts]); if(!r){ console.log('empty',e.name); fails++; continue; }
      fs.writeFileSync(path.join(__dirname,'bake',e.name+'.png'),Buffer.from(r.png.split(',')[1],'base64')); meta.push({name:e.name,w:r.w,h:r.h,ax:+r.ax.toFixed(2),ay:+r.ay.toFixed(2)}); }catch(err){ fails++; console.log('FAIL',e.name,String(err.message).slice(0,100)); } }
  fs.writeFileSync(path.join(__dirname,'bake','meta.json'),JSON.stringify({ppc:PPC,sprites:meta})); console.log('baked',meta.length,'fails',fails,'in',((Date.now()-t0)/1000).toFixed(0)+'s'); await browser.close(); })().catch(e=>{console.error(e);process.exit(1);});
