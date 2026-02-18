# Proof Pack (Canonical Demo Repos)

Use this file as the single source of truth for public proof artifacts.

## Flagship real-code adopter

| Repo | Status | Notes |
|---|---|---|
| https://github.com/Solvely-Colin/Quorum | active | Public production-like codebase using Launchpad bootstrap artifacts |

## Secondary demo repos

| Preset | Repo URL | Status | Badge |
|---|---|---|---|
| node-lib | https://github.com/Solvely-Colin/launchpad-demo-node-lib | merged | https://github.com/Solvely-Colin/launchpad-demo-node-lib/actions/workflows/ci.yml/badge.svg |
| nextjs | https://github.com/Solvely-Colin/launchpad-demo-nextjs | merged | https://github.com/Solvely-Colin/launchpad-demo-nextjs/actions/workflows/ci.yml/badge.svg |
| turbo | https://github.com/Solvely-Colin/launchpad-demo-turbo | merged | https://github.com/Solvely-Colin/launchpad-demo-turbo/actions/workflows/ci.yml/badge.svg |

## Acceptance criteria

- Public repo exists for each required preset.
- Default branch CI is green.
- README includes exact setup command used.
- Launchpad workflow references `@v1`.
- Linked from main README and docs index.

## Suggested before/after evidence

- CI workflow count simplification
- PR signal quality summary (aggregated comment)
- Time-to-green comparison
