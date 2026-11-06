# Manual actions before submission or publication

These items require decisions or review by the project group. The project does not claim that any of these steps has happened.

## Group and course review

1. Replace the group-name placeholders in the README with the actual member names.
2. Compare the framing and climate-risk terms with the assigned readings. Revise to match the course vocabulary; no lecture terminology has been assumed here.
3. Have a group member use the calculator checklist in [the worked example](worked-example.md), record the checked values, and note any discrepancy.
4. Have a group member review the working site against the assignment and record acceptance or specific changes needed. A draft, checklist, or automated calculation does not itself establish human acceptance.
5. Ask someone outside the group to use the site without instructions. Afterward, ask what audience they think it serves, what decision it supports, what each slider means, what they think the main takeaway is, and what confused them. Record their actual answers; do not invent feedback.

## Public GitHub Pages deployment

1. The group chooses the GitHub account and repository destination. Confirm it is the intended repository and do not overwrite an existing repository.
2. The group explicitly authorizes making the project public and publishing it. Until that authorization and destination are established, the application remains unpublished.
3. A repository maintainer places the approved project in the chosen repository and pushes it to `main`. This project has no verified repository destination or public URL yet.
4. In GitHub repository settings, set **Settings → Pages → Build and deployment → Source → GitHub Actions** if it is not already selected.
5. Allow the workflow at `.github/workflows/pages.yml` to complete. It installs from the lockfile, runs the configured checks and build, and deploys the `dist` artifact.
6. Open the deployment URL from the Pages environment and verify that the public page loads and its relative assets work at the repository's subpath. Record the verified URL.
7. Only after public access has been verified, replace the README's publication-status notice with the actual URL and current deployment status.

The intended host is **GitHub Pages**. No Site publication has been made or planned as a substitute.

## Coursework submission

The group completes and submits the required assignment materials and links through its course process. This repository does not submit coursework on the group's behalf.
