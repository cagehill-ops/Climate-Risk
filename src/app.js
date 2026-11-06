import { BASELINE, CONTROL_SPECS, DEFAULT_INPUTS, DEFAULT_ASSUMPTIONS, ASSUMPTION_CASES, PRESETS, SOURCES } from './parameters.js';
import { evaluateModel, evaluateSensitivity } from './model.js';

const ids = ['heatC', 'reductionPct', 'addedCapacityGW'];
const controls = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const fmt = (n, digits = 2) => Number(n).toFixed(digits);
const signed = n => n !== 0 && Math.abs(n) < 0.01 ? `${n > 0 ? '+' : '−'}<0.01` : `${n > 0 ? '+' : n < 0 ? '−' : ''}${fmt(Math.abs(n))}`;
const magnitude = n => n > 0 && n < 0.01 ? '<0.01' : fmt(n);
const scalar = n => Number.isInteger(Number(n)) ? String(Number(n)) : String(Number(n).toFixed(1));
const read = () => Object.fromEntries(ids.map(id => [id, Number(controls[id].value)]));
const status = p => p.status === 'shortfall' ? 'modeled shortfall' : p.status === 'at-threshold' ? 'demand matches modeled supply' : 'supply exceeds modeled demand';
const summary = p => `${status(p)} (${signed(p.headroomGW)} GW headroom)`;
const svgEl = (tag, attrs = {}, text = '') => { const node = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value)); if (text) node.textContent = text; return node; };

