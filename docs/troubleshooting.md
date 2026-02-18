# Troubleshooting

## Setup workflow did not open PR

- Confirm workflow permissions include `contents: write` and `pull-requests: write`.
- Confirm branch protection allows GitHub Actions bot push.

## Policy check failed

- Ensure `.citemplate.yml` has `version` and `preset`.
- Ensure `checks.security.audit_level` is one of `critical|high|moderate|low`.

## No preset auto-detected

- CLI falls back to `node-lib`.
- Specify explicitly: `--preset <preset-id>`.

## Commitlint is failing in strict mode

- Use Conventional Commits (`feat:`, `fix:`, `chore:`).
- If you are onboarding an existing repo, set `strict: false` first.
- Later switch to strict mode after the team normalizes commit messages.

## Commitlint warns but CI stays green

- This is expected default behavior (`strict: false`).
- Enable blocking mode via `--commitlint-strict true` during init or set `strict: true` in `.github/workflows/commitlint.yml`.

## Dependency review did not run

- Expected on non-PR events (`push`, `release`, `workflow_dispatch`).
- This gate executes only in `pull_request` context.
- Check quality-gates summary for explicit skip reason.

## SLSA provenance failed

- Ensure the caller workflow permissions include:
  - `id-token: write`
  - `attestations: write`
- Re-run after permission update.

## CodeQL failed during autobuild

- Add explicit build commands for your stack before CodeQL analyze.
- Confirm project dependencies are installable in CI.

## Scorecard SARIF upload failed

- Ensure `security-events: write` permission is granted.
- Confirm repository visibility/access is compatible with Scorecard execution.
