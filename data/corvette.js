/**
 * Corvette construction catalogue, researched against Forsaken 7.10 (2026-11-01).
 * `group` is an organizational preference, never proof of a stat bonus.
 * `max` is this planner's entry cap, NOT a claim about maximum physical parts.
 * Generated construction upgrades have variable rolls; no numeric bonuses are invented.
 * A null tech records an unresolved mapping or a utility outside the technology grid.
 */
export const corvetteDataVersion = '7.10 / 2026-11-01';
export const corvetteCaveats = [
  'Construction counts describe active modeled upgrades. The game can accept additional physical parts without additional bonuses. Compare generated quantities with your actual technology inventory.',
  'Build order can affect which upgrades appear. Cockpits and flight-control reactors, and habs, walkways and cargo attachments, may compete for a shared generated system. Shared caps require in-game confirmation.',
  'Reactor grouping and habitation grouping are organizational preferences. This catalogue does not assign an unverified adjacency bonus to those groups.',
  'Vile Proboscis Generator has no confirmed generated technology mapping in the consulted current item data. It remains in the construction manifest but generates no speculative technology.',
  'Eldritch Thruster is linked to Main Engines A-Class in the current item database; another community page describes it as cosmetic. Confirm the mapping in your game.',
];

const recipe = id => `https://nomansskyrecipes.com/corvette/${id}/`;
const resources = 'https://www.nomansskyresources.com/corvette-parts';
const partsList = [];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
const tech = (name, family, group, tags, supercharge = true) => ({
  name, family, group, tags, adjacency: null, supercharge, scPreference: 1,
});
function add(name, category, mapping, source, note = '', max = 3) {
  partsList.push({id:slug(name),name,category,max,tech:mapping,source,
    note:note || 'Community item-data mapping. Exact installed values vary. Organizational grouping does not imply an adjacency bonus.'});
}

// Reactor systems are separate performance families, grouped together for organization.
for (const [name,id,system,family,tags] of [
  ['Zenith-Class Reactor','B_GEN_0','Warp Core','hyperdrive',['range']],
  ['Medusa-Class Reactor','B_GEN_1','Flight Control Systems','flight-control',['mobility']],
  ['Azimuth-Class Reactor','B_GEN_2','Navigation Systems','navigation',['utility']],
  ['Ceto-Class Reactor','B_GEN_3','Defensive Systems','defensive-systems',['defense']],
  ['Limos-Class Generator','B_GEN_4','Navigation Systems','navigation',['utility']],
  ['Chelone-Class Generator','B_GEN_6','Flight Control Systems','flight-control',['mobility']],
]) add(name,'Reactors',tech(`${system} A-Class Upgrade`,family,'reactor',tags),recipe(id),
  family==='navigation' ? 'Navigation improves launch/pulse fuel use; it is not a hyperdrive-range bonus. Shares its generated system with other Navigation parts; confirm active quantities.' : 'Current community mapping. Mixed reactor models are grouped for organization only; shared generated-system limits depend on the actual inventory.');
add('Vile Proboscis Generator','Reactors',null,recipe('B_GEN_5'),
  'UNVERIFIED MAPPING: the current item entry identifies a reactor but supplies no linked ship technology. Manifest only; no technology or numerical effect invented.');

// One physical cockpit total; UI/model validation must enforce the combined category cap.
for (const [name,id] of [
  ['Titan-Class Cockpit','B_COK_A'],['Ambassador-Class Cockpit','B_COK_B'],['Thunderbird-Class Cockpit','B_COK_D'],['Vantage-Class Cockpit','B_COK_E'],
  ['Hornet-I-Class Cockpit','B_COK_C1'],['Hornet-II-Class Cockpit','B_COK_C2'],['Hornet-III-Class Cockpit','B_COK_C3'],
  ['Viper-I-Class Cockpit','B_COK_C4'],['Viper-II-Class Cockpit','B_COK_C5'],['Viper-III-Class Cockpit','B_COK_C6'],
  ['Mantis-I-Class Cockpit','B_COK_C7'],['Mantis-II-Class Cockpit','B_COK_C8'],['Mantis-III-Class Cockpit','B_COK_C9'],
]) add(name,'Cockpits',tech('Flight Control Systems C-Class Upgrade','flight-control','reactor',['mobility']),recipe(id),
  'One cockpit per Corvette. Its flight-control upgrade can compete with reactor-generated Flight Control Systems; construction order matters.',1);
