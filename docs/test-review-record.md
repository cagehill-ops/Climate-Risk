# Test and review record

Verified locally on November 5, 2026. Public deployment and human acceptance are separate, unfinished steps.

## Reproducible project checks

| Check | Result |
| --- | --- |
| `npm ci` | Passed; no package dependencies or vulnerabilities reported |
| `npm test` | 17/17 passed |
| `npm run check:example` | Passed independent integer-arithmetic calculation; no model import |
| `npm run build` | Passed; static production files in `dist/` |
| JavaScript syntax | Application, engine and scripts checked |
| Production relative links | All local HTML asset/document links and ES-module imports resolve to existing built files |

Model tests cover baseline accounting; independently specified numerical cases; exact crossing and both sides; an ulp-level endpoint regression; all eight slider corners; finite, physically meaningful powers throughout sampled domains; consistent GW identities; heat/reduction/capacity monotonicity; sufficient-capacity zero shortfall; signed negative headroom; same-heat comparison; all 81 curve points; sensitivity cases; invalid/nonfinite inputs; and no input mutation.

## Lead browser checks actually performed

The lead used the actual in-app browser at `http://127.0.0.1:4173/` and the **production build under a nested path**, `http://127.0.0.1:4173/dist/`. These are local preview addresses, not public URLs.

- Automated native keyboard actions exercised all eight combinations of heat/reduction/capacity endpoints. Rendered demand, supply and shortfall were checked against independent arithmetic. All passed.
- All five presets were clicked and checked. Reset restored `(3°C, 0%, 0 GW)`. Arrow-key settings `(1.7°C, 3.5%, 1.5 GW)` produced adapted demand 83.77 GW, supply 92.60 GW and headroom +8.83 GW as expected.
- Increasing heat alone moved the selected marker and changed table values without changing fixed-adaptation curves. Adaptation controls changed the appropriate curves and threshold text. Combined preset gave unadapted −1.46 GW and adapted +5.11 GW headroom, matching unrounded arithmetic.
- Keyboard operation, 3-pixel visible focus, current values with units in `aria-valuetext`, semantic table headings, SVG title/description, methods disclosure, reset, presets and document navigation were checked. Formal screen-reader testing was not performed.
- Widths 320, 390, 768 and 1440 pixels were checked. No horizontal page overflow or clipped SVG labels was found. Narrow tables scroll inside focusable panels. Desktop and mobile screenshots were visually inspected. Mobile SVG geometry was revised to preserve readable label size.
- An actual browser-history defect was found: returning from the calculator document could restore native slider values after initial rendering, leaving stale outputs. `pageshow`/`popstate` now refresh from visible controls on the next animation frame. Combined, hotter and reference presets were each navigated to the document and back; all restored control/result pairs passed.
- Production network observation showed only the local document, CSS and three JS modules. There were no external runtime requests or asset loading failures. With network temporarily disabled **after initial load**, the combined preset still calculated correctly. Network access and viewport overrides were restored.
- No browser console errors or warnings were present at the end. Source destinations were checked against inspected primary documents; the calculator document loaded from the production subdirectory. External sources require network access when opened.

Screenshots: [desktop combined scenario](../qa/desktop-combined.jpg), [mobile heat-only scenario](../qa/mobile-heat.jpg). They are review evidence, not outside-person feedback. The preview tab was left at the default scenario.

## Independent review and numerical checks

The separate reviewer opened the actual primary source documents, reconciled baseline figures, checked model/software source, ran all 17 tests, and independently used decimal arithmetic without the application's model. The combined example matched: pre-reduction demand 91.412 GW; reduction 4.5706 GW; adapted demand 86.8414 GW; adapted supply 91.954 GW; adapted headroom 5.1126 GW; shortfall 0 GW. Without adaptation at the same heat, headroom is −1.458 GW. Improvement is 6.5706 GW.

All reported scientific/software issues are resolved. See [the independent report](independent-review.md). The interface and reviewer agents could not access a browser in their isolated sessions; rendered checks above were performed by the lead. Requested models/efforts and runtime-verification limits are in [project-status.md](project-status.md).

## Not yet verified or completed

No public GitHub Pages deployment or public-URL smoke test; human calculator signoff; group acceptance; course-reading alignment; outside-person usability feedback; real assistive-technology evaluation; separate Safari/Firefox testing; or coursework submission is claimed. No one was contacted. See [manual-actions.md](manual-actions.md).
