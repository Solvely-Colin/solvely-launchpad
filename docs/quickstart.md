# Quickstart

## CLI (recommended)

```bash
npx solvely-launchpad init --preset node-lib --yes
```

## GitHub-only setup

Use the `Setup Solvely Launchpad` workflow (`workflow_dispatch`) to open a setup PR.

## Policy-as-code

Create `.citemplate.yml`:

```yaml
version: 1
preset: node-lib
checks:
  required: [ci, test]
```
