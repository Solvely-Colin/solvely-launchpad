# solvely-launchpad

Bootstrap and manage Solvely Launchpad workflows.

## Commands

- `init`: detect preset/package manager and generate workflows
- `preview`: show planned file operations without writing
- `doctor`: validate policy + caller contract (`permissions`, `@v1` pins, quality-gates wiring hints)
- `migrate`: apply safe migration transforms for `v1.x`

## Flags

- `--commitlint-strict true|false` (default `false`)
  - `false`: commitlint warns but does not block CI
  - `true`: commitlint failures block CI
- `--profile baseline|strict|hardened` (default `baseline`)
  - `baseline`: lower-friction adoption defaults
  - `strict`: stronger baseline quality defaults
  - `hardened`: security-heavy defaults for mature repos
- `--no-release true|false` (default `false`)
  - `true`: never generate `.github/workflows/release.yml`
- `--app true|false` (alias of `--no-release`)

## Examples

```bash
npx solvely-launchpad init --preset node-lib --yes
npx solvely-launchpad init --preset node-lib --profile baseline --yes
npx solvely-launchpad init --preset node-lib --profile hardened --yes
npx solvely-launchpad init --preset node-lib --yes --commitlint-strict true
npx solvely-launchpad init --preset node-lib --yes --app true
npx solvely-launchpad preview --preset nextjs
npx solvely-launchpad doctor
npx solvely-launchpad migrate --from v1 --to v1.x
```
