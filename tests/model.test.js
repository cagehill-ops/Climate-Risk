import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASSUMPTION_CASES, BASELINE, CONTROL_SPECS, DEFAULT_ASSUMPTIONS,
  DEFAULT_INPUTS, PARAMETER_PROVENANCE, PRESETS, SOURCES,
} from '../src/parameters.js';
import { evaluateModel, evaluatePoint, evaluateSensitivity, findThreshold } from '../src/model.js';

const close = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
};
const inputs = (heatC = 0, reductionPct = 0, addedCapacityGW = 0) => ({ heatC, reductionPct, addedCapacityGW });

test('same-case historical calibration reproduces the source arithmetic in GW', () => {
  close(BASELINE.demandGW, (82739 - 432 + 1105) / 1000);
  close(BASELINE.supplyGW, (96988 - 5034) / 1000);
  const p = evaluatePoint(inputs());
  close(p.demandGW, 83.412);
  close(p.supplyGW, 91.954);
  close(p.headroomGW, 8.542);
  assert.equal(p.shortfallGW, 0);
  assert.equal(p.status, 'headroom');
});

test('independent worked cases retain signed headroom and clamp only shortfall', () => {
  const hot = evaluatePoint(inputs(4));
  close(hot.demandGW, 91.412);
  close(hot.supplyGW, 89.954);
  close(hot.headroomGW, -1.458);
  close(hot.shortfallGW, 1.458);
  assert.equal(hot.status, 'shortfall');
  const combined = evaluatePoint(inputs(4, 5, 2));
  close(combined.demandGW, 86.8414);
  close(combined.supplyGW, 91.954);
  close(combined.headroomGW, 5.1126);
  assert.equal(combined.shortfallGW, 0);
});

test('continuous exact crossing is accepted, with the expected signs on both sides', () => {
  const crossing = findThreshold(inputs());
  assert.equal(crossing.kind, 'within-domain');
  close(crossing.heatC, 3.4168);
  const at = evaluatePoint(inputs(3.4168));
  close(at.headroomGW, 0);
  assert.equal(at.status, 'at-threshold');
  assert.equal(evaluatePoint(inputs(3.4168 - 1e-6)).status, 'headroom');
  assert.equal(evaluatePoint(inputs(3.4168 + 1e-6)).status, 'shortfall');
  assert.deepEqual(findThreshold(inputs(4, 5, 2)), { kind: 'above-domain', heatC: null });
});

test('threshold includes the domain endpoint and suppresses extrapolated crossings', () => {
  const endpointCapacity = 1.458;
  close(findThreshold(inputs(4, 0, endpointCapacity)).heatC, 4);
  assert.equal(findThreshold(inputs(4, 0, endpointCapacity)).kind, 'within-domain');
  assert.deepEqual(findThreshold(inputs(4, 0, endpointCapacity + 0.001)), { kind: 'above-domain', heatC: null });
  assert.deepEqual(findThreshold(inputs(), ASSUMPTION_CASES[0]), { kind: 'above-domain', heatC: null });
});

test('continuous endpoint equality survives floating-point rearrangement', () => {
  const atEnd = inputs(4, 0.7, 0.8181160000000176);
  assert.equal(evaluatePoint(atEnd).status, 'at-threshold');
  assert.deepEqual(findThreshold(atEnd), { kind: 'within-domain', heatC: 4 });
  assert.equal(findThreshold(inputs(4, 0.7, 0.818117)).kind, 'above-domain');
});

test('all eight control endpoint combinations agree with independent expected balances', () => {
  const expected = [
    [0, 0, 0, 83.412, 91.954, 8.542],
    [0, 0, 10, 83.412, 101.954, 18.542],
    [0, 10, 0, 75.0708, 91.954, 16.8832],
    [0, 10, 10, 75.0708, 101.954, 26.8832],
    [4, 0, 0, 91.412, 89.954, -1.458],
    [4, 0, 10, 91.412, 99.954, 8.542],
    [4, 10, 0, 82.2708, 89.954, 7.6832],
    [4, 10, 10, 82.2708, 99.954, 17.6832],
  ];
  for (const [h, r, c, demand, supply, headroom] of expected) {
    const p = evaluatePoint(inputs(h, r, c));
    close(p.demandGW, demand);
    close(p.supplyGW, supply);
    close(p.headroomGW, headroom);
    close(p.shortfallGW, Math.max(0, -headroom));
  }
});

test('unit identities and incremental adaptations hold at a continuous input', () => {
  const before = evaluatePoint(inputs(2.371));
  const reduced = evaluatePoint(inputs(2.371, 3.27));
  const added = evaluatePoint(inputs(2.371, 0, 1.234));
  close(before.demandGW - 83.412, 2 * 2.371);
  close(91.954 - before.supplyGW, 0.5 * 2.371);
  close(reduced.demandGW / before.demandGW, 0.9673);
  close(reduced.supplyGW, before.supplyGW);
  close(added.headroomGW - before.headroomGW, 1.234);
  close(added.demandGW, before.demandGW);
});

