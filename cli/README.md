# solvely-launchpad

Bootstrap and manage Solvely Launchpad workflows.

## Commands

- `init`: detect preset/package manager and generate workflows
- `preview`: show planned file operations without writing
- `doctor`: validate `.citemplate.yml` and baseline CI files
- `migrate`: apply safe migration transforms for `v1.x`

## Flags

- `--commitlint-strict true|false` (default `false`)
  - `false`: commitlint warns but does not block CI
  - `true`: commitlint failures block CI

## Examples

```bash
npx solvely-launchpad init --preset node-lib --yes
npx solvely-launchpad init --preset node-lib --yes --commitlint-strict true
npx solvely-launchpad preview --preset nextjs
npx solvely-launchpad doctor
npx solvely-launchpad migrate --from v1 --to v1.x
```
