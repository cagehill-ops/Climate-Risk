# Texas Grid Under Heat — source and parameter audit

Audit date: 2026-11-05. Recommended scope: a deliberately simple ERCOT summer peak capacity-balance experiment using a fixed historical planning snapshot. This is neither a current forecast nor a reproduction of ERCOT reliability modeling.

## Recommended model contract

Use GW throughout, with temperature in °C and demand reduction represented as a fraction:

```text
hotDemand = D0 + alpha * additionalLocalHeat
demand = hotDemand * (1 - demandReduction)
supply = S0 - beta * additionalLocalHeat + dependableAddedCapacity
headroom = supply - demand
headroomPercent = 100 * headroom / demand
```

The reduction applies to the entire heat-adjusted modeled peak. All interventions are incremental to the reference, with no emergency resources added separately. The added capacity is already dependable at the modeled hot peak; do not apply the baseline derating to it a second time. Negative headroom is an illustrative capacity gap, not a prediction of the number of customers losing service.

## Provenance and recommended controls

| Parameter | Default; range; step | Evidence status and exact meaning |
|---|---|---|
| Reference demand `D0` | 83.412 GW; fixed | S1, PDF p3, row [d], first scenario. Adjusted forecast = 82.739 − 0.432 rooftop PV + 1.105 large flexible loads. |
| Reference available supply `S0` | 91.954 GW; fixed | Derived from S1, PDF p3, first scenario: row [e] 96.988 minus row [f] 5.034 GW typical outages; matches 8.542 GW reference headroom. |
| Additional local heat | 3°C; 0–4°C; 0.1°C | **Illustrative exploration bounds**, relative to the reference summer peak conditions. The initial 3°C is chosen pedagogically to show limited headroom; it is not the most likely weather or a forecast. No source establishes 4°C as a particular future year's warming or a global-warming level. |
| Demand slope `alpha` | 2 GW/°C; assumption cases 1, 2, 3 | **Illustrative assumption.** No directly transferable extreme-heat ERCOT marginal peak slope was verified. The low/high cases are sensitivity choices, not measured confidence bounds. |
| Additional supply loss slope `beta` | 0.5 GW/°C; assumption cases 0, 0.5, 1 | **Illustrative assumption.** S4 supports the mechanism, not these ERCOT-wide coefficients. Loss starts only above the reference, which is already summer rated and outage adjusted. |
| Peak demand reduction | 0%; 0–10%; 0.5 percentage point | **Illustrative intervention bounds**, about 0–8.34 GW at reference demand and more when hotter. S5 supports the existence and role of demand response; it does not verify 10% achievable at every peak. Broader efficiency and shifting can be discussed without promising a particular program outcome. |
| Dependable added capacity | 0 GW; 0–10 GW; 0.5 GW | **Illustrative intervention bounds.** Power actually available during the modeled peak, not nameplate construction. Requires availability, fuel/weather, storage duration, and delivery assumptions outside this model. No source verifies a 10 GW near-term build. |

Pair assumption sensitivities as lower response `(alpha=1, beta=0)`, central `(2, 0.5)`, and higher response `(3, 1)`. Coupling them creates transparent contrasting assumptions, not a probabilistic uncertainty distribution. The accepted initial state is +3°C with zero interventions, chosen to start near the balance threshold; a separate reference preset sets all sliders to zero. At +3°C central demand is 89.412 GW, supply 90.454 GW, and headroom 1.042 GW. At +4°C, central headroom is −1.458 GW. These are algebraic checks, not empirical predictions. Every slider bound and step size is a teaching and interface choice, not a measurement resolution.

## Primary sources and exact support

### S1 — ERCOT historical reference

