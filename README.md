# Texas Grid Under Heat

**A conditional educational peak-power stress test for an ERCOT resource planner.** The site also explains the same scenario in plain language for Texas residents. It lets visitors explore how an additional local peak-weather heat offset, incremental peak-demand reduction, and added power available at the modeled peak change a simplified demand–supply balance.

**Group members:** [Name 1], [Name 2], [Name 3] — replace these placeholders with the actual names before submission.

> **Live website: [Texas Grid Under Heat](https://cagehill-ops.github.io/Climate-Risk/)** · [Source repository](https://github.com/cagehill-ops/Climate-Risk)

Published to GitHub Pages and verified in the browser on November 5, 2026 (America/Chicago). Group names and human review items remain pending.

## What the model does

The reference is ERCOT's historical Summer 2023 Seasonal Assessment of Resource Adequacy (SARA), using the assessment's 2007–2021 peak-weather reference. At zero additional heat the model starts at 83.412 GW adjusted demand and 91.954 GW modeled available supply. Extra heat changes both quantities using explicitly assumed slopes; the two adaptation controls reduce heat-adjusted demand and add power available at the modeled peak. The model is an algebraic scenario comparison, not a current forecast or an official ERCOT reliability assessment.

The default is +3°C of **additional local peak-weather heat relative to the reference**, with no added adaptation. It is not a future year, absolute temperature, global warming level, or climate projection. The scenario bounds, presets, and heat-response coefficients are teaching choices, not measured ERCOT response rates, probability ranges, or promises that an intervention is feasible.

See [Methods, assumptions, and sources](docs/methods.md) for the complete equations and provenance, [the worked example](docs/worked-example.md) for independent arithmetic, and [the requirements checklist](docs/requirements-checklist.md) for implementation and review status. The approved detailed numerical contract is [docs/model-contract.md](docs/model-contract.md).

## Important limits

- The historical SARA snapshot is not a live or current grid forecast.
- The model holds population, economic activity, equipment, non-temperature weather, transmission, fuel, and other drivers fixed.
- It is a single peak-power balance in GW, not a time series, energy or storage-dispatch model, cost analysis, or probability of outage.
- Positive modeled headroom does not guarantee reserves, ramping, deliverability, or reliability.
- Heat-response slopes are illustrative and uncalibrated. The lower, reference, and higher cases are sensitivity comparisons, not statistical bounds.
- Typical thermal outages and renewable/seasonal resource contributions are already accounted for in the baseline. The model applies no second baseline derating, emergency-resource credit, or additional generic summer derating.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open <http://localhost:4173>. The remaining project checks are:

```sh
npm test
npm run check:example
npm run build
npm run preview
```

Stop the development server with Ctrl-C before starting preview, since both use port 4173. Alternatively, run `PORT=4174 npm run preview` in another terminal. Preview serves the built `dist` folder. The application has no runtime dependencies, API, backend, login, or analytics. Its assets and module paths are relative so it can run from a repository subdirectory.

## Deploy to GitHub Pages

The repository includes a GitHub Actions Pages workflow at [`.github/workflows/pages.yml`](.github/workflows/pages.yml). It builds and checks the site on pushes to `main` and on manual workflow dispatch, then deploys the build artifact to GitHub Pages.

Before making a repository public or pushing this project to a public destination, the group must choose the account and repository **and explicitly authorize public publication**. Do not overwrite an existing repository. After an authorized push, a repository administrator may need to set **Settings → Pages → Build and deployment → Source → GitHub Actions**. This repository is now configured to publish through GitHub Actions. The verified live address is linked above; future pushes to `main` run the same checks and deploy a new build.

## Project files

- `index.html`, `styles.css`, `src/` — site and model implementation.
- `scripts/` — local development/preview server, build, and independent worked-example checker.
- `tests/` — model checks.
- `docs/model-contract.md` — approved canonical equations, bounds, semantics, and API contract.
- `docs/research.md` — source and parameter audit.
- `docs/methods.md` — visitor-facing methods and source provenance.
- `docs/worked-example.md` — substituted example and manual calculator checklist.
- `docs/requirements-checklist.md` — delivery and human-review tracker.
- `docs/manual-actions.md` — remaining group and publication steps.

## Verification and review

See [the test and review record](docs/test-review-record.md) for the actual checks and remaining human tasks. Agent model requests and verification limits are recorded in [project-status.md](docs/project-status.md).
