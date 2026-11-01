# Verification

Checked 1 November 2026.

- 46 automated Node tests passed, including every equipment/goal combination and dense 50-module Corvette regression.
- 63 automated browser assertions passed at each of 1280px, 768px and 390px widths in Chromium, using a real embedded application viewport.
- Browser checks exercised goal selection, generated dependencies, quantity limits, SC marking and limits, Web Worker optimization, theme invariance, pin/move/block controls, inspection, actual PDF/JSON serialization, JSON file import, Corvette quantity generation and grouping, help and companion link.
- PDF fixture parsed as a valid three-page A4 PDF; first and final pages visually inspected. Vector grid, manifest, warnings and source references preserved.
- Apple Touch Icon and 192/512px PNG icons generated locally; all static assets use relative paths.

Run `npm test` for model/optimizer/PDF checks and open `tests/ui.html` through a static server for browser checks.

Not independently tested on physical iPhone/iPad hardware or Safari. No exact in-game DPS/range comparison is claimed. Source uncertainty and unresolved Corvette system caps are documented in README and component inspectors.
