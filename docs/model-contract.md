# Scientific model contract — Texas Grid Under Heat

**Version 1.0. Approved by the lead for implementation on November 5, 2026, after the baseline and bounded source audit.** This is the canonical numerical and module-interface contract.

## Purpose and reference condition

This is a conditional educational peak-power stress test for an ERCOT resource planner. It uses a historical assessment as a reference and compares how extra local heat and two adaptations change modeled peak demand, available supply, and their gap. It is not a current forecast, an official ERCOT reliability assessment, or a prediction of blackout probability.

The reference is the **ERCOT Summer 2023 Seasonal Assessment of Resource Adequacy (SARA)**, released May 3 and revised May 5, 2023. The demand estimate uses the assessment's 2007–2021 average peak-weather reference (p. 1). Zero additional heat uses its adjusted peak demand and base resource estimate after typical thermal outages (p. 3). This is a conditional snapshot, not an observed coincident hour.

Scope is ERCOT's load and resource system, not all of Texas. Heat is an illustrative additional local summer peak-weather offset across that system relative to the weather implicit in the reference demand. It is not an annual mean temperature change. Do not assign an absolute starting temperature, future year, emissions scenario, global-warming level, or forecast interpretation.

Hold population, economic activity, equipment stock, non-temperature weather, transmission, fuel conditions, and other drivers fixed. This is a peak-power calculation in GW, not a time series, energy/storage-dispatch calculation, or cost model.

## Baseline and accounting

| Quantity | GW | Definition | Provenance |
| --- | ---: | --- | --- |
| Unadjusted peak demand | 82.739 | Source peak-demand estimate | `ERCOT_SARA_2023`, p. 3 |
| Rooftop PV adjustment | −0.432 | Already subtracted from demand | Same |
| Large flexible load adjustment | +1.105 | Already added to demand | Same |
| Adjusted demand `D0` | **83.412** | 82.739 − 0.432 + 1.105 | Same |
| Seasonal resource contribution total | 96.988 | Source resource contributions before typical thermal outages | Same |
| Typical thermal outages | −5.034 | 0.059 planned + 4.975 unplanned | Same |
| Available supply `S0` | **91.954** | 96.988 − 5.034 | Derived from the source |
| Reference headroom | **8.542** | 91.954 − 83.412 | Derived |

