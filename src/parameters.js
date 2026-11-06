/**
 * Historical calibration and explicitly illustrative scenario choices.
 * All power quantities used by the calculation engine are in GW.
 */
export const SOURCES = Object.freeze({
  ERCOT_SARA_2023: Object.freeze({
    title: 'ERCOT revised summer 2023 Seasonal Assessment of Resource Adequacy',
    url: 'https://www.ercot.com/files/docs/2023/05/05/SARA_Summer2023_Revised.pdf',
    date: '2023-05-03',
    filePathDate: '2023-05-05',
    page: 3,
    organization: 'ERCOT',
    locator: 'PDF p. 1 weather reference; p. 3 first scenario',
    type: 'historical assessment',
    geography: 'ERCOT region',
    referencePeriod: 'Summer 2023 assessment; peak-weather reference 2007–2021',
    note: 'Demand and available resources are from the same assessment case. Seasonal capacity contributions and typical planned/unplanned outages are already included.',
  }),
  ASSUMED_SLOPES: Object.freeze({
    title: 'Illustrative heat-response assumptions',
    type: 'scenario assumption',
    geography: 'ERCOT-region educational stress test',
    referencePeriod: 'Conditional offsets from the assessment peak-weather reference',
    note: 'Alpha and beta are assumed coefficients, not published estimates. Lower and higher cases are alternative assumptions, not a confidence interval.',
  }),
  SCENARIO_DOMAIN: Object.freeze({
    title: 'Illustrative scenario controls and numerical settings',
    type: 'scenario assumption',
    geography: 'ERCOT-region educational stress test',
    referencePeriod: 'Conditional offsets from the assessment peak-weather reference',
    note: 'Control ranges, increments, defaults, presets, and sampling are selected for this demonstration; they are not forecasts or empirically estimated bounds.',
  }),
  ERCOT_PROFILE: Object.freeze({
    "title": "ERCOT Company Profile",
    "organization": "ERCOT",
    "url": "https://www.ercot.com/about/profile",
    "date": "Accessed 2026-11-05",
    "locator": "Introduction and grid-map caption",
    "note": "About 90% of Texas electric load and approximately 75% of Texas land area; different denominators. The modeled region is ERCOT.",
    "type": "context (not coefficient calibration)"
}),
  ORNL_HEAT_2019: Object.freeze({
    "title": "Extreme Weather and Climate Vulnerabilities of the Electric Grid",
    "organization": "Allen-Dumas, KC and Cunliff; Oak Ridge National Laboratory",
    "url": "https://www.energy.gov/oe/articles/oak-ridge-national-laboratory-response-grid-rfi",
    "date": "2019-08-16",
    "locator": "ORNL/TM-2019/1252, section 5.1; printed pp. 9–10",
    "note": "Supports heat-related generation constraints, not the assumed aggregate ERCOT 0.5 GW/°C coefficient.",
    "type": "context (not coefficient calibration)"
}),
  ERCOT_DEMAND_RESPONSE: Object.freeze({
    "title": "ERCOT Demand Response",
    "organization": "ERCOT",
    "url": "https://www.ercot.com/services/programs/load",
    "date": "Accessed 2026-11-05",
    "locator": "Introductory paragraphs",
    "note": "Supports demand response as an intervention, not that 10% additional peak reduction is achievable, automatic or free.",
    "type": "context (not coefficient calibration)"
}),
  TEXAS_CLIMATE_2024: Object.freeze({
    "title": "Assessment of Historic and Future Trends of Extreme Weather in Texas: 2024 Update",
    "organization": "Nielsen-Gammon et al.; Office of the Texas State Climatologist, Texas A&M University",
    "url": "https://climatexas.tamu.edu/products/special-reports/2024%20Climate%20Report-compressed.pdf",
    "date": "2024-04-22",
    "locator": "OSC-202401, printed pp. 2–3",
    "note": "Supports changing Texas heat, not a conversion of this local peak-weather offset into a future date or global-warming level.",
    "type": "context (not coefficient calibration)"
}),
  ERCOT_PEAK_STUDY_2023: Object.freeze({
    "title": "Observations of peak electric load growth in ERCOT with the rise of electrified heating and its implications for future resource planning",
    "organization": "Skiles, Rhodes and Webber; University of Texas at Austin",
    "url": "https://arxiv.org/pdf/2302.01304",
    "date": "2023-02-02",
    "locator": "Methods pp. 6–7; Figure 9, p. 17",
    "note": "Studies weather-sensitive ERCOT peaks. Its degree-day ratios and time trends do not calibrate the assumed marginal 2 GW/°C coefficient.",
    "type": "context (not coefficient calibration)"
}),
});

export const BASELINE = Object.freeze({ demandGW: 83.412, supplyGW: 91.954 });

export const DEFAULT_INPUTS = Object.freeze({ heatC: 3, reductionPct: 0, addedCapacityGW: 0 });

