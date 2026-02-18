# Troubleshooting

## Setup workflow did not open PR

- Confirm workflow permissions include `contents: write` and `pull-requests: write`.
- Confirm branch protection allows GitHub Actions bot push.

## Policy check failed

- Ensure `.citemplate.yml` has `version` and `preset`.
- Ensure `checks.security.audit_level` is one of `critical|high|moderate|low`.

## No preset auto-detected

- CLI falls back to `node-lib`.
- Specify explicitly: `--preset <preset-id>`.
