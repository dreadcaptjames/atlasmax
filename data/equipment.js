/** ATLAS MAX equipment data. Reviewed 2026-11-01.
 * max is a per-entry installation limit, with procedural upgrades max 3 per family.
 * adjacency identifies a documented relationship, not a numeric bonus.
 * null means unverified/no modeled benefit; group is purely organizational.
 * Procedural entries represent the FAMILY, not a fabricated rolled item.
 */
export const equipment = {
  exosuit:{name:'Exosuit',types:['standard'],classes:['N/A'],width:10,height:6,scLimit:3,goals:['balanced','mobility','defense','utility']},
  multitool:{name:'Multi-Tool',types:['pistol','rifle','experimental','alien','royal','sentinel','atlantid','staff','larva'],classes:['C','B','A','S'],width:10,height:6,goals:['balanced','combat','mining','utility','salvage']},
  starship:{name:'Starship',types:['fighter','hauler','explorer','shuttle','exotic','solar','interceptor','living'],classes:['C','B','A','S'],width:10,height:6,goals:['balanced','combat','range','mobility','defense','utility']},
  freighter:{name:'Freighter',types:['capital','system','pirate'],classes:['C','B','A','S'],width:10,height:6,goals:['balanced','range','fleet','utility']},
  exocraft:{name:'Exocraft',types:['roamer','nomad','pilgrim','colossus','nautilon','minotaur'],classes:['N/A'],width:10,height:3,scLimit:3,goals:['balanced','mobility','combat','mining','defense','salvage','utility']},
  corvette:{name:'Corvette',types:['custom'],classes:['C','B','A','S'],width:10,height:6,goals:['balanced','range','combat','salvage','mobility','defense']}
};
export const exocraftCapacities={roamer:28,nomad:26,pilgrim:26,colossus:30,nautilon:28,minotaur:28};
export const technologyDataVersion='2026-11-01 / FORSAKEN 7.10';
export const technologies=[];
const src={suit:'https://www.nomansskyresources.com/exosuit-blueprints',tool:'https://www.nomansskyresources.com/multi-tool-blueprints',ship:'https://www.nomansskyresources.com/starship-blueprints',freighter:'https://www.nomansskyresources.com/freighter-blueprints',exo:'https://www.nomansskyresources.com/exocraft-blueprints',living:'https://www.nomansskyresources.com/living-ship-blueprints',sentinel:'https://nomanssky.fandom.com/wiki/Starship_Catalogue_-_Interceptor',minotaur:'https://nomanssky.fandom.com/wiki/Minotaur',remnant:'https://www.nomanssky.com/remnant-update/'};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function add(prefix,name,family,tags,kind='blueprint',options={}){const eq={suit:'exosuit',tool:'multitool',ship:'starship',freighter:'freighter',exo:'exocraft'}[prefix];const t={id:prefix+'-'+slug(name),name,equipment:[eq],family,group:family,tags,kind,max:kind==='upgrade'?3:1,requires:[],adjacency:null,supercharge:null,scPreference:1,source:src[prefix],note:'Exact performance depends on installed equipment; no numerical bonus is assumed.',...options};technologies.push(t);return t.id;}
function series(prefix,family,tags,core,blueprints=[],options={}){const id=add(prefix,core,family,tags,'core',{adjacency:family,supercharge:true,scPreference:0,...options});for(const name of blueprints)add(prefix,name,family,tags,'blueprint',{adjacency:family,supercharge:true,requires:[id],...options});add(prefix,core+' Upgrade',family,tags,'upgrade',{adjacency:family,supercharge:true,requires:[id],note:'Procedurally generated upgrade. Up to three in this family; stats and installed names vary. Enter your own module details.',...options});return id;}
// Exosuit. Hazard resistance types remain distinct; adjacency is not inferred across types.
series('suit','life-support',['defense'],'Life Support',['Oxygen Recycler','Oxygen Rerouter']);
series('suit','jetpack',['mobility'],'Jetpack',['Airburst Engine','Rocket Boots','Efficient Water Jets','Neural Stimulator']);
add('suit','Hazard Protection','hazard',['defense'],'core',{supercharge:true});
add('suit','Shield Lattice','hazard',['defense'],'blueprint',{requires:['suit-hazard-protection'],supercharge:true});
add('suit','Hazard Protection Upgrade','hazard',['defense'],'upgrade',{supercharge:true,note:'Black-market hazard resistance upgrade; individual resistances vary. Not the same family as rechargeable thermal/toxic/radiation protection.'});
add('suit','Defence Systems Upgrade','personal-shield',['defense'],'upgrade',{adjacency:'personal-shield',supercharge:true,note:'Procedural personal shield/core health upgrade. Installed statistics vary.'});
for(const [name,family,mod] of [['Toxin Suppressor','toxic','Toxic Protection'],['Radiation Deflector','radiation','Radiation Protection'],['Thermic Layer','cold','Thermal Protection (Cold)'],['Coolant Network','heat','Thermal Protection (Heat)']]){add('suit',name,family,['defense'],'blueprint',{supercharge:true});add('suit',mod+' Upgrade',family,['defense'],'upgrade',{supercharge:true,note:'Rechargeable environmental protection. Exact adjacency effect is not modeled; grouped for organization.'});}
add('suit','Aeration Membrane','underwater',['defense'],'blueprint',{supercharge:true});
add('suit','Pressure Membrane','underwater',['defense'],'blueprint',{supercharge:true});
add('suit','Underwater Protection Upgrade','underwater',['defense'],'upgrade',{supercharge:true});
for(const name of ['Simple Translator','Advanced Translator','Superior Translator',"Artemis’ Translator"])add('suit',name,'translator',['utility'],'blueprint',{supercharge:false,note:'Language utility. Grouping is organizational; no adjacency statistic is claimed.'});
for(const name of ['Haz-Mat Gauntlet','Personal Refiner','Personal Refiner Mk 2'])add('suit',name,slug(name),['utility'],'blueprint',{supercharge:false});
for(const name of ['Star Seed','Remembrance'])add('suit',name,'core-health',['defense'],'blueprint',{adjacency:'core-health',supercharge:false,note:'Health/story technology. Star Seed and Remembrance share a documented adjacency relationship; no numeric score is assigned.'});
add('suit','Nutrient Ingestor','life-support',['defense'],'blueprint',{supercharge:null});
add('suit','Sentinel Exosuit Upgrade','sentinel-suit',['defense','mobility'],'upgrade',{supercharge:true,note:'Rebuilt Exosuit Module produces variable forbidden upgrades. Kept as a separate procedural limit and organizational group; mixed-family adjacency not assumed.',source:'https://nomanssky.fandom.com/wiki/Sentinel_Exosuit_Upgrade'});
// Multi-Tool core families.
series('tool','mining',['mining'],'Mining Beam',['Advanced Mining Laser','Optical Drill','Plasma Resonator']);
add('tool','Hijacked Laser','mining',['mining'],'core',{types:['sentinel'],adjacency:'mining',supercharge:true,scPreference:0,note:'Native Sentinel Multi-Tool mining technology. Additional Mining Beam compatibility is game-specific; this is not a generic blueprint.'});
add('tool','Runic Lens','mining',['mining'],'core',{types:['atlantid'],adjacency:'mining',supercharge:true,scPreference:0,note:'Native Atlantid mining technology; not a generic Multi-Tool blueprint.'});
series('tool','scanner',['utility'],'Scanner',['Waveform Recycler']);
add('tool','Analysis Visor','analysis',['utility'],'core',{supercharge:false});
add('tool','Survey Device','analysis',['utility'],'blueprint',{requires:['tool-analysis-visor'],supercharge:false});
for(const name of ['Scan Harmoniser','Polyphonic Core'])add('tool',name,'analysis',['utility'],'blueprint',{supercharge:null,note:'Special scanning technology. No numerical adjacency effect modeled.'});
series('tool','boltcaster',['combat'],'Boltcaster',['Barrel Ioniser','Boltcaster Ricochet Module']);
series('tool','blaze-javelin',['combat'],'Blaze Javelin',['Mass Accelerator','Waveform Oscillator']);
series('tool','pulse-spitter',['combat'],'Pulse Spitter',['Amplified Cartridges','Impact Igniter','Pulse Spitter Ricochet Module']);
series('tool','scatter-blaster',['combat'],'Scatter Blaster',['Shell Greaser']);
series('tool','neutron-cannon',['combat'],'Neutron Cannon',['P-Field Compressor']);
series('tool','plasma-launcher',['combat'],'Plasma Launcher');
series('tool','geology-cannon',['mining','combat'],'Geology Cannon');
add('tool','Sentinel Weapons Upgrade','boltcaster',['combat'],'upgrade',{max:3,adjacency:'boltcaster',supercharge:true,requires:['tool-boltcaster'],note:'Forbidden weapon upgrades benefit the Boltcaster specifically. Separate three-upgrade limit from normal Boltcaster modules.',source:'https://nomanssky.fandom.com/wiki/Sentinel_Weapons_Shard'});
for(const [name,family,tags] of [['Terrain Manipulator','terrain',['mining']],['Paralysis Mortar','stun',['combat']],['Voltaic Amplifier','stun',['combat']],['Combat Scope','scope',['combat']],['Personal Forcefield','forcefield',['defense']],['Cloaking Device','cloak',['defense']],['Fishing Rig','fishing',['utility']],['Lost Angler’s Rig','fishing',['utility']],['Resonance Amplifier','echo',['utility']]])add('tool',name,family,tags,'blueprint',{supercharge:name==='Voltaic Amplifier'?true:false});
add('tool','Gravitino Coil','gravity',['salvage','utility'],'blueprint',{supercharge:false,source:src.remnant,note:'Gravity manipulation attachment introduced in Remnant. Corvette Tractor Beam is a separate technology.'});
// Conventional ship technology; Corvette may use ordinary upgrades alongside construction-generated core systems.
const normal=['fighter','hauler','explorer','shuttle','exotic','solar'];
const synthetic=[...normal,'interceptor'];
function shipFamily(family,tags,core,blueprints=[],upgrade=true){add('ship',core,family,tags,'core',{types:normal,adjacency:family,supercharge:true,scPreference:0});for(const name of blueprints)add('ship',name,family,tags,'blueprint',{equipment:['starship','corvette'],types:[...synthetic,'custom'],adjacency:family,supercharge:true,note:'Requires corresponding functional system. Corvette construction can supply the core; Sentinel ships use their native equivalent.'});if(upgrade)add('ship',core+' Upgrade',family,tags,'upgrade',{equipment:['starship','corvette'],types:[...synthetic,'custom'],adjacency:family,supercharge:true,note:'Procedural upgrade: up to three per family. Requires corresponding functional system; rolled names/statistics vary.'});}
shipFamily('launch-thruster',['mobility'],'Launch Thruster',['Launch Auto-Charger','Efficient Thrusters','Aqua Jets']);
shipFamily('pulse-engine',['mobility'],'Pulse Engine',['Sub-Light Amplifier','Instability Drive','Flight Assist Override','Photonix Core']);
shipFamily('shield',['defense'],'Deflector Shield',['Ablative Armour']);
shipFamily('hyperdrive',['range'],'Hyperdrive',['Emergency Warp Unit','Cadmium Drive','Emeril Drive','Indium Drive','Atlantid Drive']);
shipFamily('photon',['combat'],'Photon Cannon',['Nonlinear Optics']);
shipFamily('phase-beam',['combat'],'Phase Beam',['Fourier De-Limiter']);
shipFamily('positron',['combat'],'Positron Ejector',['Fragment Supercharger']);
shipFamily('infra-knife',['combat'],'Infra-Knife Accelerator',['Q-Resonator']);
shipFamily('cyclotron',['combat'],'Cyclotron Ballista',['Dyson Pump']);
shipFamily('rocket',['combat'],'Rocket Launcher',['Large Rocket Tubes'],false);
// Sentinel may install conventional secondary weapons, but retains its own native primary core.
for(const t of technologies.filter(t=>t.equipment[0]==='starship'&&t.kind==='core'&&['phase-beam','positron','infra-knife','cyclotron','rocket'].includes(t.family)))t.types=synthetic;
add('ship','Vesper Sail','pulse-engine',['mobility'],'core',{types:['solar'],adjacency:'pulse-engine',supercharge:true,note:'Solar-ship exclusive sail; cannot be installed in other ship types.'});
for(const name of ['Teleport Receiver','Economy Scanner','Conflict Scanner','Cargo Scan Deflector'])add('ship',name,slug(name),['utility'],'blueprint',{equipment:['starship','corvette'],types:[...synthetic,'custom'],supercharge:false,note:'Utility function; no verified adjacency benefit modeled.'});
for(const [name,family,tags] of [['Anti-Gravity Well','launch-thruster',['mobility']],['Luminance Engine','pulse-engine',['mobility']],['Crimson Core','hyperdrive',['range']],['Sentinel Cannon','photon',['combat']],['Aeron Shield','shield',['defense']]])add('ship',name,family,tags,'core',{types:['interceptor'],adjacency:family,supercharge:true,scPreference:0,source:src.sentinel,note:'Native Interceptor core. Uses compatible conventional upgrade modules.'});
for(const [name,family,tags] of [['Neural Assembly','organic-launch',['mobility']],['Pulsing Heart','organic-pulse',['mobility']],['Singularity Cortex','organic-warp',['range']],['Scream Suppressor','organic-shield',['defense']],['Grafted Eyes','organic-beam',['combat']],['Spewing Vents','organic-projectile',['combat']]])series('ship',family,tags,name,[],{types:['living'],source:src.living,note:'Organic Living Ship technology. Conventional synthetic modules are incompatible; organic upgrade statistics vary.'});
for(const [name,family,tags] of [['Neural Shielding','organic-utility',['utility']],['Chloroplast Membrane','organic-launch',['mobility']],['Wormhole Brain','organic-utility',['utility']],['Saline Carapace','organic-launch',['mobility']],['Grasping Tendrils','organic-utility',['utility']]])add('ship',name,family,tags,'blueprint',{types:['living'],source:src.living,supercharge:null,note:'Living Ship-only technology. Precise adjacency/supercharged effects not modeled.'});
// Freighter modules are NOT normal ship modules.
series('freighter','freighter-hyperdrive',['range'],'Freighter Hyperdrive',['Warp Core Resonator','Plasmatic Warp Injector','Reality De-threader','Amplified Warp Shielding','Chromatic Warp Shielding','Temporal Warp Computer','Resonance Matrix']);
for(const [name,family,tags] of [['Fleet Fuel Efficiency Module','fleet-fuel',['fleet']],['Fleet Expedition Speed Module','fleet-speed',['fleet']],['Fleet Combat & Defence Module','fleet-combat',['fleet']],['Fleet Exploration & Scientific Module','fleet-science',['fleet']],['Fleet Industrial & Mining Module','fleet-mining',['fleet']],['Fleet Trade Module','fleet-trade',['fleet']]])add('freighter',name,family,tags,'upgrade',{group:'fleet',adjacency:'fleet',supercharge:true,note:'Freighter fleet expedition upgrade; rolled strength varies. Fleet adjacency grouping documented; no numerical formula claimed.'});
for(const name of ['Matter Beam','Interstellar Scanner','Singularity Engine','Atmospheric Control Unit'])add('freighter',name,slug(name),['utility'],'blueprint',{supercharge:false});
// Exocraft catalogs are explicitly disjoint where their systems differ.
const land=['roamer','nomad','pilgrim','colossus'];
series('exo','exo-engine',['mobility'],'Fusion Engine',[],{types:land});
series('exo','exo-boost',['mobility'],'Exocraft Boost Module',[],{types:land});
series('exo','exo-mining',['mining'],'Exocraft Mining Laser',['Advanced Exocraft Mining Laser'],{types:land});
series('exo','exo-cannon',['combat'],'Mounted Cannon',[],{types:land});
for(const name of ['Exocraft Radar','Radar Amplifier','Radar Power Resonator'])add('exo',name,'exo-radar',['utility'],'blueprint',{types:land,supercharge:false,note:'Radar detection utility. No numerical adjacency bonus modeled.'});
for(const name of ['Drift Suspension','Grip Boost Suspension','Hi-Slide Suspension'])add('exo',name,'exo-suspension',['mobility'],'blueprint',{types:land,supercharge:true,note:'Handling modification. Suspension variants trade grip characteristics; grouping is organizational.'});
for(const [name,family] of [['Air Filtration Unit','exo-toxic'],['Neutron Shielding','exo-radiation'],['Megawatt Heater','exo-cold'],['Thermal Buffer','exo-heat']])add('exo',name,family,['defense'],'blueprint',{types:land,supercharge:false});
add('exo','Mineral Processing Rig','exo-refiner',['mining','salvage'],'blueprint',{types:['colossus'],supercharge:false,note:'Colossus-specific mobile refining technology.'});
add('exo','Cyclops Scope','exo-analysis',['utility'],'blueprint',{types:land,supercharge:false,source:src.remnant,note:'Exocraft Analysis Visor support introduced in Remnant. Nautilon/Minotaur compatibility is not modeled without confirmation.'});
add('exo','Excavation Blade','exo-excavation',['mining','salvage'],'blueprint',{types:['colossus'],supercharge:null,note:'Colossus excavation utility. Numeric effects and adjacency not modeled.'});
series('exo','nautilon-engine',['mobility'],'Humboldt Drive',['Osmotic Generator'],{types:['nautilon']});
add('exo','Tethys Beam','nautilon-mining',['mining'],'core',{types:['nautilon'],supercharge:true,note:'Nautilon mining laser. Does not accept ordinary Exocraft mining-laser procedural upgrades.'});
series('exo','nautilon-cannon',['combat'],'Nautilon Cannon',[],{types:['nautilon']});
add('exo','High-Power Sonar','nautilon-sonar',['utility'],'blueprint',{types:['nautilon'],supercharge:false});
add('exo','Dredging Laser','nautilon-terrain',['mining'],'blueprint',{types:['nautilon'],supercharge:null,source:'https://nomanssky.fandom.com/wiki/Exocraft',note:'Nautilon terrain excavation technology. Exact bonuses unverified.'});
series('exo','minotaur-engine',['mobility'],'Daedalus Engine',['Self-Greasing Servos'],{types:['minotaur'],source:src.minotaur});
add('exo','Ariadne’s Flame','minotaur-engine',['mobility'],'core',{types:['minotaur'],adjacency:'minotaur-engine',supercharge:true,source:src.minotaur,note:'Minotaur jump thrusters. Exact contribution varies; no numeric formula assumed.'});
series('exo','minotaur-laser',['mining'],'Minotaur Laser',['Precision Minotaur Laser'],{types:['minotaur'],source:src.minotaur});
series('exo','minotaur-cannon',['combat'],'Minotaur Cannon',[],{types:['minotaur'],source:src.minotaur});
for(const name of ['Minotaur Radar Array','Minotaur Bore','Icarus Fuel System'])add('exo',name,slug(name),name==='Minotaur Bore'?['mining']:['utility'],'blueprint',{types:['minotaur'],supercharge:false,source:src.minotaur});
for(const name of ['Minotaur AI Pilot','Hardframe Body','Liquidator Body'])add('exo',name,'minotaur-ai',['combat','utility'],'blueprint',{types:['minotaur'],adjacency:'minotaur-ai',supercharge:null,source:'https://nomanssky.fandom.com/wiki/Minotaur_AI_Pilot',note:'Adjacency borders are documented between AI Pilot, Hardframe Body and Liquidator Body, but their exact effects are unknown.'});
for(const [name,family,tags] of [['Hardframe Right Arm','minotaur-cannon',['combat']],['Hardframe Left Arm','minotaur-laser',['mining']],['Hardframe Legs','minotaur-engine',['mobility']],['Liquidator Right Arm','minotaur-flame',['combat']],['Liquidator Left Arm','minotaur-stun',['combat']],['Liquidator Legs','minotaur-engine',['mobility']]])add('exo',name,family,tags,'blueprint',{types:['minotaur'],supercharge:null,source:src.minotaur,note:'Minotaur limb technology. Grouped with its functional system; numerical adjacency not assumed.'});
// Compatibility constraints are family-based when the game offers alternate native cores.
for(const t of technologies){
  if(t.equipment.includes('starship')&&t.kind==='core'&&t.types?.some(x=>x!=='living')&&['launch-thruster','pulse-engine','shield','hyperdrive','photon','phase-beam','positron','infra-knife','cyclotron','rocket'].includes(t.family)&&!['ship-anti-gravity-well','ship-luminance-engine','ship-crimson-core','ship-sentinel-cannon','ship-aeron-shield','ship-vesper-sail'].includes(t.id)){
    t.equipment.push('corvette');t.types.push('custom');
  }
  if(t.kind!=='core'&&t.equipment.includes('starship')&&['launch-thruster','pulse-engine','shield','hyperdrive','photon','phase-beam','positron','infra-knife','cyclotron','rocket'].includes(t.family)){t.requiredAnyFamily=t.family;t.requires=[];}
  if(t.equipment.includes('multitool')&&t.family==='mining'&&t.kind!=='core'){t.requiredAnyFamily='mining';t.requires=[];}
}
equipment.exocraft.capacityByType=exocraftCapacities;
equipment.starship.capacityByClass={C:30,B:40,A:50,S:60};
equipment.starship.capacityOverrides={shuttle:{C:25}};
equipment.freighter.capacityByClass={C:30,B:40,A:50,S:60};
equipment.exosuit.capacity=60;
// Small utility/blueprint modules do not automatically benefit from supercharging.
for(const id of ['ship-launch-auto-charger','ship-aqua-jets','ship-emergency-warp-unit']){const t=technologies.find(t=>t.id===id);t.supercharge=false;}
add('exo','Mounted Flamethrower','exo-flamethrower',['combat'],'core',{types:land,supercharge:true,source:'https://www.nomanssky.com/worlds-part-ii-update/',note:'Terrestrial Exocraft close-range flamethrower introduced in Worlds Part II. No procedural upgrade family is invented.'});
const ingestor=technologies.find(t=>t.id==='suit-nutrient-ingestor');
ingestor.family=ingestor.group='nutrition';ingestor.tags=['utility'];ingestor.supercharge=false;ingestor.source='https://www.nomanssky.com/worlds-part-ii-update/';ingestor.note='Automatically consumes cooked food for its existing benefits; not a Life Support adjacency upgrade.';
const excavation=technologies.find(t=>t.id==='exo-excavation-blade');excavation.source=src.remnant;excavation.note='Colossus-only resource scoop: harvests a small amount from obstacles destroyed by collision. Adjacency effects unverified.';
const icarus=technologies.find(t=>t.id==='exo-icarus-fuel-system');icarus.types=[...land,'minotaur'];icarus.note='Daylight engine recharging utility. No numerical adjacency or supercharged benefit modeled.';
