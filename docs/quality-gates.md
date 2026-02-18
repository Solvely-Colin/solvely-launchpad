# Quality Gates

The reusable quality gate workflow is:

- [`.github/workflows/quality-gates.yml`](../.github/workflows/quality-gates.yml)

All gates are opt-in and disabled by default.

## Enable gates

You can enable gates either from `ci.yml` inputs or from `.citemplate.yml`:

```yaml
checks:
  security:
    dependency_review: true
    sbom: true
    codeql: false
    slsa_provenance: false
    ossf_scorecard: false
```

`ci.yml` merges both sources and enables a gate when either source sets it to `true`.

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
- `security-events: write` (CodeQL/Scorecard SARIF upload)
- `id-token: write` and `attestations: write` (SLSA provenance)

## Gate reference

### CodeQL

Purpose: static code security analysis.

Common failure: autobuild fails.

Remediation: add explicit build steps before/around CodeQL in the caller workflow.

### Dependency Review

Purpose: detect risky dependency changes on PRs.

Execution rule: runs only in `pull_request` context. On push/release/dispatch it is skipped with reason.

Common failure: denied package/license policy.

Remediation: inspect PR dependency diff and adjust dependency policy/allowlist.

### SBOM

Purpose: generate SPDX JSON SBOM artifact.

Common failure: repository content resolution/generation error.

Remediation: ensure workflow can read repository contents and rerun.

### SLSA Provenance

Purpose: generate build provenance attestation.

Common failure: missing `id-token` or `attestations` permission.

Remediation: grant required permissions in caller workflow.

### OSSF Scorecard

Purpose: repository supply-chain posture scan.

Common failure: SARIF upload or permission error.

Remediation: ensure `security-events: write` and repository accessibility.

## Summary outputs

Each run writes a job summary table with:

- gate enabled state
- whether it executed
- status (`success|failure|skipped`)
- skip/failure reason

This makes non-PR skips and policy-driven behavior explicit.
