# ATLAS MAX

ATLAS MAX is a private, static No Man’s Sky technology planner with a goal-first layout optimizer and a functional Corvette construction workshop. Everything runs in the browser. There are no accounts, API keys, telemetry, paid dependencies or server-side services in the portable application.

## Command-deck interface refresh

The redesigned interface retains the original planner and PDF exporter while adding a live mission-control telemetry card, illustrated equipment tabs, clearly separated setup and technology workflows, a higher-contrast blueprint matrix, readable module tiles and tool modes, and dedicated analysis/export cards. The telemetry updates with equipment, mission profile, class, installed capacity and optimization status. Responsive breakpoints support mobile, tablet and desktop screens without horizontal page overflow; only the technology grid itself scrolls horizontally when necessary. All five signal themes remain available.

## Equipment and features

Plan Exosuit, Multi-Tool, Starship, Freighter, Exocraft and Corvette inventories. The local catalogue contains 220 technology definitions and 86 Corvette construction components, including FORSAKEN additions. Living ships, Sentinel interceptors and individual Exocraft have separate compatibility filters.

- Configurable inventory canvas, unavailable slots and class-aware supercharged limits.
- Manually marked supercharged coordinates, fixed module placements and move/swap editing.
- Equipment-specific mission profiles and explicit primary-weapon priority for combat.
- Source-linked technology inspection, procedural-module labels, observed-stat notes and preference ranking.
- Corvette construction-to-technology mappings, quantity tracking and preserved manifests.
- Distinct technology identifiers and family colors; gold supercharged markings across all five themes.
- Dark engineering-dossier PDFs with a high-resolution capture of the live technology grid, plus separately editable JSON backups.
- Responsive desktop, tablet and phone interface, offline cache and Home Screen icons.

## Getting started

1. Choose equipment, variant, class and mission profile.
2. Add the technology installed in your game, or start with **Essential systems**. Add Corvette functional components in its workshop. The displayed construction counts represent active generated upgrades, not a promise that every physical duplicate produces another bonus.
3. Match the inventory dimensions. Mark unavailable slots with **Block slot**.
4. Select **Supercharge** and mark your actual in-game positions. Nothing is preselected. Fresh page loads always begin without supercharged slots; only an explicit JSON import restores them.
5. Run **Optimize layout**. Review the allocation and family connectivity. Use **Inspect**, **Move / swap** and **Pin module** to refine the result.
6. Download the PDF for reference and JSON for future editing.

Selecting a different equipment category retains its current build in memory for this session. Changing a variant starts its compatible configuration afresh. Reloading clears builds; save JSON before leaving. Only the selected theme is automatically remembered.

## How optimization works

The independent solver validates capacity, blocked cells, unique module identities, fixed placements and supercharged limits. It ranks supercharge-eligible modules by the selected mission profile before considering module role and player preference. Long Range ranks travel technology ahead of weapons. Combat ranks the selected primary weapon ahead of other weapons.

Balanced mode first diversifies functional domains rather than defaulting to weapons. It then builds family groups around fixed/supercharged anchors, attempts shortest-path connections, grows connected regions in multiple deterministic construction orders and refines placement with exchanges. The refinement objective is lexicographic: fewer organizational fragments, then more documented adjacency contacts, then more same-group contacts. Refinement never moves the allocated supercharged modules or pinned modules. Every result is checked for dropped or duplicated technology.

A Web Worker keeps the interface responsive. This is a heuristic layout optimizer, not a mathematically proven global optimizer. It reports residual fragmentation and constraints instead of claiming impossible certainty.

### Evidence and numerical limits

The data reference is FORSAKEN 7.10, reviewed 1 November 2026 against Hello Games release notes and current community item catalogues. Individual definitions carry source references and uncertainty notes. Later 7.11/7.12 fixes were reviewed in the release log; they do not establish a new technology-stat model.

**ATLAS MAX does not calculate exact DPS, jump distance or hidden game multipliers.** Procedural rolls and some construction mechanics are variable or incompletely documented. Preferences rank modules within equal goal/role priority; they are not game statistics. Confirm final performance in-game.

Organizational grouping is separate from confirmed game adjacency. Mixed reactors and habitation are grouped without invented stat bonuses. Corvette mapping definitions are component-specific; Dematerialisation Ray and Venom Spitter retain their construction identities while mapping to the documented Infra-Knife upgrade family. Eldritch Thruster has conflicting community descriptions, flagged in its inspector. Vile Proboscis Generator remains in the manifest with an unresolved technology mapping. Utilities without a modeled technology slot remain in the manifest.