test('all assumption cases and dense control domains yield finite nonnegative power and shortfall', () => {
  for (const assumption of ASSUMPTION_CASES) {
    for (let hi = 0; hi <= 40; hi++) {
      for (const r of [0, 1.23, 5, 10]) {
        for (const c of [0, 2.17, 10]) {
          const p = evaluatePoint(inputs(hi / 10, r, c), assumption);
          for (const key of ['heatC', 'demandGW', 'supplyGW', 'headroomGW', 'shortfallGW']) assert.ok(Number.isFinite(p[key]));
          assert.ok(p.demandGW >= 0 && p.supplyGW >= 0 && p.shortfallGW >= 0);
          close(p.headroomGW, p.supplyGW - p.demandGW);
          close(p.shortfallGW, Math.max(0, -p.headroomGW));
        }
      }
    }
  }
});

test('heat increases demand, cannot increase supply or headroom, and cannot reduce shortfall', () => {
  for (const assumption of ASSUMPTION_CASES) {
    for (const r of [0, 5, 10]) {
      let previous = evaluatePoint(inputs(0, r, 1.5), assumption);
      for (let i = 1; i <= 80; i++) {
        const next = evaluatePoint(inputs(i / 20, r, 1.5), assumption);
        assert.ok(next.demandGW > previous.demandGW);
        assert.ok(next.supplyGW <= previous.supplyGW);
        assert.ok(next.headroomGW < previous.headroomGW);
        assert.ok(next.shortfallGW >= previous.shortfallGW);
        previous = next;
      }
    }
  }
});

test('reduction and dependable capacity each improve headroom and cannot worsen shortfall', () => {
  for (const assumption of ASSUMPTION_CASES) {
    for (const h of [0, 2, 4]) {
      for (const key of ['reductionPct', 'addedCapacityGW']) {
        let previous = evaluatePoint(inputs(h), assumption);
        for (let i = 1; i <= 20; i++) {
          const next = evaluatePoint({ ...inputs(h), [key]: i / 2 }, assumption);
          assert.ok(next.headroomGW > previous.headroomGW);
          assert.ok(next.shortfallGW <= previous.shortfallGW);
          previous = next;
        }
      }
      assert.equal(evaluatePoint(inputs(h, 0, 10), assumption).shortfallGW, 0);
    }
  }
});

test('model comparisons consistently use the same heat and assumptions', () => {
  const selected = inputs(4, 5, 2);
  const m = evaluateModel(selected);
  assert.deepEqual(m.unadapted, evaluatePoint(inputs(4)));
  assert.deepEqual(m.adapted, evaluatePoint(selected));
  assert.deepEqual(m.thresholds.unadapted, findThreshold(inputs(4)));
  assert.deepEqual(m.thresholds.adapted, findThreshold(selected));
  close(m.adaptationBenefitGW, 6.5706);
  close(m.adaptationBenefitGW, m.adapted.headroomGW - m.unadapted.headroomGW);
  const zero = evaluateModel(inputs(2.234));
  assert.deepEqual(zero.unadapted, zero.adapted);
  assert.equal(zero.adaptationBenefitGW, 0);
  assert.deepEqual(evaluateModel().inputs, DEFAULT_INPUTS);
  assert.deepEqual(evaluateModel().assumptions, DEFAULT_ASSUMPTIONS);
});

test('all 81 curve points match point/table evaluations including both exact endpoints', () => {
  for (const assumption of ASSUMPTION_CASES) {
    const m = evaluateModel(inputs(1.234, 4.321, 2.345), assumption);
    assert.equal(m.curves.length, 81);
    assert.equal(m.curves[0].heatC, 0);
    assert.equal(m.curves.at(-1).heatC, 4);
    for (const [i, row] of m.curves.entries()) {
      close(row.heatC, i * 0.05);
      const a = evaluatePoint(inputs(row.heatC, 4.321, 2.345), assumption);
      const u = evaluatePoint(inputs(row.heatC), assumption);
      assert.equal(row.adaptedDemandGW, a.demandGW);
      assert.equal(row.adaptedSupplyGW, a.supplyGW);
      assert.equal(row.unadaptedDemandGW, u.demandGW);
      assert.equal(row.unadaptedSupplyGW, u.supplyGW);
    }
  }
});

