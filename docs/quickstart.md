# Quickstart

## CLI (recommended)

```bash
npx solvely-launchpad init --preset node-lib --yes
```

## GitHub-only setup

Use the `Setup Solvely Launchpad` workflow (`workflow_dispatch`) to open a setup PR.

## Auto deploy to npm on release

This repository includes [`.github/workflows/publish-launchpad.yml`](../.github/workflows/publish-launchpad.yml).

Flow:

1. Ensure `NPM_TOKEN` is set in repository secrets.
2. Create a GitHub release (for example `v0.1.1`).
3. `Publish Launchpad` runs preflight and invokes reusable release publish.
4. npm package `solvely-launchpad` is published automatically.

## Policy-as-code

Create `.citemplate.yml`:

```yaml
version: 1
preset: node-lib
checks:
  required: [ci, test]
```
