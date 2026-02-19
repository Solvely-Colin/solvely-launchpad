# Adoption Dashboard

Primary KPI (90 days): external repos using `@v1` and `.citemplate.yml`.

## Metric definitions

- `external_repos_on_v1`: count of external repositories referencing Launchpad reusable workflows at `@v1`
- `setup_pr_merge_rate`: merged setup PRs / total setup PRs opened in the reporting week
- `time_to_first_green_ci`: median elapsed time from setup PR open to first successful CI run
- `weekly_active_repos`: adopted repos with at least one Launchpad workflow run in the last 7 days
- `issues_response_sla_met`: percentage of new issues receiving first maintainer response within 72 hours

## Source of truth

- npm installs: npm package analytics for `solvely-launchpad`
- workflow adoption: GitHub code search and/or tracked outreach list
- setup conversions: outreach board or PR tracker
- SLA: GitHub Issues timestamps
- reliability overlap: `Self Test Matrix` workflow history

## Machine-readable tracking files

- [`docs/metrics/adoption-weekly.json`](./metrics/adoption-weekly.json)
- [`docs/metrics/reliability-weekly.json`](./metrics/reliability-weekly.json)

Keep these files append-only by week to preserve historical trend visibility.

## Weekly ritual (solo-friendly)

Run:

```bash
./tooling/metrics/update-weekly.sh 2026-02-16
```

1. Pull the latest 7 days of data for all five metrics.
2. Update `docs/metrics/adoption-weekly.json` with one new weekly object.
3. Update `docs/metrics/reliability-weekly.json` from self-test matrix results.
4. Add a short weekly note in this file under `Weekly notes`.
5. If `external_repos_on_v1` is flat and `setup-blocker` issues are rising, pause outreach and fix onboarding.

## Owner checklist

- [ ] Update weekly adoption metrics JSON
- [ ] Update weekly reliability metrics JSON
- [ ] Review open `setup-blocker` issues
- [ ] Decide outreach volume for next week (cap 8-10 targets when support load is normal)
- [ ] Post weekly learnings in roadmap/progress update

## Weekly notes

- 2026-02-16 week: baseline week initialized; metrics collection process defined.
