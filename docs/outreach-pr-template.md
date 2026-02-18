# Outbound Setup PR Template

Use this when opening Launchpad setup PRs in external repositories.

## What changes

- Add Solvely Launchpad reusable CI workflows pinned to `@v1`
- Add/adjust `.citemplate.yml` for repo policy defaults
- Keep existing project build/test commands intact

## Why now

- Reduces CI duplication and maintenance overhead
- Improves PR signal with aggregated checks
- Adds optional policy/security controls without forcing strict gates

## Expected CI impact

- CI definition is standardized and easier to reason about
- Existing checks continue to run, but with cleaner workflow structure
- No production runtime behavior changes

## Rollback path

- Revert this PR commit(s)
- Restore previous workflow files
- Remove `.citemplate.yml` if introduced

## Validation performed

- [ ] Setup command/path completed successfully
- [ ] First CI run is green or has actionable failures only
- [ ] Workflow references use `@v1` (not `@main`)
