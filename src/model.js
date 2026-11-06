import {
  ASSUMPTION_CASES, BASELINE, CONTROL_SPECS, DEFAULT_ASSUMPTIONS,
  DEFAULT_INPUTS, MODEL_SETTINGS,
} from './parameters.js';

function finiteInRange(value, min, max, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  if (value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}, inclusive.`);
  }
  return value;
}

function validateInputs(inputs) {
  if (inputs === null || typeof inputs !== 'object' || Array.isArray(inputs)) {
    throw new TypeError('inputs must be an object.');
  }
  return Object.fromEntries(Object.entries(CONTROL_SPECS).map(([key, { min, max }]) => [
    key, finiteInRange(inputs[key], min, max, key),
  ]));
}

function validateAssumptions(assumptions) {
  if (assumptions === null || typeof assumptions !== 'object' || Array.isArray(assumptions)) {
    throw new TypeError('assumptions must be an object.');
  }
  return {
    alphaGWPerC: finiteInRange(assumptions.alphaGWPerC, 1, 3, 'alphaGWPerC'),
    betaGWPerC: finiteInRange(assumptions.betaGWPerC, 0, 1, 'betaGWPerC'),
  };
}

function point({ heatC, reductionPct, addedCapacityGW }, { alphaGWPerC, betaGWPerC }) {
  const demandGW = (BASELINE.demandGW + alphaGWPerC * heatC) * (1 - reductionPct / 100);
  const supplyGW = BASELINE.supplyGW - betaGWPerC * heatC + addedCapacityGW;
  const headroomGW = supplyGW - demandGW;
  const shortfallGW = Math.max(0, -headroomGW);
  const status = Math.abs(headroomGW) <= MODEL_SETTINGS.statusToleranceGW
    ? 'at-threshold'
    : headroomGW > 0 ? 'headroom' : 'shortfall';
  return { heatC, demandGW, supplyGW, headroomGW, shortfallGW, status };
}

/** Evaluate the conditional peak balance without rounding or quantizing inputs. */
export function evaluatePoint(inputs, assumptions = DEFAULT_ASSUMPTIONS) {
  return point(validateInputs(inputs), validateAssumptions(assumptions));
}

function threshold({ reductionPct, addedCapacityGW }, { alphaGWPerC, betaGWPerC }) {
  const retainedDemand = 1 - reductionPct / 100;
  const heatC = (BASELINE.supplyGW + addedCapacityGW - BASELINE.demandGW * retainedDemand)
    / (betaGWPerC + alphaGWPerC * retainedDemand);
  const upper = CONTROL_SPECS.heatC.max;
  const endpointTolerance = 32 * Number.EPSILON * Math.max(1, upper);
  return heatC <= upper + endpointTolerance
    ? { kind: 'within-domain', heatC: Math.min(upper, heatC) }
    : { kind: 'above-domain', heatC: null };
}

/** The supported coefficient ranges guarantee a positive denominator. */
export function findThreshold(inputs, assumptions = DEFAULT_ASSUMPTIONS) {
  return threshold(validateInputs(inputs), validateAssumptions(assumptions));
}

export function evaluateModel(inputs = DEFAULT_INPUTS, assumptions = DEFAULT_ASSUMPTIONS) {
  const validInputs = validateInputs(inputs);
  const validAssumptions = validateAssumptions(assumptions);
  const unadaptedInputs = { ...validInputs, reductionPct: 0, addedCapacityGW: 0 };
  const unadapted = point(unadaptedInputs, validAssumptions);
  const adapted = point(validInputs, validAssumptions);
  const curves = Array.from({ length: MODEL_SETTINGS.curveSamples }, (_, index) => {
    // Divide integer indexes to keep exact 0 and 4 endpoints and avoid accumulated error.
    const heatC = index / 20;
    const before = point({ ...unadaptedInputs, heatC }, validAssumptions);
    const after = point({ ...validInputs, heatC }, validAssumptions);
    return {
      heatC,
      unadaptedDemandGW: before.demandGW,
      unadaptedSupplyGW: before.supplyGW,
      adaptedDemandGW: after.demandGW,
      adaptedSupplyGW: after.supplyGW,
    };
  });
  return {
    inputs: validInputs,
    assumptions: validAssumptions,
    unadapted,
    adapted,
    thresholds: {
      unadapted: threshold(unadaptedInputs, validAssumptions),
      adapted: threshold(validInputs, validAssumptions),
    },
    curves,
    adaptationBenefitGW: adapted.headroomGW - unadapted.headroomGW,
  };
}

export function evaluateSensitivity(inputs = DEFAULT_INPUTS) {
  const validInputs = validateInputs(inputs);
  return ASSUMPTION_CASES.map(({ id, label, alphaGWPerC, betaGWPerC }) => {
    const { assumptions, unadapted, adapted, thresholds } = evaluateModel(validInputs, { alphaGWPerC, betaGWPerC });
    return { id, label, assumptions, unadapted, adapted, thresholds };
  });
}
