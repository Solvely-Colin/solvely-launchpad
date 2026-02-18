# ci-template

Zero-config reusable GitHub Actions workflows. Auto-detects your project, runs the right checks.

## Quick Start

Create `.github/workflows/ci.yml` in your repo:

```yaml
name: CI
on: [push, pull_request]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    uses: Solvely-Colin/ci-template/.github/workflows/ci.yml@v1
```

That's it. It detects TypeScript, ESLint, Prettier, build scripts, monorepo setup, package manager — and runs only what applies.

## Versioning

Use `@v1` for stability. The `v1` tag tracks the latest compatible release. Avoid `@main` in production — it may contain breaking changes.

## How Auto-Detection Works

The `detect` job does a full checkout and inspects your repo before anything runs:

| Detection | How |
|-----------|-----|
| **TypeScript** | `tsconfig.json` exists |
| **ESLint** | `.eslintrc*` / `eslint.config.*` / `package.json:eslintConfig` |
| **Prettier** | `.prettierrc*` / `prettier.config.*` / `package.json:prettier` |
| **Build** | `package.json` has `build` script |
| **Tests** | `package.json` has `test` script (not the default placeholder) |
| **Bundle size** | `.size-limit.json` exists |
| **Monorepo** | `turbo.json` / `pnpm-workspace.yaml` / `lerna.json` / `nx.json` / `package.json:workspaces` |
| **Package manager** | `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm |
| **Node versions** | `.nvmrc` / `.node-version`, or default `["20","22"]` |
| **Python/Go/Rust** | `pyproject.toml` / `go.mod` / `Cargo.toml` (future use) |

Monorepos with `turbo.json` automatically use `turbo build`, `turbo test`, etc.

### Package Manager Support

All workflows respect the detected package manager (npm, pnpm, yarn). Install commands, audit commands, and build commands adapt automatically. For pnpm/yarn projects, corepack is enabled automatically.

### Overriding Detection

Any explicit input **overrides** auto-detection. Mix and match:

```yaml
jobs:
  ci:
    uses: Solvely-Colin/ci-template/.github/workflows/ci.yml@v1
    with:
      has-prettier: false        # skip even if .prettierrc exists
      test-command: 'node --test' # override detected test command
      # everything else: auto-detected
```

## Available Workflows

### `ci.yml` — PR Checks (Zero-Config)

All inputs are optional. Empty string = auto-detect.

| Input | Type | Auto-Detected From | Description |
|-------|------|--------------------|-------------|
| `node-versions` | string | `.nvmrc` / `["20","22"]` | JSON array of Node versions |
| `has-typescript` | string | `tsconfig.json` | Run typecheck |
| `has-eslint` | string | eslint config files | Run lint |
| `has-prettier` | string | prettier config files | Run format:check |
| `has-build` | string | `package.json` scripts | Run build step |
| `build-command` | string | turbo/npm/pnpm/yarn | Build command |
| `test-command` | string | turbo/npm/pnpm/yarn | Test command |
| `lint-command` | string | turbo/npm/pnpm/yarn | Lint command |
| `format-command` | string | turbo/npm/pnpm/yarn | Format command |
| `typecheck-command` | string | turbo/npm/pnpm/yarn | Typecheck command |
| `bundle-size` | string | `.size-limit.json` | Run size-limit |
| `license-check` | string | default: true | License checker |
| `security-audit` | string | default: true | Security audit |
| `audit-level` | string | default: critical | Audit severity |

**Test matrix:** Each Node version in the matrix runs its own `npm ci`/`pnpm install`/`yarn install` to avoid cross-version native module issues.

### `commitlint.yml` — Commit Linting

Works on both pull_request and push events. Uses `npx --yes @commitlint/cli` so no local devDeps are required (though you still need a `commitlint.config.js` or equivalent config).

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `package-manager` | string | `npm` | Package manager for corepack |

### `coverage.yml` — Post-Merge Coverage

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `node-version` | string | `22` | Node.js version |
| `package-manager` | string | `npm` | Package manager |
| `coverage-command` | string | `npx vitest run --coverage` | Coverage command |
| `has-build` | boolean | `true` | Run build first |
| `build-command` | string | auto | Build command |

### `release.yml` — npm Publish + Release Notes

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `node-version` | string | `22` | Node.js version |
| `package-manager` | string | `npm` | Package manager |
| `package-name` | string | **required** | npm package name |
| `smoke-test-command` | string | `''` | Custom smoke test |
| `npm-publish` | boolean | `true` | Publish to npm |

Secrets: `npm-token` (required if `npm-publish`)

### `scheduled.yml` — Weekly Maintenance

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `package-manager` | string | `npm` | Package manager |
| `stale-days` | number | `60` | Days before stale |
| `stale-close-days` | number | `14` | Days to close after stale |
| `audit-level` | string | `high` | Audit severity |
| `exempt-labels` | string | `pinned,security,enhancement` | Exempt labels |

## Concurrency

All reusable workflows include concurrency blocks that use the caller's workflow/ref context. For best results, also add concurrency to your caller workflow:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Examples

See `examples/` for ready-to-copy consumer workflows:

- **`minimal/`** — Zero-config, just works
- **`npm-package/`** — Libraries (with release, coverage, commitlint)
- **`web-app/`** — Next.js apps (override prettier/bundle-size off)
- **`monorepo/`** — Turbo monorepos (override commands)

## Reference Configs

`tooling/` and `hooks/` directories contain reference configurations:

- `tooling/commitlint.config.js` — Conventional commits
- `tooling/.lintstagedrc.json` — lint-staged
- `tooling/.size-limit.json` — Bundle size limits
- `hooks/commit-msg` — Husky commit-msg hook
- `hooks/pre-commit` — Husky pre-commit hook

## Design Principles

- **Zero-config** — Auto-detects everything, works out of the box
- **Overridable** — Any input overrides detection
- **SHA-pinned actions** — All third-party actions use commit SHAs
- **Scoped permissions** — Minimal `permissions` blocks
- **Concurrency control** — All workflows cancel in-progress runs on same ref
- **Timeouts** — Every job has a timeout
- **Multi-PM support** — npm, pnpm, and yarn work out of the box
- **Clear errors** — Missing scripts produce helpful messages, not cryptic failures

## License

MIT
