// Independent worked-example calculation in integer tenths of a MW.
// Deliberately does not import the application's model or parameters.
// Inputs are transcribed from the frozen contract for a calculator cross-check.
const heatC = 4n;
const percentRemaining = 95n;
const referenceDemand = 834120n;
const referenceSupply = 919540n;
const demandSlope = 20000n;
const supplySlope = 5000n;
const addedCapacity = 20000n;

const demandBefore = referenceDemand + demandSlope * heatC;
const demandAfter = demandBefore * percentRemaining / 100n;
const supplyWithout = referenceSupply - supplySlope * heatC;
const supplyWith = supplyWithout + addedCapacity;
const headroomWithout = supplyWithout - demandBefore;
const headroomWith = supplyWith - demandAfter;
const gw = value => `${Number(value) / 10000} GW`;

console.log('Independent integer-arithmetic check: heat +4°C; reduction 5%; capacity +2 GW');
for (const [label, value] of Object.entries({
  'Demand before reduction': demandBefore,
  'Peak reduction': demandBefore - demandAfter,
  'Demand after reduction': demandAfter,
  'Supply without adaptation': supplyWithout,
  'Supply with adaptation': supplyWith,
  'Headroom without adaptation': headroomWithout,
  'Headroom with adaptation': headroomWith,
  'Shortfall without adaptation': headroomWithout < 0n ? -headroomWithout : 0n,
  'Shortfall with adaptation': headroomWith < 0n ? -headroomWith : 0n,
  'Headroom improvement': headroomWith - headroomWithout,
})) console.log(`${label}: ${gw(value)}`);
