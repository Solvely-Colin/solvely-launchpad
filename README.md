# Solvely Launchpad

[![Repository CI](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/repo-ci.yml/badge.svg)](https://github.com/Solvely-Colin/solvely-launchpad/actions/workflows/repo-ci.yml)
[![npm version](https://img.shields.io/npm/v/solvely-launchpad)](https://www.npmjs.com/package/solvely-launchpad)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

**CI/CD toolkit for OSS maintainers.**

Most OSS repos waste time on copy-pasted workflows and noisy CI output.
Launchpad gives you a stable `@v1` baseline with presets, policy-as-code, and high-signal PR summaries.

## 30-Second Install

```bash
npx solvely-launchpad init --preset node-lib --yes
```

Then push your branch and open a PR.

## Why Launchpad

- Stable reusable workflow contract at `@v1`
- One-command onboarding (`init`, `preview`, `doctor`, `migrate`)
- 8 launch presets (Node, Next.js, Turbo, Bun, pnpm monorepo, Python, Go, Rust)
- Policy-as-code via `.citemplate.yml`
- Aggregated PR summaries to cut debug time
- Opt-in security gates (CodeQL, dependency review, SBOM, SLSA, OSSF Scorecard)

## Quick Start

### CLI (recommended)

```bash
npx solvely-launchpad init --preset nextjs --yes
npx solvely-launchpad doctor
```

Preview before writing files:

```bash
npx solvely-launchpad preview --preset turbo
```

### GitHub-only setup

Use [`.github/workflows/setup.yml`](.github/workflows/setup.yml) (`workflow_dispatch`) to open a setup PR without local CLI installation.

## Commit Quality (Base + Strict)

Launchpad now ships a base commitlint setup for commitlint-enabled presets:

- Generates `commitlint.config.cjs`
- Uses non-blocking mode by default (`strict: false`)
- Supports strict mode when teams are ready

Strict mode during init:

```bash
npx solvely-launchpad init --preset node-lib --yes --commitlint-strict true
```

Generated `commitlint.yml` can also be edited directly:

```yaml
jobs:
  commitlint:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/commitlint.yml@v1
    with:
      strict: false
```

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

Preset definitions: [`presets/v1/`](presets/v1/)

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

```yaml
version: 1
preset: node-lib
checks:
  required: [ci, test]
  security:
    audit_level: critical
    dependency_review: true
    sbom: true
    codeql: false
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

## PR Feedback UX

Launchpad updates one comment per PR (no spam), with CI outcomes in one table.

```md
## Solvely Launchpad Summary
| Check | Result |
|---|---|
| Policy | success |
| Lint | success |
| Tests | failure |
| Quality gates | success |
```

## Security Gates (Opt-in)

Enable independently:

- CodeQL
- Dependency review
- SBOM
- SLSA provenance
- OSSF Scorecard

Details: [`docs/quality-gates.md`](docs/quality-gates.md)

## Release to npm (Automated)

Release publishing is automatic via [`.github/workflows/publish-launchpad.yml`](.github/workflows/publish-launchpad.yml).

1. Add repo secret `NPM_TOKEN`
2. Merge release PR bumping `cli/package.json`
3. Create a GitHub Release tag (example: `v0.1.6`)
4. Publish + smoke test run automatically
5. On stable releases, Launchpad also re-points workflow channel tag `v1` to that release commit automatically

If your org blocks force-updating tags, the `sync-v1-tag` job will fail with a clear error. In that case, allow GitHub Actions to update tags or run a one-time admin tag update flow.

## Stability Contract

- Use `@v1` in production
- `v1.x` is semver-stable
- Breaking changes are reserved for `v2`
- Deprecations are announced before removal

References:

- [`docs/migrations/v1.md`](docs/migrations/v1.md)
- [`docs/policy/deprecations.md`](docs/policy/deprecations.md)

## Docs

- [Docs index](docs/index.md)
- [Quickstart](docs/quickstart.md)
- [Troubleshooting](docs/troubleshooting.md)
- [All docs](docs/)

## Contributing

- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`CHANGELOG.md`](CHANGELOG.md)

## License

MIT