[Summer 2023 SARA, revised PDF](https://www.ercot.com/files/docs/2023/05/05/SARA_Summer2023_Revised.pdf), release date printed May 3, 2023; revised archive posting May 5, 2023. [ERCOT archive](https://www.ercot.com/gridinfo/resource/2023). Actual 21-page PDF opened; page 3 table inspected.

PDF p1: June–September reference; base peak uses 2007–2021 summer-peak weather. PDF p2 uses summer-peak contributions rather than nameplate. PDF p3, “Base & Moderate Reserve Capacity Risk Scenarios,” first column supplies the paired values. PDF p19 identifies the rooftop adjustment's August 10, hour-ending-17 reference. This is a seasonal planning scenario, not observed dispatch. Seasonal capability, renewable contributions, and typical thermal outages are already accounted for. Do not subtract them again, mix unadjusted demand with this balance, or add pre-EEA/EEA response rows. Do not transfer historical emergency thresholds into current emergency classifications.

### S2 — Geography

[ERCOT Company Profile](https://www.ercot.com/about/profile), accessed November 5, 2026, “Company Profile” and map caption. ERCOT reports about 90% of Texas electric load and approximately 75% of its land area. Label the modeled region **ERCOT**, not the entire Texas grid or every Texas customer. These are different denominators.

### S3 — Peak demand evidence investigated

[Skiles, Rhodes, and Webber, 2023 preprint](https://arxiv.org/pdf/2302.01304), submitted February 2, 2023, 28 pages. Methods pp6–7 use population-weighted degree days from eight weather-zone cities on annual peak days, 1997–2021. Figure 9, p17, describes changes through time in per-capita peak demand divided by degree days. That ratio and trend are not a validated marginal GW/°C slope for adding heat to the 2023 reference. The preprint supports attention to weather-sensitive peak demand but is not a calibration for `alpha=2`.

[Dessler, 2025, Climate Change Increases Energy Demand and Cost in Texas](https://doi.org/10.1175/WCAS-D-24-0057.1), Weather, Climate, and Society 17, 153–160; online April 16, 2025. The article's demand method concerns **daily average demand**. Its 1.9 GW 2023 annual-average increase relative to a 1950–1980 climate is not a marginal peak sensitivity. Do not relabel that number as a GW/°C coefficient. [Author's archived code/data](https://zenodo.org/records/14876128) identifies the notebooks and raw data, but no new regression was performed here.

### S4 — Heat and supply mechanism

[Allen-Dumas, KC, and Cunliff, ORNL/TM-2019/1252](https://www.energy.gov/oe/articles/oak-ridge-national-laboratory-response-grid-rfi), August 16, 2019, “Extreme Weather and Climate Vulnerabilities of the Electric Grid: A Summary of Environmental Sensitivity Quantification Methods.” Actual 27-page report opened. Table 1 and section 5.1, PDF pp10–11 (printed pp9–10), describe reduced thermoelectric capability with warmer air/water, including cooling constraints and lower turbine intake-air density. Their reviewed plant-specific rates depend on technology and location; they do not establish a single ERCOT-wide additional derating slope. In this app, beta represents only additional aggregate loss above the reference. Do not apply the report’s rates from a 15°C reference to a supply value already rated for summer.

### S5 — Demand interventions

[ERCOT Demand Response](https://www.ercot.com/services/programs/load), accessed November 5, 2026, introductory paragraphs. ERCOT describes customers reducing or modifying electricity use in response to market signals or instructions and the reliability/economic role of those services. This supports the intervention mechanism; the slider's 0–10% limit remains a chosen teaching range.

### S6 — Texas climate context

[Nielsen-Gammon et al., 2024, OSC-202401](https://climatexas.tamu.edu/products/special-reports/2024%20Climate%20Report-compressed.pdf), April 22, 2024, “Assessment of Historic and Future Trends of Extreme Weather in Texas, 1900–2036: 2024 Update.” Actual 44-page PDF opened. Executive summary PDF p3 (printed p2), framework PDF p4 (printed p3). Supports warming and changing extreme-heat frequency, with natural variability around climatological expectations. Its annual-average projections and historical comparison periods do not map this app's extra local peak heat to a date, emissions pathway, or global-mean temperature target.

## Teaching interpretation and limits

- The central lesson is compound pressure: additional heat can raise cooling demand and reduce available output. Either peak reduction or dependable capacity can improve the same algebraic balance.
- `headroomPercent` is explicitly defined here; it is not an ERCOT planning reserve margin, operational reserve calculation, or reliability standard. Prefer labels such as “modeled headroom” and “modeled gap.” Avoid outage probabilities, safe/unsafe guarantees, or forecasts of blackouts.
- Positive headroom does not establish reliability. The model omits chronological dispatch, low-wind/cloud sequences, evening solar decline, energy-limited storage, forced-outage distributions, transmission congestion, local distribution failures, humidity, adaptation, demographic/economic growth, prices, costs, and rebound or shifted demand.
- A changing baseline year would require redoing both demand and supply together and rechecking accounting. The fixed 2023 snapshot should stay visible beside results and citations.
- A one-hour capacity addition says nothing about how long that output lasts. Demand reduction must occur at the modeled coincident peak; annual energy savings cannot simply be substituted.
- Since empirical alpha/beta calibration remains unresolved, source transparency and a visible assumption sensitivity comparison are essential to an honest educational result.

## Interaction references only

[Detection and Attribution Explorer](https://aedessler.github.io/detection-and-attribution-explorer/), [group project example](https://aedessler.github.io/group_project_example/), and [public source repository](https://github.com/aedessler/detection-and-attribution-explorer), checked November 5, 2026. Lead inspected the live examples through the browser; this audit independently opened the repository listing (single index.html plus README/license). They establish the desired browser-based educational interaction level, not energy/climate parameter evidence. Do not transfer their scientific assumptions or imply endorsement.

## Audit outcome

Use the internally consistent 2023 reference and clearly assumed scenario coefficients. No publication, account change, message, or new empirical fit was performed. A newer August 2025 MORA was downloaded successfully after the web renderer returned 403, but its numerical tables were not extracted/verified; it was not used. The requested model configuration could not be independently confirmed from runtime metadata available to this audit.
