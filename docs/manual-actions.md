# Manual actions before submission or publication

These items require decisions or review by the project group. The group/course review items below remain pending. Public publication was subsequently authorized and completed; see [publication-record.md](publication-record.md).

## Group and course review

1. Replace the group-name placeholders in the README with the actual member names.
2. Compare the framing and climate-risk terms with the assigned readings. Revise to match the course vocabulary; no lecture terminology has been assumed here.
3. Have a group member use the calculator checklist in [the worked example](worked-example.md), record the checked values, and note any discrepancy.
4. Have a group member review the working site against the assignment and record acceptance or specific changes needed. A draft, checklist, or automated calculation does not itself establish human acceptance.
5. Ask someone outside the group to use the site without instructions. Afterward, ask what audience they think it serves, what decision it supports, what each slider means, what they think the main takeaway is, and what confused them. Record their actual answers; do not invent feedback.

## Public GitHub Pages deployment — completed

The user authorized [https://github.com/cagehill-ops/Climate-Risk](https://github.com/cagehill-ops/Climate-Risk) as the public destination. GitHub Pages is enabled with **GitHub Actions** as its source. The workflow passed checks, built the static site and deployed it. The actual public website at [https://cagehill-ops.github.io/Climate-Risk/](https://cagehill-ops.github.io/Climate-Risk/) was opened and its controls checked. The README contains that verified URL.

For future changes, update the source and push to `main`; `.github/workflows/pages.yml` reruns the checks and deployment. Wait for a successful workflow and smoke-test the public URL before considering a change published. No paid service, custom domain, API key or running backend is needed.

Group names, human calculator review, acceptance, course terminology, outside-person feedback and submission remain the group's tasks. Publication does not complete those reviews.

## Coursework submission

The group completes and submits the required assignment materials and links through its course process. This repository does not submit coursework on the group's behalf.
