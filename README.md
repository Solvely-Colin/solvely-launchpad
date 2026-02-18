# Solvely Launchpad

[![Self Test Matrix](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/self-test-matrix.yml/badge.svg)](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/self-test-matrix.yml)
[![Repository CI](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/repo-ci.yml/badge.svg)](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/repo-ci.yml)
[![Publish Launchpad](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/publish-launchpad.yml/badge.svg)](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/publish-launchpad.yml)
[![npm version](https://img.shields.io/npm/v/solvely-launchpad)](https://www.npmjs.com/package/solvely-launchpad)
[![npm downloads](https://img.shields.io/npm/dm/solvely-launchpad)](https://www.npmjs.com/package/solvely-launchpad)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

**Adoption-first CI/CD platform for OSS maintainers.**

Set up reliable CI in minutes with preset-based workflows, policy-as-code, PR feedback that developers actually read, and release-grade stability (`@v1`).

## 30-Second Install

```bash
npx solvely-launchpad init --preset node-lib --yes
```

Then push your branch and open a PR.

## Why Teams Star It

- `@v1` stability contract with migration + deprecation policy
- One-command onboarding (`init`, `preview`, `doctor`, `migrate`)
- 8 launch presets that work out-of-the-box
- Policy-as-code with non-breaking v1.x compatibility behavior
- Aggregated PR summaries + job summaries for fast debugging
- Self-test fixture matrix to keep templates trustworthy
- Opt-in security gates (CodeQL, SBOM, dependency review, SLSA, OSSF Scorecard)

## Quick Start Paths

### Path A: CLI (recommended)

```bash
npx solvely-launchpad init --preset nextjs --yes
npx solvely-launchpad doctor
```

Preview before writing files:

```bash
npx solvely-launchpad preview --preset turbo
```

### Path B: GitHub-only setup

Use [`.github/workflows/setup.yml`](.github/workflows/setup.yml) (`workflow_dispatch`) to generate setup changes and open a PR without local CLI setup.

## Presets

| Preset | Best for |
|---|---|
| `node-lib` | npm/pnpm/yarn JS/TS libraries |
| `nextjs` | Next.js applications |
| `turbo` | Turborepo monorepos |
| `bun` | Bun-based projects |
| `pnpm-monorepo` | pnpm workspaces |
| `python` | Python packages/apps |
| `go` | Go modules/services |
| `rust` | Rust crates/services |

Preset definitions live in [`presets/v1/`](presets/v1/).

## Reusable Workflows (`@v1`)

```yaml
jobs:
  ci:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/ci.yml@v1
```

Available reusable workflows:

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- [`.github/workflows/coverage.yml`](.github/workflows/coverage.yml)
- [`.github/workflows/release.yml`](.github/workflows/release.yml)
- [`.github/workflows/scheduled.yml`](.github/workflows/scheduled.yml)
- [`.github/workflows/commitlint.yml`](.github/workflows/commitlint.yml)
- [`.github/workflows/quality-gates.yml`](.github/workflows/quality-gates.yml) (opt-in)

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

v1.x compatibility rules:

- Unknown keys warn (do not fail)
- Breaking schema changes are reserved for `v2`

## PR Feedback UX

`ci.yml` can post a single aggregated PR comment (updated in-place) with:

- CI check table (lint/format/type/build/test)
- policy and license notes
- security/bundle/coverage signals
- flaky-test hints

## Security + Quality Gates (Opt-in)

Enable independently via policy config:

- CodeQL
- Dependency review
- SBOM
- SLSA provenance
- OSSF Scorecard

Details: [`docs/quality-gates.md`](docs/quality-gates.md)

## Release to npm (Automated)

Release publishing is automatic via [`.github/workflows/publish-launchpad.yml`](.github/workflows/publish-launchpad.yml).

1. Add repo secret `NPM_TOKEN`
2. Merge release PR that bumps `cli/package.json`
3. Create GitHub Release (example: `v0.1.5`)
4. Workflow publishes `solvely-launchpad` and runs smoke test

## Stability Contract

- Use `@v1` in production
- `v1.x` is semver stable (no breaking contract changes)
- Deprecations are announced with overlap before removal
- Migrations are documented

References:

- [`docs/migrations/v1.md`](docs/migrations/v1.md)
- [`docs/policy/deprecations.md`](docs/policy/deprecations.md)

## Reliability + Governance

- Governance checklist: [`docs/governance.md`](docs/governance.md)
- Reliability tracking: [`docs/reliability.md`](docs/reliability.md)
- Adoption tracking: [`docs/adoption.md`](docs/adoption.md)
- Fixture CI: [`.github/workflows/self-test-matrix.yml`](.github/workflows/self-test-matrix.yml)

## Docs

- [`docs/index.md`](docs/index.md)
- [`docs/quickstart.md`](docs/quickstart.md)
- [`docs/troubleshooting.md`](docs/troubleshooting.md)
- [`docs/presets/`](docs/presets/)

## Contributing

- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`CHANGELOG.md`](CHANGELOG.md)

## License

MIT