export const CONTROL_SPECS = Object.freeze({
  heatC: Object.freeze({
    min: 0, max: 4, step: 0.1, defaultValue: DEFAULT_INPUTS.heatC,
    unit: '°C', label: 'Peak-weather heat offset', source: 'SCENARIO_DOMAIN',
    description: 'Local peak-weather offset above the 2007–2021 peak-weather reference implicit in the summer 2023 assessment. It is not an observed temperature, calendar date, current forecast, or global warming level.',
  }),
  reductionPct: Object.freeze({
    min: 0, max: 10, step: 0.5, defaultValue: DEFAULT_INPUTS.reductionPct,
    unit: '%', label: 'Additional peak-demand reduction', source: 'SCENARIO_DOMAIN',
    description: 'Additional reduction beyond the assessment baseline, applied to heat-adjusted demand.',
  }),
  addedCapacityGW: Object.freeze({
    min: 0, max: 10, step: 0.5, defaultValue: DEFAULT_INPUTS.addedCapacityGW,
    unit: 'GW', label: 'Added dependable capacity', source: 'SCENARIO_DOMAIN',
    description: 'Additional net power dependably available at the modeled peak, beyond the baseline. This is not nameplate capacity or a storage dispatch model.',
  }),
});

export const DEFAULT_ASSUMPTIONS = Object.freeze({ alphaGWPerC: 2, betaGWPerC: 0.5 });

export const ASSUMPTION_CASES = Object.freeze([
  Object.freeze({ id: 'lower', label: 'Lower response', alphaGWPerC: 1, betaGWPerC: 0 }),
  Object.freeze({ id: 'reference', label: 'Reference assumptions', alphaGWPerC: 2, betaGWPerC: 0.5 }),
  Object.freeze({ id: 'higher', label: 'Higher response', alphaGWPerC: 3, betaGWPerC: 1 }),
]);

export const PRESETS = Object.freeze([
  Object.freeze({ id: 'reference', label: 'Historical reference', inputs: Object.freeze({ heatC: 0, reductionPct: 0, addedCapacityGW: 0 }) }),
  Object.freeze({ id: 'hotter', label: 'Hotter peak', inputs: Object.freeze({ heatC: 4, reductionPct: 0, addedCapacityGW: 0 }) }),
  Object.freeze({ id: 'demand', label: 'Demand reduction', inputs: Object.freeze({ heatC: 4, reductionPct: 5, addedCapacityGW: 0 }) }),
  Object.freeze({ id: 'capacity', label: 'Added capacity', inputs: Object.freeze({ heatC: 4, reductionPct: 0, addedCapacityGW: 2 }) }),
  Object.freeze({ id: 'combined', label: 'Combined adaptations', inputs: Object.freeze({ heatC: 4, reductionPct: 5, addedCapacityGW: 2 }) }),
]);

export const MODEL_SETTINGS = Object.freeze({ curveSamples: 81, curveStepC: 0.05, statusToleranceGW: 1e-9 });

/** Traceable metadata covers source figures as well as all demonstration choices. */
export const PARAMETER_PROVENANCE = Object.freeze({
  demandGW: Object.freeze({
    source: 'ERCOT_SARA_2023', page: 3, type: 'derived historical assessment value',
    sourceValuesMW: Object.freeze({ forecastPeakDemand: 82739, rooftopPVForecastReduction: -432, largeFlexibleLoadAdjustment: 1105 }),
    calculation: '(82739 - 432 + 1105) / 1000 = 83.412 GW', conversion: '1000 MW = 1 GW',
    geography: 'ERCOT region', referencePeriod: 'Summer 2023; 2007–2021 peak weather',
  }),
  supplyGW: Object.freeze({
    source: 'ERCOT_SARA_2023', page: 3, type: 'derived historical assessment value',
    sourceValuesMW: Object.freeze({ totalResources: 96988, typicalPlannedAndUnplannedOutages: 5034 }),
    calculation: '(96988 - 5034) / 1000 = 91.954 GW', conversion: '1000 MW = 1 GW',
    geography: 'ERCOT region', referencePeriod: 'Summer 2023 assessment',
    note: 'Do not apply a second baseline derating or add emergency resources.',
  }),
  controls: Object.freeze({
    source: 'SCENARIO_DOMAIN', type: 'illustrative controls',
    values: CONTROL_SPECS, defaults: DEFAULT_INPUTS,
    geography: 'ERCOT-region scenario', referencePeriod: 'Conditional peak-weather offset',
    conversion: 'Reduction percent is divided by 100 before multiplying demand. Slider steps do not constrain continuous library inputs.',
  }),
  assumptions: Object.freeze({
    source: 'ASSUMED_SLOPES', type: 'illustrative coefficients',
    defaults: DEFAULT_ASSUMPTIONS, cases: ASSUMPTION_CASES,
    alphaRange: Object.freeze({ min: 1, max: 3, unit: 'GW/°C' }),
    betaRange: Object.freeze({ min: 0, max: 1, unit: 'GW/°C' }),
    geography: 'ERCOT-region scenario', referencePeriod: 'Conditional peak-weather offset',
    conversion: 'GW/°C × °C = GW',
  }),
  presets: Object.freeze({ source: 'SCENARIO_DOMAIN', type: 'illustrative scenarios', values: PRESETS }),
  numericalSettings: Object.freeze({
    source: 'SCENARIO_DOMAIN', type: 'numerical display choices', values: MODEL_SETTINGS,
    note: 'Curves include both domain endpoints. Status tolerance only classifies a point; signed headroom is retained and shortfall alone is clamped at zero.',
  }),
});
