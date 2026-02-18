# Changelog

## Unreleased

## 0.1.3

- Replace release-triggered reusable caller with direct publish workflow to eliminate startup failures.
- Keep release and manual dispatch paths with npm token preflight, build-if-present, publish, and smoke install checks.


## 0.1.2

- Fix reusable release workflow startup and package-directory publishing reliability.

## 0.1.1

- Enable automated npm publish on GitHub release (`publish-launchpad`).
- Harden reusable release workflow for subdirectory package publishing.
- Add stable required-check gate jobs for branch protection.

- Added standalone CLI scaffold (`init`, `preview`, `doctor`, `migrate`).
- Added preset library (`presets/v1`) with 8 launch presets.
- Added policy schema (`schema/citemplate.schema.json`) and docs scaffolding.
- Added setup workflow for GitHub-only onboarding.
- Added self-test matrix workflow and fixture repositories.
- Added optional quality gates reusable workflow.
- Added policy validation + aggregated PR feedback in CI workflow.

## v1

- Initial stable reusable workflow contract.