Source: [ERCOT Summer 2023 SARA, revised May 5, 2023](https://www.ercot.com/files/docs/2023/05/05/SARA_Summer2023_Revised.pdf). Convert MW to GW once by dividing by 1,000.

The source's seasonal resource contributions already contain rating/contribution assumptions for its resource mix, including wind, solar, and storage. Typical thermal outages are subtracted exactly once. Add no generic summer derating, second renewable credit, or second typical-outage subtraction.

Use **modeled available supply** for the line and table. This conditional total is not a guarantee that the entire fleet is firm/dependable. Only the adaptation control is called **added dependable capacity**, as defined below.

Add no Emergency Response Service, Energy Emergency Alert resources, emergency demand response, or other emergency capacity. New reduction is incremental to already adjusted demand, including the rooftop-PV and large-flexible-load accounting. Do not identify the slider with existing ERS or count an existing program again.

## Controls, defaults, assumptions, and presets

All three controls update immediately. Their ranges are experimental scenario bounds, not forecasts, confidence intervals, feasibility estimates, or policy targets.

| Key | Label | Unit | Default | Minimum | Maximum | UI step |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `heatC` | Additional local heat | °C | 3 | 0 | 4 | 0.1 |
| `reductionPct` | Peak-demand reduction | % | 0 | 0 | 10 | 0.5 |
| `addedCapacityGW` | Added dependable capacity | GW | 0 | 0 | 10 | 0.5 |

Helper text:

- Heat: “A local peak-weather offset from the model reference, not a future year or global warming level.”
- Reduction: “An extra reduction in modeled peak demand, after adding the heat response.”
- Capacity: “Extra power available during this peak; enter available contribution, not installed capacity.”

The bounded source audit did **not** establish transferable numerical ERCOT peak-demand or aggregate heat-derating coefficients for this model. The coefficients below are explicitly illustrative. The SARA supplies the baseline, not these slopes.

| Key | Meaning | Reference | Supported domain | Unit | Provenance |
| --- | --- | ---: | --- | --- | --- |
| `alphaGWPerC` | Added peak demand per degree | 2 | 1–3 | GW/°C | `ASSUMED_SLOPES` |
| `betaGWPerC` | Additional supply loss per degree | 0.5 | 0–1 | GW/°C | `ASSUMED_SLOPES` |

A secondary disclosure shows three fixed sensitivity cases at the current control settings; extra assumption sliders are unnecessary.

| ID | Label | Alpha (GW/°C) | Beta (GW/°C) |
| --- | --- | ---: | ---: |
| `lower` | Lower response | 1 | 0 |
| `reference` | Reference assumptions | 2 | 0.5 |
| `higher` | Higher response | 3 | 1 |

These paired cases are teaching comparisons, not low/central/high forecasts or statistical bounds. The API supports any alpha/beta pair within the stated domains for checks or a later assumption interface.

Presets set all three controls; reset restores defaults. The main comparison uses reference assumptions, while the sensitivity table always shows all three cases.

| ID | Label | Heat °C | Reduction % | Added GW |
| --- | --- | ---: | ---: | ---: |
| `reference` | Historical reference | 0 | 0 | 0 |
| `hotter` | More heat | 4 | 0 | 0 |
| `demand` | Reduce the peak | 4 | 5 | 0 |
| `capacity` | Add available capacity | 4 | 0 | 2 |
| `combined` | Combine adaptations | 4 | 5 | 2 |

Preset descriptions identify model scenarios, not observed events.

## Equations

Let `H=heatC`, `q=reductionPct/100`, `C=addedCapacityGW`, `alpha=alphaGWPerC`, and `beta=betaGWPerC`.

```text
Unadapted demand: D_u = D0 + alpha × H
Unadapted supply: S_u = S0 − beta × H
Adapted demand:   D_a = (D0 + alpha × H) × (1 − q)
Adapted supply:   S_a = S0 − beta × H + C

Headroom:        M = S − D
Shortfall:       F = max(0, D − S)

Demand saved       = q × (D0 + alpha × H)
Adaptation benefit = M_a − M_u = q × (D0 + alpha × H) + C
```

The unadapted comparison uses the **same H, alpha, and beta** as the adapted scenario, with only reduction and added capacity set to zero. It is distinct from the historical zero-heat reference.

Reduction applies to the entire heat-adjusted peak. A 5% reduction saves more GW at higher modeled demand. It is an incremental scenario reduction; the model does not establish participation, rebound, cost, or program feasibility.

Beta is an **incremental** supply penalty for added heat above the reference. It does not reapply seasonal ratings or ordinary thermal outages. It is an aggregate teaching assumption, not a technology-specific fleet model or measured failure probability.

C is net additional power available during the modeled peak, not nameplate capacity, annual energy, or a battery size without duration. Credit it fully by definition; do not automatically derate it again by beta. If an asset loses output under the selected conditions, its net available contribution is the value to enter.

## Threshold semantics

The boundary is **D=S**, or zero headroom.

| Status | Numerical rule | UI meaning |
| --- | --- | --- |
| `headroom` | `M > 1e-9 GW` | Supply exceeds modeled demand |
| `at-threshold` | `abs(M) <= 1e-9 GW` | Modeled boundary reached |
| `shortfall` | `M < -1e-9 GW` | Modeled demand exceeds supply |

This tolerance handles floating-point equality, not physical uncertainty. It classifies status only; retain calculated signed headroom and clamp only the inherently nonnegative shortfall. Formatting may display numerical equality as zero without changing underlying outputs.

Positive headroom does not establish adequate reserves, ramping, deliverability, or reliability. Operating reserve needs can matter before this boundary. Do not label statuses “safe,” “blackout,” “grid failure,” or an outage probability.

Demand and supply are linear. The derived shortfall `max(0,D−S)` is piecewise linear: it stays zero until demand passes supply, then increases. Threshold teaching concerns that change; do not claim nonlinear physical demand/supply functions.

For fixed adaptations:

```text
A = S0 + C − D0 × (1 − q)
B = beta + alpha × (1 − q)
M = A − B × H
H* = A / B
```

Supported inputs guarantee A>0 and B>0. There is exactly one positive mathematical crossing; multiple crossings, coincident lines, and negative crossings cannot occur. The displayed heat domain is the inclusive interval **0–4°C**.

- A calculated crossing within the inclusive 0–4°C domain returns `kind:'within-domain'` and numeric `heatC`, retaining full floating-point precision except for an ulp-scale endpoint snap (32 × machine epsilon × max(1, domain maximum)) at 4°C. This prevents an algebraically equal endpoint being classified outside the domain by roundoff.
- A crossing above 4°C returns `kind:'above-domain', heatC:null`. Display “No crossing within 0–4°C.” Do not display an exact extrapolated crossing such as 6.13°C.
- At equality the boundary is reached but shortfall is zero.
- Do not extend chart lines beyond the domain or clip valid calculated powers to hide a shortfall.

The domains retain positive powers: demand is at least 75.0708 GW; unadapted demand is at most 95.412 GW; supply ranges from 87.954 to 101.954 GW. No negative-output clipping is needed.

## Canonical parameter module

`src/parameters.js` is the sole owner of constants, bounds, presets, and source metadata. Export:

```js
BASELINE = { demandGW: 83.412, supplyGW: 91.954 };
CONTROL_SPECS = {
  heatC: { label:'Additional local heat', unit:'°C',
    min:0, max:4, step:0.1, defaultValue:3 },
  reductionPct: { label:'Peak-demand reduction', unit:'%',
    min:0, max:10, step:0.5, defaultValue:0 },
  addedCapacityGW: { label:'Added dependable capacity', unit:'GW',
    min:0, max:10, step:0.5, defaultValue:0 }
};
DEFAULT_INPUTS = { heatC:3, reductionPct:0, addedCapacityGW:0 };
DEFAULT_ASSUMPTIONS = { alphaGWPerC:2, betaGWPerC:0.5 };
ASSUMPTION_CASES = [
  { id:'lower', label:'Lower response', alphaGWPerC:1, betaGWPerC:0 },
  { id:'reference', label:'Reference assumptions', alphaGWPerC:2, betaGWPerC:0.5 },
  { id:'higher', label:'Higher response', alphaGWPerC:3, betaGWPerC:1 }
];
```

Also export `PRESETS` as an array of `{id,label,inputs}` objects, with full three-field input objects matching the preset table above. Labels may use equivalent plain-language wording.

Export `SOURCES` as an object with these stable keys and descriptive metadata. External sources have direct URLs; local assumptions omit URLs rather than inventing citations. The implemented provenance metadata in `src/parameters.js` is authoritative for schema details.

| Key | Type | URL/locator | Required note |
| --- | --- | --- | --- |
| `ERCOT_SARA_2023` | `primary` | `https://www.ercot.com/files/docs/2023/05/05/SARA_Summer2023_Revised.pdf`; p.1 weather, p.3 demand/resources/outages | Historical numerical reference, not current conditions or coefficient calibration |
| `ASSUMED_SLOPES` | `assumption` | `url:null`; this contract, Controls/defaults/assumptions | Alpha/beta values and domains are uncalibrated teaching assumptions |
| `SCENARIO_DOMAIN` | `assumption` | `url:null`; this contract, Controls/defaults/assumptions | Control bounds are experimental limits, not forecasts, targets, or feasibility estimates |

Do not give local assumption entries invented external citations. Verified mechanism sources may be added separately without falsely attributing coefficients to them.

## Canonical calculation API

`src/model.js` contains pure calculations and imports the parameter module. Powers are unrounded GW numbers. Functions do no DOM work, network requests, logging, or mutation of caller inputs/shared defaults.

### evaluatePoint(inputs, assumptions = DEFAULT_ASSUMPTIONS)

Evaluate the supplied scenario directly, including reduction and capacity:

```js
{ heatC, demandGW, supplyGW, headroomGW, shortfallGW,
  status /* 'headroom' | 'at-threshold' | 'shortfall' */ }
```

### findThreshold(inputs, assumptions = DEFAULT_ASSUMPTIONS)

Use the fixed reduction/capacity. Selected heat does not change a curve's threshold. Return:

```js
{ kind:'within-domain', heatC: /* number 0 through 4 */ }
// or
{ kind:'above-domain', heatC:null }
```

No off-domain numeric crossing is exposed.

### evaluateModel(inputs = DEFAULT_INPUTS, assumptions = DEFAULT_ASSUMPTIONS)

Return:

```js
{
  inputs: { heatC, reductionPct, addedCapacityGW },
  assumptions: { alphaGWPerC, betaGWPerC },
  unadapted: /* evaluatePoint at same heat, r=0, C=0 */,
  adapted: /* evaluatePoint at supplied inputs */,
  thresholds: {
    unadapted: /* findThreshold with r=0, C=0 */,
    adapted: /* findThreshold at supplied adaptations */
  },
  curves: [
    { heatC, unadaptedDemandGW, unadaptedSupplyGW,
      adaptedDemandGW, adaptedSupplyGW }
    // Exactly 81 points: 0, 0.05, ..., 4.
  ],
  adaptationBenefitGW // adapted headroom minus unadapted headroom
}
```

Use selected-point outputs for the table/marker; do not estimate them from sampled paths. Curves, selected values, and thresholds use identical equations/coefficients. The chart domain stays 0–4°C when a crossing lies outside it.

### evaluateSensitivity(inputs = DEFAULT_INPUTS)

Return three rows in `ASSUMPTION_CASES` order:

```js
[
  {
    id, label,
    assumptions: { alphaGWPerC, betaGWPerC },
    unadapted: /* selected point using these assumptions */,
    adapted: /* selected point using these assumptions */,
    thresholds: { unadapted, adapted }
  }
]
```

Every row uses the current three controls, not a hard-coded demonstration heat/adaptation setting.

### Validation and display

Each required field must be a finite number. Reject strings, missing fields, NaN, infinities, and out-of-domain values. Use TypeError for absent/non-number/non-finite fields, RangeError for finite values outside inclusive domains. Defaults apply only when an entire argument is omitted; do not fill partial objects silently. Extra metadata keys need not affect calculations.

Assumption bounds are alpha1–3 and beta0–1. Control bounds come from CONTROL_SPECS. Do not coerce strings, clamp inputs, quantize to UI steps, or mutate inputs. Continuous valid inputs permit exact equality checks between slider ticks.

Keep calculations unrounded. Display powers to two decimal places, approximate in-domain crossing heat to two decimals, selected native-slider heat to at most one decimal. Include “Displayed values are rounded; headroom uses unrounded values.”

When a nonzero headroom/shortfall is smaller than 0.01 GW, show “less than 0.01 GW” with its correct direction. Do not display rounded zero with a nonzero status or “−0.00”. Numerical equality alone receives zero-headroom status.

## Worked calculations

Default H=3°C, r=0%, C=0 GW, alpha=2, beta=0.5:

```text
D = 83.412 + 2 × 3       = 89.412 GW
S = 91.954 − 0.5 × 3     = 90.454 GW
M = 90.454 − 89.412      = 1.042 GW
F = max(0, −1.042)       = 0 GW
```

The selected scenarios coincide because adaptation is zero. The unadapted crossing is 8.542/2.5 = **3.4168°C**. At exactly that heat demand and supply both equal **90.2456 GW**, and status is at-threshold.

Combined preset H=4°C, r=5%, C=2 GW:

```text
Unadapted:
D_u = 83.412 + 2 × 4                  = 91.412 GW
S_u = 91.954 − 0.5 × 4                = 89.954 GW
M_u = 89.954 − 91.412                 = −1.458 GW
F_u = 1.458 GW

Adapted:
D_a = 91.412 × (1 − 5/100)            = 86.8414 GW
S_a = 89.954 + 2                      = 91.954 GW
M_a = 91.954 − 86.8414                = 5.1126 GW
F_a = 0 GW

Demand saved = 91.412 − 86.8414       = 4.5706 GW
Headroom gain = 5.1126 − (−1.458)     = 6.5706 GW
```

Adapted threshold returns `{kind:'above-domain',heatC:null}`; display “No crossing within 0–4°C,” not an exact extrapolated threshold.

Reference-assumption preset checks:

| Scenario (H,r,C) | Demand GW | Supply GW | Headroom GW | Shortfall GW | Threshold |
| --- | ---: | ---: | ---: | ---: | --- |
| Reference (0,0,0) | 83.412 | 91.954 | 8.542 | 0 | 3.4168°C |
| Default (3,0,0) | 89.412 | 90.454 | 1.042 | 0 | 3.4168°C |
| Heat (4,0,0) | 91.412 | 89.954 | −1.458 | 1.458 | 3.4168°C |
| Reduction (4,5,0) | 86.8414 | 89.954 | 3.1126 | 0 | Above domain; heat null |
| Capacity (4,0,2) | 91.412 | 91.954 | 0.542 | 0 | Above domain; heat null |
| Combined (4,5,2) | 86.8414 | 91.954 | 5.1126 | 0 | Above domain; heat null |

Sensitivity demonstration at H=4°C, r=0%, C=0 GW:

| Assumptions | Demand GW | Supply GW | Headroom GW | Shortfall GW | Threshold |
| --- | ---: | ---: | ---: | ---: | --- |
| Lower: alpha1,beta0 | 87.412 | 91.954 | 4.542 | 0 | Above domain; heat null |
| Reference: alpha2,beta0.5 | 91.412 | 89.954 | −1.458 | 1.458 | 3.4168°C |
| Higher: alpha3,beta1 | 95.412 | 87.954 | −7.458 | 7.458 | 2.1355°C |

This demonstrates that the selected shortfall depends on illustrative slopes. The current-controls sensitivity table must make that dependence visible. Do not present one numerical crossing as an empirically established ERCOT heat threshold.

## Meaningful verification

1. Independently check baseline reconciliation, default, all presets, combined example, and sensitivity rows against the arithmetic above.
2. Check equality at H=3.4168,r=0,C=0: demand=supply=90.2456, zero headroom/shortfall, at-threshold status. Check points on either side.
3. Check endpoint equality at H=4,r=0,C=1.458 under reference assumptions: threshold4 and at-threshold status. With C=1.459, require above-domain/null.
4. Check no-adaptation equality between selected scenarios across heat, and identical heat/assumptions when adaptations are nonzero.
5. Verify heat increases demand and cannot increase supply/headroom; added reduction/capacity cannot worsen headroom; higher alpha/beta cannot improve unadapted headroom at positive heat. Check the analytic benefit identity and nonnegative shortfall.
6. Check all supported corners remain physical; exactly81 curve samples include0 and4; selected/sample powers agree when heat coincides with a sample.
7. Reject bad types, missing fields, non-finite/out-of-domain values; accept continuous valid values without quantization; preserve inputs/defaults.
8. Ensure chart, table, threshold, live summary, signs, units, rounding, and small-value wording agree. Show no off-domain crossing or outage probability.

Material scientific corrections must update this contract, parameter metadata, methods copy, reference checks, and interface together. Final acceptance includes independent review of the working implementation.
