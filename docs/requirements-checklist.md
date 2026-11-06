# Requirements and acceptance checklist

This is a delivery tracker for the known project requirements. It is not a substitute for checking the instructor's exact rubric and course terminology. The site is a local implementation; public hosting and the human review steps below remain incomplete.

| # | Requested requirement | Evidence / status |
| ---: | --- | --- |
| 1 | decision-maker/decision/course concept | Framing paragraph saved in [assignment-framing.md](assignment-framing.md). Course-specific terminology review is pending. |
| 2 | preimplementation framing paragraph saved separately, not submitted | The paragraph is saved separately in [assignment-framing.md](assignment-framing.md), before application implementation; it is marked as not submitted. |
| 3 | >=2 sliders jointly affect results | The calculation model has three scenario controls. Joint interaction verified in the actual browser, including all endpoint combinations and intermediate keyboard inputs. |
| 4 | graph/table updates immediately | Verified: native slider input immediately updates SVG, current table, threshold, summary and assumption comparison. |
| 5 | every graph/table title, labels and units | Verified in source and rendered desktop/mobile views: meaningful chart/table titles, axis/row/column labels, and °C/GW/% units. Narrow tables scroll internally. |
| 6 | issue/sliders/what to notice explained | Audience, controls, and model lesson are described in project framing and methods; site copy and worked example reviewed by the lead and separate reviewer. |
| 7 | realistic defaults/ranges with supporting sources and transparent assumption bounds | SARA values and their provenance are documented; scenario defaults/ranges and uncalibrated coefficient bounds are transparently identified as teaching choices. Human review of whether choices are appropriate is pending. |
| 8 | math behind every output | Equations, threshold semantics, display rules, and adaptation benefit are documented in [Methods](methods.md) and the approved [model contract](model-contract.md). Independent scientific/source-level software review passed; lead verified rendered calculations. |
| 9 | extreme/limiting tests | Automated tests cover equality and domain endpoints, control corners, sensitivity domains, and invalid inputs in `tests/model.test.js`. All 17 tests passed; browser endpoint combinations, presets, reset, intermediate inputs, and navigation-history regression passed. Any additional course-specific checks require group review. |
| 10 | independently checkable worked example | Full substitutions are in [worked-example.md](worked-example.md); independent integer-arithmetic script passed, and the separate reviewer recalculated the example with decimal arithmetic without the app engine. Human calculator check remains pending. |
| 11 | public GitHub Pages URL once authorized | **INCOMPLETE.** Workflow is prepared; repository destination, explicit public publication authorization, deployment, and URL verification are pending. |
| 12 | README description/live URL once available/names | README description is present. Live URL is explicitly marked **NOT PUBLISHED — pending repository destination and explicit publication authorization**. Group-name placeholders still need replacement. |
| 13 | human review and outside-person usability checklist, not claimed done | Review prompts and record fields are in [manual-actions.md](manual-actions.md). **NOT DONE:** no human acceptance or outside-person feedback is claimed. |

## Human review record

- Course readings / terminology reviewed by: **[name and date pending]**
- Worked-example calculator check by: **[name, date, matched values or issues pending]**
- Site acceptance review by: **[group member, date, issues or acceptance pending]**
- Outside-usability review by: **[reviewer description, date, notes pending]**
- Hosting account/repository and public publication authorization: **[group decision and explicit authorization pending]**
- Verified public URL after deployment: **[pending]**

Do not replace a pending item with a success claim until the group has completed and recorded it.

Local evidence: [test and review record](test-review-record.md), [independent review](independent-review.md). Public and human tasks above remain pending.
