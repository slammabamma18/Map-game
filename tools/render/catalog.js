// Render every candidate model once into a contact sheet for review
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const D='/dl/';
const KM=D+'KayKit-Medieval-Hexagon-Pack-1.0/addons/kaykit_medieval_hexagon_pack/Assets/gltf/';
const KC=D+'KayKit-City-Builder-Bits-1.0/addons/kaykit_city_builder_bits/Assets/gltf/';
const NF=D+'nf/package/library/lowpoly/';
const CB=D+'citybuilder/models/';
const QN=D+'rpg/resources/nature/FBX/';
const QM=D+'rpg/resources/monsters/FBX/';
const MK=D+'market/files/models/';
const list=[];
for(const b of ['home_A','home_B','tavern','market','blacksmith','church','castle','tower_A','tower_B','windmill','watermill','lumbermill','mine','barracks','archeryrange','well','tower_base'])list.push(['km_'+b,KM+'buildings/red/building_'+b+'_red.gltf']);
for(const b of ['bridge_A','destroyed','dirt','grain','scaffolding','stage_A','stage_B','stage_C','wall_straight','wall_corner_A_outside','wall_straight_gate','fence_wood_straight','fence_stone_straight'])list.push(['kmn_'+b,KM+'buildings/neutral/'+(b.startsWith('wall')||b.startsWith('fence')?b:'building_'+b)+'.gltf']);
for(const n of ['tree_single_A','tree_single_B','trees_A_small','trees_B_medium','rock_single_A','hill_single_A','tree_single_A_cut'])list.push(['kmnat_'+n,KM+'decoration/nature/'+n+'.gltf']);
for(const n of ['tent','barrel','crate_A_big','wheelbarrow','sack','resource_lumber','resource_stone','pallet','flag_red','target','weaponrack'])list.push(['kmp_'+n,KM+'decoration/props/'+n+'.gltf']);
for(const b of ['building_A','building_B','building_C','building_D','building_E','building_F','building_G','building_H','watertower','car_sedan','car_taxi','car_police','streetlight','bush'])list.push(['kc_'+b,KC+b+'.gltf']);
for(const b of ['building_a','building_b','building_c','building_d','building_e','building_f','building_g','building_h','skyscraper_a','skyscraper_b','skyscraper_c','hangar','generator','generator_large','column','obelisk','tent','campfire','fence','log','stump','tree_oak','tree_pine','tree_pine_tall','tree_palm','tree_autumn','tree_dark','tree_fat','bush','bush_large','rock_large','rock_small','cargo_ship','miner_ship','tractor','truck','truck_flat','van','delivery_van','delivery_flat','sedan','taxi','police_car','ambulance','firetruck','garbage_truck','digger','tank','satellite_dish','crate','barrel','barrels','chest','target','mini_male_a','mini_female_a','worker','adventurer','deer','stag','fox','wolf','husky','cat','crab','frog','pug'])list.push(['nf_'+b,NF+b+'.glb']);
for(const b of ['building-small-a','building-small-b','building-small-c','building-small-d','building-garage','grass-trees','pavement-fountain','road-straight-lightposts'])list.push(['cb_'+b,CB+b+'.glb']);
for(const b of ['CommonTree_1','CommonTree_Autumn_2','CommonTree_Snow_3','BirchTree_1','BirchTree_Autumn_1','PineTree_1','PineTree_Snow_2','Willow_1','PalmTree_1','PalmTree_3','Cactus_1','Bush_1','BushBerries_1','Wheat','Corn_1','Rock_1','Rock_Moss_2','TreeStump','WoodLog','Flowers','Grass'])list.push(['qn_'+b,QN+b+'.fbx']);
for(const b of ['Pig','Chicken','Deer','Bee','Penguin','Crab'])list.push(['qm_'+b,QM+b+'.fbx']);
for(const b of ['ship-light','ship-dark','boat-small','boat-large','cannon','tower','tractor','house-3','house-4','house-5','house-6','house-7','house-18','house1','tree-big','tree-small','palm-short','low-poly-farm','barn','wind-turbine','library-large','male','pirate-crew','survivor-male','low-poly-horse','bridge-01'])list.push(['mk_'+b,MK+b+'/model.gltf']);
(async()=>{ const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']}); const page=await browser.newPage({viewport:{width:600,height:600}});
  page.on('pageerror',e=>console.log('PAGEERROR',e.message)); page.on('console',m=>{ if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,200)); });
  await page.goto('http://127.0.0.1:8787/render/index.html'); await page.waitForFunction(()=>window.__ready,null,{timeout:30000});
  const results=[]; const t0=Date.now();
  for(const [name,url] of list){ try{ const r=await page.evaluate(async([u])=>{ return await window.renderModel(u,{}); },[url]); if(!r){ console.log('empty',name); continue; } fs.writeFileSync(path.join(__dirname,'out',name+'.png'),Buffer.from(r.png.split(',')[1],'base64')); delete r.png; r.name=name; r.url=url; results.push(r); }catch(e){ console.log('FAIL',name,String(e.message).slice(0,160)); } }
  fs.writeFileSync(path.join(__dirname,'out','catalog.json'),JSON.stringify(results,null,1)); console.log('rendered',results.length,'of',list.length,'in',((Date.now()-t0)/1000).toFixed(0)+'s'); await browser.close(); })().catch(e=>{console.error(e);process.exit(1);});
