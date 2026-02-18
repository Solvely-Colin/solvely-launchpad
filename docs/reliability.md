# Reliability Dashboard

Track these metrics from [`self-test-matrix`](../.github/workflows/self-test-matrix.yml):

- fixture pass rate
- median runtime per fixture
- flaky failures per week

Recommended SLOs:

- pass rate >= 99%
- flaky rate <= 1%
- median fixture runtime <= 5 minutes

## Weekly reporting process

1. Open the latest 7 runs of `Self Test Matrix`.
2. Record pass/fail count and median runtime per fixture.
3. Log flaky failures (rerun passes without code change).
4. Add a weekly entry to this table.

| Week (UTC) | Runs | Pass Rate | Median Runtime | Flaky Incidents | Notes |
|---|---:|---:|---:|---:|---|
| 2026-02-16 | TBD | TBD | TBD | TBD | Initial baseline |
