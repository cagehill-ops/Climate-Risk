# Texas Grid Under Heat — interface concept

## Purpose and audience

A compact educational stress test for an ERCOT resource planner to discuss with a Texas resident. The central lesson is that greater heat can push modeled demand toward dependable capacity, while demand reduction and added dependable capacity can shift the point at which the two meet. The display illustrates assumptions in a simplified model; it is not a forecast, a reliability assessment, or an operational planning tool. Do not imply that modeled capacity represents the full range of actual grid conditions.

## Experience

A restrained editorial dashboard uses warm off-white, deep ink and a single heat accent, with an intentionally distinct adaptation color. A narrow top line identifies the project as an educational model. The title, **Texas Grid Under Heat**, is followed by a short explanation: explore how additional heat and two adaptations change the modeled gap between peak demand and dependable capacity. A small, persistent **Illustrative stress test** label makes the context clear before interaction.

On wide screens, a control rail sits beside the main visualization. On small screens, the story reads in one column: introduction, controls, chart, results, then methods. Avoid decorative photographs or a schematic map; the live curves are the principal visual. Use generous spacing, a readable system font, clear section labels, visible focus states, and a quiet rule-based hierarchy. Color supports meaning but does not carry it alone.

### Controls

Three labeled native range inputs show their current values beside the labels and their units in the accessible name or description:

1. **Additional local heat** (°C): the selected x-position on the curves, described as a scenario increment relative to the model baseline, not a specific observed or forecast temperature.
2. **Peak-demand reduction** (%): the modeled reduction applied according to the agreed model contract.
3. **Added dependable capacity** (GW): the modeled addition applied according to the agreed model contract.

Place plain-language helper text under each control; define the actual ranges, step sizes, baseline and treatment of values only after the model contract is frozen. Inputs update the chart and results immediately without requiring submission. Native keyboard behavior is retained. Provide a **Reset** button that restores the agreed default, and a small set of clearly labeled preset buttons whose exact values and descriptions come from the contract. Presets change all relevant inputs together and leave the controls editable; reset and presets announce the resulting scenario accessibly without stealing focus.

### Main visualization

A responsive inline SVG plots modeled peak demand and dependable capacity against additional local heat over the contract's entire supported range. Show both the unadapted comparison and the adapted scenario at the **same selected heat**. Differentiate the series with direct labels and line patterns as well as color. A vertical selected-heat marker and visible points connect the controls to the curves; a clear legend explains each line. Axis titles and units are always visible. Calculate scales, threshold locations and labels from the same model outputs as the table; do not infer or hard-code a crossing.

A concise live sentence above or below the chart describes the selected modeled gap and its direction, and whether each scenario has crossed the model's defined threshold. The frozen contract must specify the equality rule, behavior if no crossing exists within the displayed domain, and whether there can be multiple crossings. Avoid categorical claims about outages: a modeled gap is an indicator within this simplified model, not a prediction of failure. If values are unavailable or invalid, describe that state without drawing misleading curves.

The SVG has a title and description, and the adjacent live numerical table provides a complete nonvisual equivalent. Do not announce every SVG path update; use a concise, polite live summary without moving focus or producing competing announcements. Ensure text and graphical marks have sufficient contrast, support keyboard-only operation, and do not rely on hover, animation, or color alone.

### Selected-scenario results

A compact table compares **Unadapted** and **With adaptations** at the selected heat. Rows include modeled peak demand, dependable capacity, gap, and threshold status, with units and a brief definition of the gap's sign. Values use consistent precision and the same rounding rules as the chart and model. If the model contract supports a threshold temperature, show it with a domain-aware explanation; otherwise do not invent one. The visible table is real HTML with row and column headers, remains readable on narrow screens, and is updated from the same computed scenario object as the plot.

### Methods and sources

An initially collapsed native disclosure labeled **Methods, assumptions & sources** explains the model in resident-friendly language, identifies input baselines and equations, defines dependable capacity, lists limitations, and links directly to verified source material. Distinguish sourced data from illustrative assumptions. Specify when the model and source data apply; do not imply live ERCOT data or an official ERCOT product. All numerical assumptions, exact source citations, presets, ranges and methodological claims await the frozen model contract. No fabricated citations or placeholder numbers should be shipped.

## Implementation and ownership

- `index.html`: semantic page structure, labels and native controls, accessible table, SVG container, methods disclosure, metadata, and relative links to local assets.
- `styles.css`: visual system, responsive layout, controls, focus, contrast and reduced-motion treatment. Use system fonts and no remote assets.
- `src/app.js`: ES module wiring between controls, the agreed model API, SVG, table and live summary; presets and reset; formatting and valid-state handling. Keep model calculations in the separate model module owned by the model contributor, and import its frozen interface. Use relative paths compatible with GitHub Pages project subdirectories; no framework, build step, external dependency, account or network request is needed at runtime.

The interface implementation should not duplicate the model's formulas or invent a parallel set of constants. Agree on the exact model module path, input/output schema, value constraints, threshold semantics and data provenance before wiring. Methods copy should reflect the final contract.

## Verification plan

- Check defaults, every preset and reset, and boundary/step values against the model's reference outputs. Verify that changing each slider updates the marker, both series, selected values, gap and threshold description consistently; comparison and adapted values always use identical heat.
- Exercise equality, no crossing within the visible range, and any other threshold cases defined by the model. Confirm rounding cannot contradict the displayed threshold state and invalid/unavailable states are explained.
- Test at narrow and wide viewport sizes, browser zoom and enlarged text; verify that labels, chart, table and disclosure remain readable and usable without clipped content or horizontal page overflow.
- Test all controls and disclosure with keyboard only, visible focus, native range keys and screen-reader names/values. Check the live summary is useful without excessive repeated announcements, and compare its values with the table. Inspect contrast and non-color series distinctions.
- Serve the files locally from both a root path and a nested subdirectory to verify relative module and asset paths; smoke-test without network access. Verify that the app makes no external requests and that the methods link destinations and citations match verified sources. Test in the available browser; report any browser or assistive-technology verification not actually performed.
