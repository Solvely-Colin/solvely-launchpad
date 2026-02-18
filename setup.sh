#!/bin/bash
set -euo pipefail

# Usage: ./setup.sh /path/to/target-repo
# Copies CI/CD config from this template into a target repo,
# installs devDependencies, and sets up husky git hooks.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:?Usage: ./setup.sh /path/to/target-repo}"

if [ ! -d "$TARGET" ]; then
  echo "❌ Target directory does not exist: $TARGET"
  exit 1
fi

echo "📁 Copying workflow files..."
mkdir -p "$TARGET/.github/workflows"
cp "$SCRIPT_DIR/.github/dependabot.yml" "$TARGET/.github/"
cp "$SCRIPT_DIR/.github/workflows/"*.yml "$TARGET/.github/workflows/"

echo "📁 Copying tooling configs..."
cp "$SCRIPT_DIR/tooling/commitlint.config.js" "$TARGET/"
cp "$SCRIPT_DIR/tooling/.size-limit.json" "$TARGET/"
cp "$SCRIPT_DIR/tooling/.lintstagedrc.json" "$TARGET/"

echo "📦 Installing devDependencies..."
cd "$TARGET"
npm install -D \
  @commitlint/cli \
  @commitlint/config-conventional \
  husky \
  lint-staged \
  size-limit \
  @size-limit/file \
  @vitest/coverage-v8

echo "🪝 Setting up husky..."
npx husky init
cp "$SCRIPT_DIR/hooks/commit-msg" "$TARGET/.husky/commit-msg"
cp "$SCRIPT_DIR/hooks/pre-commit" "$TARGET/.husky/pre-commit"
chmod +x "$TARGET/.husky/commit-msg" "$TARGET/.husky/pre-commit"

echo ""
echo "✅ CI/CD template installed! Customize these before your first PR:"
echo ""
echo "  📋 Checklist:"
echo "  [ ] .size-limit.json — update path and limit for your bundle"
echo "  [ ] .github/workflows/ci.yml — adjust Node versions, build output path"
echo "  [ ] .github/workflows/release.yml — set <package-name> in smoke test"
echo "  [ ] .github/workflows/coverage.yml — add Codecov/Coveralls if desired"
echo "  [ ] Add NPM_TOKEN to GitHub repo secrets (Settings → Secrets → Actions)"
echo "  [ ] package.json — ensure scripts exist: lint, format:check, typecheck, build, test"
echo "  [ ] Enable branch protection on main (require PR, require status checks)"
echo ""
echo "  For web apps (Next.js, etc.):"
echo "  [ ] Remove bundle-size job from ci.yml (or adapt for your output)"
echo "  [ ] Replace npm publish in release.yml with your deploy command"
echo "  [ ] Remove smoke-test job from release.yml"