test('sensitivity cases match independent reference values and engine comparisons', () => {
  const rows = evaluateSensitivity(inputs(4, 5, 2));
  assert.deepEqual(rows.map(row => row.id), ['lower', 'reference', 'higher']);
  const expected = [
    { demand: 83.0414, supply: 93.954, headroom: 10.9126 },
    { demand: 86.8414, supply: 91.954, headroom: 5.1126 },
    { demand: 90.6414, supply: 89.954, headroom: -0.6874 },
  ];
  rows.forEach((row, index) => {
    close(row.adapted.demandGW, expected[index].demand);
    close(row.adapted.supplyGW, expected[index].supply);
    close(row.adapted.headroomGW, expected[index].headroom);
    const m = evaluateModel(inputs(4, 5, 2), row.assumptions);
    assert.deepEqual(row.unadapted, m.unadapted);
    assert.deepEqual(row.adapted, m.adapted);
    assert.deepEqual(row.thresholds, m.thresholds);
  });
  assert.equal(rows[0].thresholds.adapted.kind, 'above-domain');
  assert.equal(rows[2].thresholds.adapted.kind, 'within-domain');
  assert.equal(evaluateSensitivity().length, 3);
});

test('invalid control values are rejected by every public input-taking function', () => {
  for (const fn of [evaluatePoint, findThreshold, evaluateModel, evaluateSensitivity]) {
    for (const value of [null, [], 'invalid', 42]) assert.throws(() => fn(value), TypeError);
    for (const key of Object.keys(CONTROL_SPECS)) {
      for (const value of [undefined, NaN, Infinity, -Infinity, '3']) {
        assert.throws(() => fn({ ...inputs(), [key]: value }), TypeError);
      }
      for (const value of [CONTROL_SPECS[key].min - 0.001, CONTROL_SPECS[key].max + 0.001]) {
        assert.throws(() => fn({ ...inputs(), [key]: value }), RangeError);
      }
    }
  }
});

test('invalid coefficients are rejected, and valid continuous coefficients remain unquantized', () => {
  for (const fn of [evaluatePoint, findThreshold, evaluateModel]) {
    for (const value of [null, [], 'invalid', 42]) assert.throws(() => fn(inputs(), value), TypeError);
    for (const key of ['alphaGWPerC', 'betaGWPerC']) {
      for (const value of [undefined, NaN, Infinity, -Infinity, '1']) {
        assert.throws(() => fn(inputs(), { ...DEFAULT_ASSUMPTIONS, [key]: value }), TypeError);
      }
    }
    for (const [key, value] of [['alphaGWPerC', 0.999], ['alphaGWPerC', 3.001], ['betaGWPerC', -0.001], ['betaGWPerC', 1.001]]) {
      assert.throws(() => fn(inputs(), { ...DEFAULT_ASSUMPTIONS, [key]: value }), RangeError);
    }
  }
  const m = evaluateModel(inputs(1.234, 2.345, 3.456), { alphaGWPerC: 1.2345, betaGWPerC: 0.6789 });
  assert.deepEqual(m.inputs, inputs(1.234, 2.345, 3.456));
  assert.deepEqual(m.assumptions, { alphaGWPerC: 1.2345, betaGWPerC: 0.6789 });
});

test('presets and provenance distinguish historical values from all illustrative choices', () => {
  assert.equal(PRESETS.length, 5);
  for (const preset of PRESETS) assert.doesNotThrow(() => evaluateModel(preset.inputs));
  assert.equal(SOURCES.ERCOT_SARA_2023.page, 3);
  assert.equal(SOURCES.ERCOT_SARA_2023.date, '2023-05-03');
  assert.equal(SOURCES.ASSUMED_SLOPES.type, 'scenario assumption');
  assert.equal(SOURCES.SCENARIO_DOMAIN.type, 'scenario assumption');
  assert.equal(SOURCES.ASSUMED_SLOPES.url, undefined);
  assert.equal(SOURCES.SCENARIO_DOMAIN.url, undefined);
  assert.ok(PARAMETER_PROVENANCE.demandGW.conversion.includes('1000 MW'));
  assert.equal(PARAMETER_PROVENANCE.controls.values, CONTROL_SPECS);
  assert.equal(PARAMETER_PROVENANCE.controls.defaults, DEFAULT_INPUTS);
});

test('evaluations do not mutate caller inputs or shared defaults', () => {
  const selected = Object.freeze(inputs(2.1, 4.2, 3.4));
  const assumptions = Object.freeze({ alphaGWPerC: 1.7, betaGWPerC: 0.3 });
  const m = evaluateModel(selected, assumptions);
  m.inputs.heatC = 0;
  m.assumptions.alphaGWPerC = 3;
  assert.equal(selected.heatC, 2.1);
  assert.equal(assumptions.alphaGWPerC, 1.7);
  assert.equal(DEFAULT_INPUTS.heatC, 3);
  assert.equal(DEFAULT_ASSUMPTIONS.alphaGWPerC, 2);
});
