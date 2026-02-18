# Governance Checklist

Some governance controls are repository settings (not code), so they must be configured in GitHub.

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
