# Quality Gates

The reusable quality gate workflow is:

- [`.github/workflows/quality-gates.yml`](../.github/workflows/quality-gates.yml)

All gates are opt-in and disabled by default.

## Inputs

- `codeql`
- `dependency-review`
- `sbom`
- `slsa-provenance`
- `ossf-scorecard`

## Required permissions

When gates are enabled, caller repos may need:

- `contents: read`
- `pull-requests: write` (dependency review comments)
- `security-events: write` (SARIF upload)
- `id-token: write` and `attestations: write` (SLSA provenance)

## Secrets and tokens

No extra secret is required by default for these gates, but private dependency sources or enterprise policies may require additional auth in caller repos.

## Failure modes and remediation

1. `dependency-review` skipped on push events: expected behavior; this gate runs on PR context.
2. CodeQL fails to autobuild: add explicit build steps in caller workflow before invoking gate.
3. SARIF upload permission errors: ensure `security-events: write` is granted.
4. SLSA provenance errors: ensure `id-token: write` and `attestations: write` are granted.
5. Scorecard rate-limit or permission issues: retry and verify repository visibility/permissions.