for (const id of ids) {
  const spec = CONTROL_SPECS[id], el = controls[id];
  Object.assign(el, { min: spec.min, max: spec.max, step: spec.step, value: DEFAULT_INPUTS[id] });
  document.getElementById(`${id}-bounds`).textContent = `${spec.min}–${spec.max} ${spec.unit} · steps of ${spec.step} ${spec.unit}`;
  el.addEventListener('input', render);
}
document.getElementById('reset').addEventListener('click', () => setInputs(DEFAULT_INPUTS));
for (const preset of PRESETS) {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = preset.label;
  button.addEventListener('click', () => setInputs(preset.inputs));
  document.getElementById('presets').append(button);
}
function setInputs(inputs) { for (const id of ids) controls[id].value = inputs[id]; render(); }
function thresholdText(t) { return t.kind === 'within-domain' ? `meets supply at +${fmt(t.heatC, 2)}°C` : 'does not meet supply within the displayed heat range'; }
function tableRow(label, before, after) { const tr = document.createElement('tr'); for (const [i, value] of [label, before, after].entries()) { const cell = document.createElement(i ? 'td' : 'th'); if (!i) cell.scope = 'row'; cell.textContent = value; tr.append(cell); } return tr; }
function render() {
  const inputs = read();
  for (const id of ids) { const spec = CONTROL_SPECS[id], val = scalar(inputs[id]); const display = `${id === 'heatC' && inputs[id] > 0 ? '+' : ''}${val} ${spec.unit}`; document.getElementById(`${id}-value`).textContent = display; controls[id].setAttribute('aria-valuetext', display); }
  const result = evaluateModel(inputs), {unadapted: before, adapted: after} = result;
  document.getElementById('table-heat').textContent = `at +${scalar(inputs.heatC)}°C`;
  const tbody = document.getElementById('results-body'); tbody.replaceChildren();
  for (const row of [
    ['Peak demand', `${fmt(before.demandGW)} GW`, `${fmt(after.demandGW)} GW`],
    ['Available supply', `${fmt(before.supplyGW)} GW`, `${fmt(after.supplyGW)} GW`],
    ['Signed headroom', `${signed(before.headroomGW)} GW`, `${signed(after.headroomGW)} GW`],
    ['Shortfall', `${magnitude(before.shortfallGW)} GW`, `${magnitude(after.shortfallGW)} GW`],
    ['Balance', status(before), status(after)]
  ]) tbody.append(tableRow(...row));
  document.getElementById('story-text').textContent = `At +${scalar(inputs.heatC)}°C, before adaptations: ${summary(before)}. With your adaptations: ${summary(after)}. This is a simplified balance, not a reliability guarantee.`;
  document.getElementById('threshold-note').textContent = `Within this model, demand before adaptations ${thresholdText(result.thresholds.unadapted)}; demand with adaptations ${thresholdText(result.thresholds.adapted)}. Shading marks where adapted demand exceeds supply. Lines overlap where the two cases are equal.`;
  const sens = document.getElementById('sensitivity-body'); sens.replaceChildren();
  for (const c of evaluateSensitivity(inputs)) { const tr = tableRow(c.label, `${signed(c.unadapted.headroomGW)} GW`, `${signed(c.adapted.headroomGW)} GW`); const detail = document.createElement('span'); detail.className = 'case-detail'; detail.textContent = `Demand +${scalar(c.assumptions.alphaGWPerC)} / supply −${scalar(c.assumptions.betaGWPerC)} GW per °C`; tr.firstChild.append(detail); sens.append(tr); }
  drawChart(result);
}
function drawChart(result) {
  const W=Math.max(240,document.getElementById('chart').clientWidth),H=350,L=48,R=16,T=24,B=55, curves=result.curves;
  const values=curves.flatMap(p=>[p.unadaptedDemandGW,p.unadaptedSupplyGW,p.adaptedDemandGW,p.adaptedSupplyGW]);
  const yMin=Math.floor((Math.min(...values)-1)/5)*5, yMax=Math.ceil((Math.max(...values)+1)/5)*5;
  const x = v => L+(W-L-R)*(v-CONTROL_SPECS.heatC.min)/(CONTROL_SPECS.heatC.max-CONTROL_SPECS.heatC.min);
  const y = v => T+(H-T-B)*(yMax-v)/(yMax-yMin);
  const svg=svgEl('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-labelledby':'chart-title chart-desc'});
  svg.append(svgEl('title',{id:'chart-title'},'Modeled demand and available supply across additional local heat'),svgEl('desc',{id:'chart-desc'},'Solid lines show the adapted case and dashed lines show the unadapted comparison. Demand has circular markers; available supply has square markers. Color also distinguishes them. A vertical marker indicates the selected heat. The following table provides rounded numerical values.'));
  for(let tick=yMin;tick<=yMax;tick+=5){svg.append(svgEl('line',{x1:L,x2:W-R,y1:y(tick),y2:y(tick),stroke:'#dce3dd','stroke-width':1}),svgEl('text',{x:L-10,y:y(tick)+4,'text-anchor':'end'},String(tick)));}
  for(let tick=CONTROL_SPECS.heatC.min;tick<=CONTROL_SPECS.heatC.max;tick+=1){svg.append(svgEl('text',{x:x(tick),y:H-B+20,'text-anchor':'middle'},String(tick)));}
  svg.append(svgEl('text',{x:L,y:12,class:'axis-label'},'POWER (GW)'),svgEl('text',{x:(L+W-R)/2,y:H-8,'text-anchor':'middle',class:'axis-label'},'ADDITIONAL LOCAL HEAT (°C)'));
  // Shade only intervals where adapted demand is above adapted supply, interpolating crossings.
  for(let i=0;i<curves.length-1;i++){let a=curves[i],b=curves[i+1],da=a.adaptedDemandGW-a.adaptedSupplyGW,db=b.adaptedDemandGW-b.adaptedSupplyGW;if(da<=0&&db<=0)continue; let start=a,end=b;if(da*db<0){const t=da/(da-db), cross={heatC:a.heatC+t*(b.heatC-a.heatC),adaptedDemandGW:a.adaptedDemandGW+t*(b.adaptedDemandGW-a.adaptedDemandGW),adaptedSupplyGW:a.adaptedSupplyGW+t*(b.adaptedSupplyGW-a.adaptedSupplyGW)};if(da<0)start=cross;else end=cross;}svg.append(svgEl('polygon',{points:`${x(start.heatC)},${y(start.adaptedDemandGW)} ${x(end.heatC)},${y(end.adaptedDemandGW)} ${x(end.heatC)},${y(end.adaptedSupplyGW)} ${x(start.heatC)},${y(start.adaptedSupplyGW)}`,fill:'#d9a18b',opacity:'.36'}));}
  const paths=[['unadaptedDemandGW','#a94723','7 5',2],['unadaptedSupplyGW','#177267','7 5',2],['adaptedDemandGW','#a94723','',3],['adaptedSupplyGW','#177267','',3]];
  for(const [key,color,dash,width] of paths){svg.append(svgEl('polyline',{points:curves.map(p=>`${x(p.heatC)},${y(p[key])}`).join(' '),fill:'none',stroke:color,'stroke-width':width,'stroke-dasharray':dash,'stroke-linejoin':'round'}));}
  for (const row of curves.filter((_, i) => i % 20 === 0)) {
    for (const [key, color, supply, adapted] of [['unadaptedDemandGW','#a94723',false,false],['unadaptedSupplyGW','#177267',true,false],['adaptedDemandGW','#a94723',false,true],['adaptedSupplyGW','#177267',true,true]]) {
      const cx=x(row.heatC), cy=y(row[key]);
      svg.append(supply ? svgEl('rect',{x:cx-3,y:cy-3,width:6,height:6,fill:adapted?color:'#fffef9',stroke:color,'stroke-width':1.5}) : svgEl('circle',{cx,cy,r:3,fill:adapted?color:'#fffef9',stroke:color,'stroke-width':1.5}));
    }
  }
  const selected=x(result.inputs.heatC);svg.append(svgEl('line',{x1:selected,x2:selected,y1:T,y2:H-B,stroke:'#425b56','stroke-width':1.2,'stroke-dasharray':'3 4'}));
  for(const [point,color,supply] of [[result.adapted.demandGW,'#a94723',false],[result.adapted.supplyGW,'#177267',true]])svg.append(supply ? svgEl('rect',{x:selected-5,y:y(point)-5,width:10,height:10,fill:color,stroke:'#fffef9','stroke-width':2}) : svgEl('circle',{cx:selected,cy:y(point),r:5,fill:color,stroke:'#fffef9','stroke-width':2}));
  document.getElementById('chart').replaceChildren(svg);
}
document.getElementById('assumption-summary').textContent = `${scalar(DEFAULT_ASSUMPTIONS.alphaGWPerC)} GW/°C extra demand and ${scalar(DEFAULT_ASSUMPTIONS.betaGWPerC)} GW/°C extra supply loss`;
document.getElementById('equations').textContent = `Demand = (${fmt(BASELINE.demandGW,3)} + α × additional heat) × (1 − reduction ÷ 100). Available supply = ${fmt(BASELINE.supplyGW,3)} − β × additional heat + added capacity. The reference case uses α = ${scalar(DEFAULT_ASSUMPTIONS.alphaGWPerC)} GW/°C and β = ${scalar(DEFAULT_ASSUMPTIONS.betaGWPerC)} GW/°C.`;
document.getElementById('baseline-copy').textContent = `The reference uses ${fmt(BASELINE.demandGW,3)} GW adjusted forecast demand and ${fmt(BASELINE.supplyGW,3)} GW modeled available supply after typical outages, from the same Summer 2023 SARA scenario (page 3). Its peak forecast used 2007–2021 summer-peak weather conditions; the model does not represent a particular city temperature.`;
render();

for (const source of Object.values(SOURCES).filter(source => source.url)) {
  const li = document.createElement("li"), a = document.createElement("a");
  a.href = source.url; a.textContent = source.title; li.append(a);
  const detail = document.createElement("span"); detail.textContent = ` · ${source.organization || "ERCOT"}, ${source.date}. ${source.locator || "PDF page 3"}. ${source.note}`; li.append(detail);
  document.getElementById("source-list").append(li);
}

window.addEventListener("resize", render);
// Browsers can restore form values after initial module execution on history return.
// Reconcile the visible controls with every output after that restoration.
window.addEventListener('pageshow', () => requestAnimationFrame(render));
window.addEventListener('popstate', () => requestAnimationFrame(render));
