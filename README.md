# Solvely Launchpad

[![CI](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/self-test-matrix.yml/badge.svg)](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/self-test-matrix.yml)
[![npm version](https://img.shields.io/npm/v/solvely-launchpad)](https://www.npmjs.com/package/solvely-launchpad)
[![npm downloads](https://img.shields.io/npm/dm/solvely-launchpad)](https://www.npmjs.com/package/solvely-launchpad)

Adoption-first CI/CD for open source teams.

Launchpad helps you ship a production CI/CD baseline in minutes with reusable workflows, stack presets, policy-as-code, and reliability guardrails.

## Highlights

- Reusable workflows pinned to `@v1`
- One-command onboarding: `npx solvely-launchpad init`
- GitHub-only setup flow that opens a PR
- Presets for `node-lib`, `nextjs`, `turbo`, `bun`, `pnpm-monorepo`, `python`, `go`, `rust`
- Policy-as-code via `.citemplate.yml`
- Aggregated PR feedback comment + job summaries
- Self-test fixture matrix for template reliability

## Quick Start

## CLI (recommended)

```bash
npx solvely-launchpad init --preset node-lib --yes
```

```bash
npx solvely-launchpad preview --preset nextjs
npx solvely-launchpad doctor
npx solvely-launchpad migrate --from v1 --to v1.x
```

## GitHub-only setup

Run the workflow in [`.github/workflows/setup.yml`](.github/workflows/setup.yml) via `workflow_dispatch`.
It generates a setup branch and opens a PR.

## Reusable Workflows

Pin to `@v1`:

```yaml
jobs:
  ci:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/ci.yml@v1
```

Available workflows:
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- [`.github/workflows/coverage.yml`](.github/workflows/coverage.yml)
- [`.github/workflows/release.yml`](.github/workflows/release.yml)
- [`.github/workflows/scheduled.yml`](.github/workflows/scheduled.yml)
- [`.github/workflows/commitlint.yml`](.github/workflows/commitlint.yml)
- [`.github/workflows/quality-gates.yml`](.github/workflows/quality-gates.yml) (opt-in)

## Presets

Preset definitions: [`presets/v1/`](presets/v1/)

- `node-lib`
- `nextjs`
- `turbo`
- `bun`
- `pnpm-monorepo`
- `python`
- `go`
- `rust`

## Policy-as-Code

Create `.citemplate.yml` in consumer repos:

```yaml
version: 1
preset: node-lib
checks:
  required: [ci, test]
  license:
    deny: [GPL-2.0, GPL-3.0]
  security:
    audit_level: critical
    dependency_review: false
    codeql: false
    sbom: false
    slsa_provenance: false
    ossf_scorecard: false
pr_feedback:
  enabled: true
  mode: aggregated
  flaky_hints: true
branches:
  protected: [main]
```

Schema: [`schema/citemplate.schema.json`](schema/citemplate.schema.json)

v1.x behavior:
- Unknown top-level keys warn (not fail)
- Invalid required values fail with actionable errors

## PR Feedback UX

`ci.yml` posts one aggregated PR comment (updated in-place) with:
- policy/lint/format/typecheck/build/test result table
- security/license/bundle visibility
- flaky-test hints

## Optional Quality Gates

Opt-in switches are available for:
- CodeQL
- dependency review
- SBOM
- SLSA provenance
- OSSF Scorecard

Implementation and required permissions are documented in [docs/quality-gates.md](docs/quality-gates.md).

## Auto Deploy to npm on Release

Automatic npm publish is enabled via [`.github/workflows/publish-launchpad.yml`](.github/workflows/publish-launchpad.yml).

Release flow:

1. Set repository secret `NPM_TOKEN`.
2. Create a GitHub release (example: `v0.1.1`).
3. Preflight validates token presence.
4. Reusable release workflow publishes `solvely-launchpad` and generates release notes.

## Stability Contract

For production consumers:
- Use `@v1`
- `v1.x` is semver-stable and non-breaking
- Breaking changes are reserved for `v2`
- Deprecations are announced with overlap before removal

References:
- [Migration guide](docs/migrations/v1.md)
- [Deprecation policy](docs/policy/deprecations.md)

## Governance and Reliability

- Governance setup checklist: [docs/governance.md](docs/governance.md)
- Reliability dashboard process: [docs/reliability.md](docs/reliability.md)
- Fixture matrix workflow: [`.github/workflows/self-test-matrix.yml`](.github/workflows/self-test-matrix.yml)

## Used By

Early adopters:
- This repository (`Solvely-Colin/solvely-launchpad`)

Add your repository by opening a PR.

## Docs

- [Docs index](docs/index.md)
- [Quickstart](docs/quickstart.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Reliability dashboard](docs/reliability.md)
- [Adoption dashboard](docs/adoption.md)

## Repository Structure

- [`cli/`](cli/) — onboarding CLI package
- [`presets/v1/`](presets/v1/) — preset contracts
- [`schema/`](schema/) — policy schema
- [`.github/workflows/`](.github/workflows/) — reusable + platform workflows
- [`docs/`](docs/) — docs and migration guides
- [`fixtures/`](fixtures/) — integration fixtures

## Contributing

- [Contributing guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## License

MIT
