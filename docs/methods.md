# Methods, assumptions, and sources

## Scope and reference

This is a conditional educational stress test of **ERCOT's load and resource system**, not every Texas electric customer or a current system forecast. It compares peak demand and modeled available supply at one selected summer peak-weather condition. It does not simulate dispatch over time, energy, cost, or outage probability.

The reference is the [ERCOT Summer 2023 Seasonal Assessment of Resource Adequacy (SARA), revised May 5, 2023](https://www.ercot.com/files/docs/2023/05/05/SARA_Summer2023_Revised.pdf). Its demand estimate uses a 2007–2021 average peak-weather reference (PDF p. 1). The base and moderate reserve capacity risk table on PDF p. 3 supplies the demand and resource values below. This is a historical planning assessment, not current conditions or a coincident observed hour.

| Baseline quantity | Arithmetic | GW | Source locator and meaning |
| --- | --- | ---: | --- |
| Unadjusted peak demand estimate | 82,739 MW ÷ 1,000 | 82.739 | SARA p. 3, first scenario, forecast peak demand |
| Rooftop PV adjustment | −432 MW ÷ 1,000 | −0.432 | SARA p. 3, already subtracted from adjusted demand |
| Large flexible load adjustment | +1,105 MW ÷ 1,000 | +1.105 | SARA p. 3, already included in adjusted demand |
| Reference adjusted demand, `D₀` | (82,739 − 432 + 1,105) MW ÷ 1,000 | **83.412** | Derived from the same SARA case |
| Seasonal resource contributions | 96,988 MW ÷ 1,000 | 96.988 | SARA p. 3, resource contributions before typical thermal outages |
| Typical planned and unplanned thermal outages | −5,034 MW ÷ 1,000 | −5.034 | SARA p. 3; the reported total is 59 MW planned plus 4,975 MW unplanned |
| Reference modeled available supply, `S₀` | (96,988 − 5,034) MW ÷ 1,000 | **91.954** | Derived; subtract the typical outages once |
| Reference headroom | 91.954 − 83.412 | **8.542** | Derived as supply minus demand |

Convert MW to GW by dividing by 1,000. The resource contributions already include seasonal contribution/rating assumptions for the resource mix. The model therefore does not apply another generic summer derating, subtract typical outages twice, add a second renewable credit, or add emergency resources. The adjusted demand already contains the rooftop-PV and large-flexible-load adjustments; any modeled demand reduction is incremental to it.

## Scenario equations

Let `H` be additional local peak-weather heat in °C, `r` be the peak-demand reduction percentage, `q = r / 100`, and `C` be added dependable capacity in GW. The heat offset is relative to the weather implicit in the historical reference. It does not identify an absolute starting temperature, date, future year, emissions scenario, or global warming level.

Let `α` be the assumed demand slope in GW/°C and `β` the assumed additional supply-loss slope in GW/°C.

```text
Unadapted demand: Dᵤ = D₀ + α × H
Unadapted supply: Sᵤ = S₀ − β × H
Adapted demand:   Dₐ = (D₀ + α × H) × (1 − q)
Adapted supply:   Sₐ = S₀ − β × H + C

Headroom:         M = S − D
Shortfall:        F = max(0, D − S)
Demand saved:     q × (D₀ + α × H)
Adaptation gain:  Mₐ − Mᵤ = q × (D₀ + α × H) + C
```

The adapted and unadapted comparison uses the same `H`, `α`, and `β`; only reduction and added capacity differ. “Added dependable capacity” means the **net power available during the modeled peak**, not nameplate capacity or annual energy. Any heat-related loss to a new asset must already be reflected in the net value entered; the model does not derate it again. Reduction is applied to all heat-adjusted modeled demand and does not establish participation, rebound, cost, or feasibility.

The boundary is `D = S`. Positive headroom means modeled supply exceeds modeled demand; negative headroom means a modeled capacity gap. It says nothing by itself about operating reserves, ramping, transmission deliverability, or reliability. No result is a probability of blackout or customer outage.

For fixed adaptations, the model's headroom as a function of heat can be written:

```text
A = S₀ + C − D₀ × (1 − q)
B = β + α × (1 − q)
M = A − B × H
H* = A / B
```

The controls and coefficient domains ensure `A > 0` and `B > 0`, so there is one positive mathematical crossing. A crossing is shown only if it falls in the app's 0–4°C heat domain. Otherwise the text is “No crossing within 0–4°C”; the app does not show an extrapolated value.

## Controls and assumption status

| Input | Default | Range and step | Meaning and evidence status |
| --- | ---: | --- | --- |
| Additional local heat | 3°C | 0–4°C; 0.1°C | Scenario offset; not a warming projection or measurement resolution |
| Peak-demand reduction | 0% | 0–10%; 0.5% | Incremental reduction applied after the heat response; bounds are illustrative |
| Added dependable capacity | 0 GW | 0–10 GW; 0.5 GW | Net power available at peak; bounds are illustrative |
| Demand slope `α` | 2 GW/°C | 1–3 GW/°C | Assumed, uncalibrated scenario coefficient |
| Supply-loss slope `β` | 0.5 GW/°C | 0–1 GW/°C | Assumed, uncalibrated incremental scenario coefficient |

The bounded source audit did not establish transferable ERCOT-wide peak-demand or aggregate heat-derating coefficients. The `α` and `β` values and their domains are therefore **teaching assumptions**, not measured coefficients or achievable promises. Fixed lower `(α=1, β=0)`, reference `(2, 0.5)`, and higher `(3, 1)` pairs show sensitivity at the current controls. They are not forecasts, confidence intervals, or statistical bounds. Slider ranges, defaults, steps, presets, and curve sampling are also design choices rather than empirically measured limits.

As a scale check, the reference assumptions add about 2.4% of reference peak demand per °C and remove about 0.54% of reference available supply per °C. At the +4°C upper bound this means +8 GW demand and −2 GW supply before adaptation. These modest aggregate changes are physically interpretable experimental perturbations; they are not empirically validated ERCOT response rates. The 0–10% reduction and 0–10 GW addition let users compare interventions of several GW without asserting that they can be delivered. The 0.1°C, 0.5 percentage-point and 0.5 GW increments make changes visible without implying measurement accuracy. The +3°C default begins near the assumed crossing so users can discover it, rather than representing expected weather.

The model holds population, economic activity, equipment stock, non-temperature weather, transmission, fuel conditions, and other drivers fixed. It represents aggregate linear relationships and does not resolve specific generators or grid constraints. It does not model forced outage distributions, storage duration/dispatch, wind or solar chronology, evening solar decline, local distribution failures, humidity, costs, prices, shifted demand, or adaptation feasibility.

## Source provenance

| Source / type | Title and date | Direct source | Locator and use | Geography and period | Conversion / limitation |
| --- | --- | --- | --- | --- | --- |
| Primary historical assessment | ERCOT, *Summer 2023 Seasonal Assessment of Resource Adequacy*, released May 3, 2023; revised May 5, 2023 | [Revised PDF](https://www.ercot.com/files/docs/2023/05/05/SARA_Summer2023_Revised.pdf) · [ERCOT 2023 archive](https://www.ercot.com/gridinfo/resource/2023) | PDF p. 1: 2007–2021 average peak-weather reference. PDF p. 3: first scenario adjusted peak demand, rooftop PV and large flexible load adjustments, seasonal resource contributions, and typical planned/unplanned outages. | ERCOT region; Summer 2023 assessment, with peak-weather reference 2007–2021 | MW ÷ 1,000 = GW. Historical numerical reference only; not current conditions and not calibration for `α` or `β`. |
| Primary institutional geography source | ERCOT, “Company Profile,” accessed November 5, 2026 | [Company Profile](https://www.ercot.com/about/profile) | “Company Profile” text and map caption; describes ERCOT coverage relative to Texas. | ERCOT region / Texas; profile accessed November 5, 2026 | No numerical model input. ERCOT is not all Texas load or land area. |
| Research preprint; mechanism context | Skiles, Rhodes, and Webber, *Observations of peak electric load growth in ERCOT with the rise of electrified heating and its implications for future resource planning*, 2023; submitted February 2, 2023 | [arXiv PDF](https://arxiv.org/pdf/2302.01304) | Methods pp. 6–7 and Figure 9, p. 17: peak-weather demand analysis; does not estimate this model's marginal ERCOT-wide `α`. | Texas weather-zone cities; annual peak days, 1997–2021 | No coefficient imported. Per-capita demand divided by degree days and its trend are not this model's GW/°C heat slope. |
| Peer-reviewed article; demand context | Dessler, “Climate Change Increases Energy Demand and Cost in Texas,” *Weather, Climate, and Society* 17, 153–160; online April 16, 2025 | [Article DOI](https://doi.org/10.1175/WCAS-D-24-0057.1) · [Author code and data](https://zenodo.org/records/14876128) | Article methods concern daily-average demand; its 2023 annual-average comparison is not a marginal peak sensitivity. | Texas; article's climate comparison includes 2023 relative to 1950–1980 | No coefficient imported; 1.9 GW annual-average result is not relabeled as peak GW/°C. |
| Technical report; supply mechanism context | Allen-Dumas, KC, and Cunliff, ORNL/TM-2019/1252, *Extreme Weather and Climate Vulnerabilities of the Electric Grid: A Summary of Environmental Sensitivity Quantification Methods*, August 16, 2019 | [U.S. Department of Energy report page](https://www.energy.gov/oe/articles/oak-ridge-national-laboratory-response-grid-rfi) | Table 1 and §5.1, PDF pp. 10–11 (printed pp. 9–10): mechanisms that can reduce thermoelectric capability as air or water warms. | Reviewed plant-specific studies; no single ERCOT-wide heat slope | Mechanism context only. Do not transfer plant-specific rates or apply them again to the summer-rated baseline. |
| Primary institutional program source; intervention context | ERCOT, “Demand Response,” accessed November 5, 2026 | [ERCOT Demand Response](https://www.ercot.com/services/programs/load) | Introductory paragraphs on customer load changes in response to market signals or instructions. | ERCOT programs; accessed November 5, 2026 | Supports the intervention mechanism, not this model's 0–10% bound or realized reduction. |
| Texas climate report; context | Nielsen-Gammon et al., *Assessment of Historic and Future Trends of Extreme Weather in Texas, 1900–2036: 2024 Update*, OSC-202401, April 22, 2024 | [Report PDF](https://climatexas.tamu.edu/products/special-reports/2024%20Climate%20Report-compressed.pdf) | Executive summary PDF p. 3 (printed p. 2); framework PDF p. 4 (printed p. 3). | Texas; historical and projected trends through 2036 | Context only. Annual-average projections do not map this local peak-weather offset to a date, emissions pathway, or global temperature target. |
| Explicit model assumptions | *Texas Grid Under Heat* model contract, version 1.0, approved November 5, 2026 | [Approved model contract](model-contract.md) | “Controls, defaults, assumptions, and presets”; owns `α`, `β`, their bounds, scenario cases, controls, and numerical settings. | ERCOT-region educational stress test; offset from historical assessment reference | No external citation: slopes and scenario domain are uncalibrated teaching assumptions. |

## Display and threshold rules

Calculations retain unrounded GW values. The site displays powers to two decimal places, approximate in-domain crossing heat to two decimals, and selected slider heat to at most one decimal. Headroom classification uses unrounded values and a numerical equality tolerance of `1e-9 GW`; this tolerance handles floating-point equality and does not represent physical uncertainty. When nonzero headroom or shortfall is less than 0.01 GW in magnitude, it is displayed with its direction as “less than 0.01 GW,” rather than as a rounded zero.

**Displayed values are rounded; headroom uses unrounded values.** The shortfall is `max(0, D − S)` and is zero until modeled demand exceeds modeled supply. This piecewise-linear calculation is not a nonlinear physical grid model. Sensitivity cases show how results change under alternative assumed slopes; they are not statistical uncertainty bounds.

## Detailed audit

The supporting source and parameter audit, including its scope and material limitations, is in [docs/research.md](research.md). The canonical numerical contract, including reference checks and validation semantics, is [docs/model-contract.md](model-contract.md).