Shared Corvette system caps and build-order effects still require matching the active generated modules to the actual inventory. The planner's per-component entry caps are labeled planning limits; they must not be read as verified physical construction limits. Lower-class Multi-Tool capacity is not asserted where unverified. These are material data limitations, not hidden simulated mechanics.

## Export and import

**Export PDF** creates a local, multi-page engineering dossier: a wide blueprint page that embeds a high-resolution capture of the *actual application grid* (including its module names, icons, coordinates, and supercharged/pinned markings), followed by a two-column component index, Corvette construction manifest when relevant, and adjacency/evidence pages. Supporting content remains PDF text; a vector-grid compatibility fallback is used if a browser blocks grid capture. All pages have dark ATLAS MAX styling, and no external service is contacted. The blueprint page uses a wider paper size to preserve grid readability; manifest pages are A4 portrait.

**Backup JSON** preserves equipment, goal, selected weapon, installed quantities, construction selections, module labels/notes, fixed placements and explicit supercharged positions. **Import JSON** validates its schema, compatibility, counts, prerequisites, grid and module identities before replacing the current build. Malformed or incompatible backups are rejected. PDF files cannot be used to restore editable builds.

## Deploy anywhere

The release ZIP has `index.html` at its root. Extract it and upload the contents unchanged. There is no build step or dependency installation.

- **GitHub Pages:** commit the extracted files to the publishing branch and select that branch's root folder in repository Pages settings. Include the supplied `.nojekyll` file. All paths work under repository subdirectories.
- **Netlify:** drag the extracted directory onto Netlify's manual deploy area, or connect a repository with no build command and the root as the publish directory.
- **Other static hosts:** serve the extracted folder over HTTPS. JavaScript modules require HTTP(S); double-clicking `index.html` under `file://` is not supported.
- **Local preview:** run `python3 -m http.server 8080` from the extracted folder and open `http://localhost:8080`.

The repository checkout used for development keeps web files in `dist/`. When deploying that checkout directly, publish `dist/`. The release ZIP flattens those same files to its root, and includes the complete source and tests.

## Home Screen and offline use

On iPhone, open the deployed URL in Safari and choose **Share → Add to Home Screen**. The supplied 180px Apple Touch Icon displays the ATLAS emblem. The manifest also includes 192px/512px icons and standalone display metadata. Service-worker installation and offline use require a supported secure context (HTTPS or localhost). The application caches its own files after an online visit. Source-reference and companion links naturally require internet access.

## Development and tests

Runtime files use native JavaScript modules. No package installation is required. Node 20+ runs the included tests:

```sh
npm test
```

For automated browser checks, serve the project and open `tests/ui.html` (or `dist/tests/ui.html` in the development checkout). Select desktop, tablet or phone width and run the disposable-build suite.

The tests resolve either the development `dist/` structure or the flattened release structure. They cover all equipment/goal combinations, priorities, grouping, blocked space, pins, separated supercharged positions, Corvette mappings, import integrity, PDF structure and a dense 10×6 / 50-module regression with three habitation modules and two reactors.

Core files:

| File | Responsibility |
| --- | --- |
| `js/engine.js` | Placement, connectivity, goal ranking and validation |
| `js/model.js` | Build schema, compatibility, import/export and module generation |
| `js/worker.js` | Background optimization |
| `js/app.js` | Accessible browser controls and interaction |
| `js/pdf.js` | Browser-local PDF serialization |
| `data/equipment.js` | Equipment-specific technology catalogue |
| `data/corvette.js` | Functional construction mappings and evidence notes |

To add technology, extend the data definitions with a unique ID, explicit equipment/subtype compatibility, source, limit, goal tags and evidence notes. `group` is organizational. Set `adjacency` only for documented relationships and `supercharge` to `null` when unverified. Keep schema IDs stable so saved builds remain usable. Bump the cache name in `sw.js` when publishing changed assets.

## Resources

- [Hello Games release log](https://www.nomanssky.com/release-log/)
- [FORSAKEN](https://www.nomanssky.com/forsaken-update/)
- [Voyagers](https://www.nomanssky.com/voyagers-update/)
- [Cosmos](https://www.nomanssky.com/cosmos-update/)
- [Supercharged-slot introduction](https://www.nomanssky.com/2022/10/waypoint-patch-4-05/)
- [NMS Resources technology and adjacency](https://www.nomansskyresources.com/tech-layout-and-adjacency-bonus)
- [NMS Recipes Corvette catalogue](https://nomansskyrecipes.com/corvette/)
- [NMS Crafting & Refining Guide](https://dreadcaptjames.github.io/nmscraftingrefining/)

Unofficial fan project, not affiliated with Hello Games. No Man’s Sky and related names belong to their respective owners.
