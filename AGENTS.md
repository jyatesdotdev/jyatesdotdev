# jyatesdotdev Profile Repository

This repository backs the public GitHub profile at
[`github.com/jyatesdotdev`](https://github.com/jyatesdotdev). It is documentation
only: GitHub renders the root `README.md` on the user profile.

## Source of Truth

Do not infer current architecture from this repository's history. Verify claims
against the active repositories before updating the profile:

| Repository | Local path | Purpose |
| --- | --- | --- |
| Frontend | `../jyatesdotdev-site/jyatesdotdev-frontend` | React application, content, and deployment |
| API | `../jyatesdotdev-site/jyatesdotdev-api` | Go Lambda behavior and data contracts |
| Infrastructure | `../jyatesdotdev-site/jyatesdotdev-infra` | Deployed AWS resources and accepted risks |
| Integration | `../jyatesdotdev-site/jyatesdotdev-integration` | Cross-repository release tests |

The integration repository is private. The frontend, API, and infrastructure
repositories are public. A separate private bootstrap repository owns account-level
OIDC, deployment IAM, artifact storage, and Terraform state.

For personal role and career wording, use the current frontend data under
`spa/src/data/career.ts` and `spa/src/components/home.tsx`. For featured public work,
verify repository names, descriptions, and visibility with `gh repo list` rather than
guessing from old profile copy.

## Editing Guidelines

- Keep `README.md` useful as a profile first; operational detail belongs in the
  implementation repositories.
- Preserve GitHub-compatible Markdown and Mermaid syntax.
- Keep architecture claims concrete and link public repositories directly.
- Do not expose private repository URLs, AWS identifiers, credentials, or internal
  employer details that are not already intentionally public.
- Do not add application code, package managers, or deployment tooling here. A push
  to `main` updates the rendered profile without a separate deployment.

## Validation

Before committing an update:

1. Check `git diff --check` and inspect the rendered structure in the diff.
2. Validate every public Markdown link returns a successful HTTP response.
3. Confirm each Mermaid node and edge describes a resource or flow present in the
   current source.
4. Confirm `git status` contains only intentional profile documentation changes.
