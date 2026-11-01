# Verification

Checked 1 November 2026.

- 47 automated Node tests passed, including every equipment/goal combination and dense 50-module Corvette regression.
- The original release ran 63 automated browser assertions at each of 1280px, 768px and 390px widths in Chromium, using an embedded application viewport. This revision updates the PDF export test for asynchronous capture; the full browser suite was not rerun because this environment blocks local URL navigation. DOM-grid capture itself was verified in isolated Chromium.
- Browser checks exercised goal selection, generated dependencies, quantity limits, SC marking and limits, Web Worker optimization, theme invariance, pin/move/block controls, inspection, actual PDF/JSON serialization, JSON file import, Corvette quantity generation and grouping, help and companion link.
- PDF fixture parsed and rendered as a valid multi-page mixed-format engineering dossier (wide blueprint followed by portrait index, construction and evidence pages). A dense 50-module Corvette PDF was rendered and visually inspected. A browser DOM-grid capture was rasterized using Chromium and embedded as a JPEG PDF XObject; the vector-grid fallback was also rendered. Source references and warning text are preserved.
- Apple Touch Icon and 192/512px PNG icons generated locally; all static assets use relative paths.

Run `npm test` for model/optimizer/PDF checks and open `tests/ui.html` through a static server for browser checks.

Not independently tested on physical iPhone/iPad hardware or Safari. No exact in-game DPS/range comparison is claimed. Source uncertainty and unresolved Corvette system caps are documented in README and component inspectors.
