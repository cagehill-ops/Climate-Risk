# Project status and agent configuration

Date: November 5, 2026 (America/Chicago).

The main chat cannot change or verify its model/reasoning configuration through the exposed controls. No global settings were changed.

Subagent settings are explicitly requested through the spawning tool. The tool accepts the settings but does not independently report the model that executed; these are **requested, not runtime-verified** settings.

| Responsibility | Requested model | Requested reasoning | Stage |
| --- | --- | --- | --- |
| Research and source audit | `gpt-6.1-sol` | `high` | Completed |
| Scientific model design | `gpt-6.1-sol` | `xhigh` | Completed |
| Calculation engine and model tests | `gpt-6.1-sol` | `high` | Completed |
| Interface and visualization | `gpt-6.1-terra` | `high` | Completed; lead performed browser QA |
| Independent scientific/software review | `gpt-6.1-sol` | `high` | Completed; all material findings resolved |
| Documentation and deployment preparation | `gpt-6-luna` | `high` | Completed; deployed to GitHub Pages |

No fallback has been needed. No more than three subagents run concurrently. The independent reviewer is separate from the model designer and implementation authors. No agent may publish, contact anyone, or launch additional agents.

The framing paragraph was saved before application implementation. Course readings, group names, publication destination, public deployment, human acceptance, a calculator check by a group member, outside-person usability feedback, and coursework submission remain human-controlled tasks.

Local implementation, source audit, calculation checks, independent review and lead browser QA are complete. See [test-review-record.md](test-review-record.md). Public hosting is complete: [https://cagehill-ops.github.io/Climate-Risk/](https://cagehill-ops.github.io/Climate-Risk/). See [publication-record.md](publication-record.md).
