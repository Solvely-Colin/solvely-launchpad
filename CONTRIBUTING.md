# Contributing

## Development areas

- `cli/` for onboarding tooling
- `.github/workflows/` for reusable workflows and reliability automation
- `presets/v1/` for stack presets
- `docs/` for user-facing guidance

## Standards

- Preserve `@v1` contract semantics in `v1.x`.
- Keep unknown policy keys as warnings in `v1.x`.
- Add fixture coverage for new preset/workflow behavior.
- Pin third-party actions by SHA in workflows.

## Validation

Run local checks:

```bash
node ./cli/bin/launchpad.js preview --preset node-lib --yes
node ./cli/bin/launchpad.js init --preset node-lib --yes
node ./cli/bin/launchpad.js doctor
```

## External integration proposals

When proposing Launchpad adoption to another public repository, keep the PR content technical and reproducible:

1. What changes
2. Why now
3. Expected CI impact
4. Rollback path
