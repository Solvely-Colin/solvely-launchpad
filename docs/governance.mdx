# Governance Checklist

Some governance controls are repository settings (not code), so they must be configured in GitHub.

## Beta support policy

- Support channel: GitHub Issues
- Scope: Launchpad beta features and onboarding flows
- Response expectation: best effort within 72 hours
- Escalation: issues tagged `setup-blocker` should be handled before new outbound pushes

## Triage labels

Create and use these labels consistently:

- `setup-blocker`: install/bootstrap path fails for a consumer repo
- `preset-gap`: preset does not fit real project shape or defaults
- `docs-gap`: docs missing, misleading, or unclear
- `quality-gate`: CodeQL/dependency review/SBOM/SLSA/Scorecard integration issues

Canonical label definitions are stored in:

- [`.github/labels.yml`](../.github/labels.yml)

## Branch protection for `main`

Configure branch protection to require at least:

- `Self Test Matrix / fixtures`
- primary CI check from your caller workflow

Recommended settings:

- require pull request before merge
- require status checks to pass
- restrict direct pushes to `main`

## Secrets

Required for automatic npm publish on release:

- `NPM_TOKEN` (repository secret)

## Release flow

- create GitHub release (`vX.Y.Z`)
- `publish-launchpad.yml` preflight validates `NPM_TOKEN`
- reusable release workflow publishes to npm and generates notes

## Setup workflow behavior in non-owner repos

For forks and protected branches:

- ensure `contents: write` and `pull-requests: write` are granted to `GITHUB_TOKEN`
- ensure bot pushes to setup branch are permitted
- if direct push is blocked by org policy, run setup locally with CLI and open PR manually

## Launch reliability gate

Before broad promotion, require:

- self-test matrix pass rate >= 95% over rolling 7 days
- no unresolved `setup-blocker` older than 72 hours