// Cargo technology provides storage; it is not assigned a fictitious stat adjacency bonus.
for (const [name,id] of [['Titan','A'],['Thunderbird','B'],['Ambassador','C'],['Legion','D'],['Gunner','E'],['Legionnaire','F']]) {
  add(`${name}-Class Hab`,'Habitation',tech('Cargo Systems B-Class Upgrade','cargo','habitation',['salvage'],false),recipe(`B_HAB_${id}`),
    'Cargo-system mapping confirmed. Habs and walkways share cargo-system capacity; model the active technology count shown in your inventory. No supercharge benefit assumed.');
  add(`${name}-Class Walkway`,'Habitation',tech('Cargo Systems C-Class Upgrade','cargo','habitation',['salvage'],false),recipe(`B_HAB1_${id}`),
    'Cargo-system mapping confirmed. Shares cargo-system capacity with full habs and cargo attachments. No supercharge benefit assumed.');
}
for (const [name,id,grade] of [
  ['Titan Heavy Booster','B_WNG_A','A'],['Ambassador Heavy Booster','B_WNG_C','A'],['Titan Sublight Thruster','B_WNG_H','B'],
  ['Twin Echo Jets','B_TRU_A','B'],['Twin Dynamo Jets','B_TRU_B','B'],['Widebody Thruster','B_TRU_E','B'],['Twin Sublight Jets','B_TRU_F','B'],['Firebox Thruster','B_TRU_G','B'],['Longshore Thruster','B_TRU_H','B'],['Thunderbird Heavy Booster','B_WNG_D','A'],
  ['Arcadia Heavy Booster','B_WNG_N','A'],['Aeron Drive','B_WNG_P','A'],
  ['Ambassador Sublight Thruster','B_WNG_F','B'],['Kineostream Thruster','B_TRU_C','A'],
  ['Pyrodrive Booster','B_TRU_D','B'],['Arachnid Thruster','B_TRU_I','B'],['Razor Jet','B_TRU_J','B'],
  ['Gorgon Thruster','B_WNG_S','A'],['Eldritch Thruster','B_WNG_W','A'],
  ['Plated Thruster','B_WNG_X','A'],['Lockjaw Thruster','B_WNG_Y','A'],
]) add(name,'Engines & thrusters',tech(`Main Engines ${grade}-Class Upgrade`,'pulse-engine','pulse-engine',['mobility']),recipe(id),
  name==='Eldritch Thruster' ? 'Current item data maps this part to Main Engines A-Class. NMSResources calls it cosmetic; sources conflict, so verify in-game. It is not silently omitted.' :
    'Main Engines technology mapping. Engines share a generated system; only active upgrades should be modeled. Exact rolls vary.');
add('Arcadia Sublight Thruster','Engines & thrusters',tech('Main Engines B-Class Upgrade','pulse-engine','pulse-engine',['mobility']),'https://nomanssky.fandom.com/wiki/Arcadia_Sublight_Thruster','Community wiki confirms B-class pulse-engine effects. Exact installed rolls vary.');

for (const [name,id] of [['Deflector Shield','B_SHL_A'],['Ion Barrier','B_SHL_B'],['High-Energy Shield','B_SHL_C'],['Defence Field','B_SHL_D'],['Aeron Powershield','B_SHL_E']])
  add(name,'Shields',tech('Shielding System B-Class Upgrade','shield','shield',['defense']),recipe(id));

