# Worked example: combined adaptations at +4°C

This example uses the combined preset: `H = 4°C`, peak-demand reduction `r = 5%`, and added dependable capacity `C = 2 GW`. Use reference assumptions `α = 2 GW/°C` and `β = 0.5 GW/°C`. These slopes are illustrative teaching assumptions, not measured ERCOT coefficients.

Reference values are `D₀ = 83.412 GW` and `S₀ = 91.954 GW`. Let `q = r/100 = 0.05`.

## Same heat, no adaptation

```text
Dᵤ = D₀ + α × H
   = 83.412 + 2 × 4
   = 91.412 GW

Sᵤ = S₀ − β × H
   = 91.954 − 0.5 × 4
   = 89.954 GW

Mᵤ = Sᵤ − Dᵤ
   = 89.954 − 91.412
   = −1.458 GW

Fᵤ = max(0, Dᵤ − Sᵤ)
   = max(0, 1.458)
   = 1.458 GW
```

## With the combined adaptations

```text
Dₐ = (D₀ + α × H) × (1 − q)
   = (83.412 + 2 × 4) × (1 − 5/100)
   = 91.412 × 0.95
   = 86.8414 GW

Sₐ = S₀ − β × H + C
   = 91.954 − 0.5 × 4 + 2
   = 91.954 GW

Mₐ = Sₐ − Dₐ
   = 91.954 − 86.8414
   = 5.1126 GW

Fₐ = max(0, Dₐ − Sₐ)
   = max(0, −5.1126)
   = 0 GW

Demand saved = 91.412 − 86.8414 = 4.5706 GW
Headroom improvement = Mₐ − Mᵤ
                     = 5.1126 − (−1.458)
                     = 6.5706 GW
```

Because the adapted curve does not cross the boundary within the displayed 0–4°C range, its threshold text is **“No crossing within 0–4°C.”** The app does not display an extrapolated crossing outside that range. Positive modeled headroom is not a guarantee of operational reliability.

## Independent arithmetic check

`npm run check:example` runs `scripts/check-example.mjs`, which independently calculates this scenario using integer arithmetic and does not import the application model or parameter module. The implementation author reports that this check has been run. A separate human reviewer recalculating the example has **not** yet been recorded.

### Manual calculator check for a group member

Using a basic calculator, confirm each of these values from the substitutions above:

1. Unadapted demand `91.412 GW` and supply `89.954 GW`.
2. Unadapted headroom `−1.458 GW` and shortfall `1.458 GW`.
3. Adapted demand `86.8414 GW` and adapted supply `91.954 GW`.
4. Adapted headroom `5.1126 GW` and shortfall `0 GW`.
5. Demand saved `4.5706 GW` and headroom improvement `6.5706 GW`.

Record who checked it and whether all values matched in [docs/requirements-checklist.md](requirements-checklist.md) before submission.
