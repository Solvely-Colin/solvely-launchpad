# solvely-launchpad

Adoption-first reusable GitHub Actions + onboarding CLI for fast CI/CD rollout.

## What This Ships

- Reusable workflows pinned at `@v1`
- Standalone bootstrap CLI: `@solvely/launchpad`
- Dual-channel setup: CLI + GitHub-only setup workflow
- Preset system for 8 stacks
- Policy-as-code via `.citemplate.yml`
- Optional quality gates (opt-in)
- Fixture matrix self-tests for reliability

## Stability Contract (v1)

- Use `@v1` for all workflow references.
- `v1.x` is semver-stable and non-breaking.
- Breaking changes are reserved for `v2`.
- Deprecations are announced with at least two minor versions of overlap.

Migration details: `docs/migrations/v1.md`
Deprecation policy: `docs/policy/deprecations.md`

## 30-Second Onboarding

## 1) CLI

```bash
npx @solvely/launchpad init --preset node-lib --yes
```

Useful commands:

```bash
npx @solvely/launchpad preview --preset nextjs
npx @solvely/launchpad doctor
npx @solvely/launchpad migrate --from v1 --to v1.x
```

## 2) GitHub-only setup

Use `.github/workflows/setup.yml` with `workflow_dispatch` to generate a setup PR.

## Presets

Launch presets:

- `node-lib`
- `nextjs`
- `turbo`
- `bun`
- `pnpm-monorepo`
- `python`
- `go`
- `rust`

Preset docs are in `docs/presets/`.

## Policy-as-Code

Add `.citemplate.yml` to consumer repos:

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

Schema: `schema/citemplate.schema.json`

v1 behavior:

- Unknown top-level keys warn, not fail.
- Invalid required values fail with actionable errors.

## Reusable Workflows

## `ci.yml`

```yaml
jobs:
  ci:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/ci.yml@v1
```

## `coverage.yml`

```yaml
jobs:
  coverage:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/coverage.yml@v1
```

## `release.yml`

```yaml
jobs:
  release:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/release.yml@v1
```

## `scheduled.yml`

```yaml
jobs:
  maintenance:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/scheduled.yml@v1
```

## `commitlint.yml`

```yaml
jobs:
  commitlint:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/commitlint.yml@v1
```

## `quality-gates.yml` (opt-in)

```yaml
jobs:
  quality:
    uses: Solvely-Colin/solvely-launchpad/.github/workflows/quality-gates.yml@v1
    with:
      codeql: true
      dependency-review: true
```

## PR Feedback UX

`ci.yml` now publishes one aggregated PR comment (updated in place) with:

- check status table
- audit/license/bundle visibility
- flaky-test hints

Job summaries remain enabled for low-noise drill-down.

## Reliability

- Fixture matrix workflow: `.github/workflows/self-test-matrix.yml`
- Fixture sources: `fixtures/`
- Nightly validation scheduled

## Development

- CLI source: `cli/`
- Preset definitions: `presets/v1/`
- Docs: `docs/`
- Schema: `schema/citemplate.schema.json`

## License

MIT