for (const [name,id,system,family] of [
  ['Phase Beam Array','B_TUR_C','Laser Defence Array','phase-beam'],
  ['Photon Cannon Array','B_TUR_A','Photon Cannon array','photon'],['Deadeye Cannon','B_TUR_B','Positron Ejector array','positron'],
  ['Cyclotron Defence Cannon','B_TUR_D','Cyclotron defence array','cyclotron'],
  ['Infra-Knife Platform','B_TUR_E','Infra-Knife Accelerator array','infra-knife'],
  ['Venom Spitter','B_TUR_F','Infra-Knife Accelerator array','infra-knife'],
  ['Dematerialisation Ray','B_TUR_G','Infra-Knife Accelerator array','infra-knife'],
  ['Torpedo Launcher','B_DECO_I','Rocket Batteries','rocket'],
]) add(name,'Weapons',tech(`${system} A-Class Upgrade`,family,family,['combat']),recipe(id),
  ['Venom Spitter','Dematerialisation Ray'].includes(name) ? 'Forsaken construction part maps to Infra-Knife Accelerator array technology, not a new independent weapon system. Its original construction name is preserved.' : 'Generated weapon upgrade; corresponding usable weapon must be installed. Select its weapon family as combat priority.');
for (const [name,id] of [['Heavy Landing Gear','B_LAN_B'],['Landing Gear','B_LND_A'],['Mag-Field Landing Thrusters','B_LND_B'],['Hydraulic Legs','B_LND_C'],['Rover Landing Thrusters','B_LND_D']])
  add(name,'Landing systems',tech('Launch Systems B-Class Upgrade','launch-thruster','launch-thruster',['utility']),recipe(id));
add('Thunderbird Landing Thrusters','Landing systems',tech('Launch Systems B-Class Upgrade','launch-thruster','launch-thruster',['utility']),'https://nomanssky.fandom.com/wiki/Thunderbird_Landing_Thrusters','Community wiki confirms B-class launch-system effects. Exact installed rolls vary.');

add('Cargo Pod','Cargo',tech('Cargo Systems C-Class Upgrade','cargo','habitation',['salvage'],false),recipe('B_DECO_F'),
  'Shares Cargo Systems with habs and walkways. Quantities represent active technology, not unlimited storage bonuses.');
for (const name of ['Cargo Capsule','Cargo Box','Cargo Sphere'])
  add(name,'Cargo',tech('Cargo Systems C-Class Upgrade','cargo','habitation',['salvage'],false),
    'https://nomansskyrecipes.com/blog/no-mans-sky-corvette-builds/',
    'Community guide maps this cargo attachment to Cargo Systems C-Class. Shares capacity with habs and walkways.');
add('Tractor Beam','Utilities',tech('Tractor Beam','tractor-beam','tractor-beam',['salvage','utility'],null),
  'https://www.nomanssky.com/cosmos-update/',
  'Physical salvage utility confirmed by Hello Games. One reserved technology cell per modeled beam is community-reported; numerical effects, supercharging and multiple-beam limits remain unverified.',3);
for (const [name,note] of [
  ['Refiner Unit','Functional onboard three-input refining utility. No ship technology slot is modeled.'],
  ['Mission Radar','Functional onboard mission utility. No ship technology slot is modeled.'],
  ['Nutrition Unit','Functional onboard nutrition utility. No ship technology slot is modeled.'],
  ['Living Wall','Cultivation and harvest utility. No ship technology slot is modeled.'],
]) add(name,'Utilities',null,'https://www.nomanssky.com/voyagers-update/',note,3);
for (const name of ['Titan-Class Landing Bay','Ambassador-Class Landing Bay','Thunderbird-Class Landing Bay','Internal Landing Bay'])
  add(name,'Access systems',null,resources,'Functional access component. No generated technology mapping is verified; retained in construction manifest.',3);

export const parts = partsList;
