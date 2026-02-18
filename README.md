# CI/CD Template

Battle-tested CI/CD configuration extracted from [Quorum](https://github.com/Solvely-Colin/quorum). Drop this into any Solvely repo and have production-grade CI in 5 minutes.

## What's Included

### 4 Tiers of CI/CD

| Tier | Workflow | Trigger | What it does |
|------|----------|---------|--------------|
| 1 | **ci.yml** | PR + push to main | Lint, format, typecheck, build, test (Node 20+22), security audit, license check, bundle size, commitlint |
| 2 | **coverage.yml** | Push to main | Full test suite with coverage report, uploaded as artifact |
| 3 | **release.yml** | GitHub Release published | npm publish, auto release notes, post-publish smoke test |
| 4 | **scheduled.yml** | Weekly (Monday 9am UTC) | Dependency audit, stale issue cleanup |

### Also Included

- **dependabot.yml** — Weekly updates for npm + GitHub Actions, grouped by minor/patch
- **commitlint.config.js** — Enforces [Conventional Commits](https://www.conventionalcommits.org/)
- **.size-limit.json** — Bundle size budgets via [size-limit](https://github.com/ai/size-limit)
- **.lintstagedrc.json** — Pre-commit lint+format via [lint-staged](https://github.com/lint-staged/lint-staged)
- **Husky hooks** — commit-msg (commitlint) + pre-commit (lint-staged)

### Security Hardening

- All GitHub Actions pinned to full SHA (not tags)
- Scoped `permissions` on every workflow (least privilege)
- `concurrency` groups to cancel stale runs
- Timeouts on every job
- License blocklist (GPL, AGPL, SSPL, EUPL)
- Weekly security audits at `high` level, PR audits at `critical`

## Quick Start

### Option A: Automated Setup

```bash
git clone https://github.com/Solvely-Colin/ci-template.git /tmp/ci-template
/tmp/ci-template/setup.sh /path/to/your-repo
```

### Option B: Manual Copy

1. Copy `.github/` directory into your repo
2. Copy tooling configs to your repo root:
   - `tooling/commitlint.config.js` → `commitlint.config.js`
   - `tooling/.size-limit.json` → `.size-limit.json`
   - `tooling/.lintstagedrc.json` → `.lintstagedrc.json`
3. Install devDependencies:
   ```bash
   npm install -D @commitlint/cli @commitlint/config-conventional husky lint-staged size-limit @size-limit/file @vitest/coverage-v8
   ```
4. Set up husky:
   ```bash
   npx husky init
   ```
5. Copy `hooks/commit-msg` → `.husky/commit-msg` and `hooks/pre-commit` → `.husky/pre-commit`

## What to Customize

### Every project

- **`.size-limit.json`** — Update `path` and `limit` for your bundle (or remove if not shipping a bundle)
- **`release.yml`** — Replace `<package-name>` with your npm package name in the smoke test
- **`ci.yml`** — Adjust the `dist` cache path if your build output goes elsewhere

### Required `package.json` scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "build": "...",
    "test": "vitest run"
  }
}
```

### For web apps (Next.js, Astro, etc.)

- Remove the **bundle-size** job from `ci.yml`
- Replace `npm publish` in `release.yml` with your deploy command
- Remove the **smoke-test** job from `release.yml`
- Remove `size-limit` and `@size-limit/file` from devDependencies

### For CLI / npm packages

Works out of the box. Just update the package name in the smoke test.

## Required Secrets

| Secret | Where | Purpose |
|--------|-------|---------|
| `NPM_TOKEN` | GitHub repo → Settings → Secrets → Actions | npm publish in release workflow |

## Branch Protection (Recommended)

Go to **Settings → Branches → Add rule** for `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass (select: Lint, Format, Type check, Build, Tests, Security audit, License check, Lint commits)
- ✅ Require branches to be up to date
- ✅ Do not allow bypassing the above settings

## License

MIT
