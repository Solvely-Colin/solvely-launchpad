#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh CLI is required" >&2
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required" >&2
  exit 1
fi

if [ "${1:-}" = "" ]; then
  echo "usage: $0 <week_start_utc_YYYY-MM-DD>" >&2
  exit 1
fi

week_start="$1"
repo="Solvely-Colin/solvely-launchpad"
start_ts="${week_start}T00:00:00Z"

afile="docs/metrics/adoption-weekly.json"
rfile="docs/metrics/reliability-weekly.json"

# Reliability metrics from self-test workflow runs.
api_tmp=$(mktemp)
gh api -X GET \
  "repos/${repo}/actions/workflows/self-test-matrix.yml/runs" \
  -f per_page=100 \
  -f created=">=${start_ts}" > "$api_tmp"

self_test_runs=$(jq '.workflow_runs | length' "$api_tmp")
self_test_success=$(jq '[.workflow_runs[] | select(.conclusion=="success")] | length' "$api_tmp")
median_runtime=$(jq -r '[.workflow_runs[] | select(.status=="completed" and .run_started_at!=null and .updated_at!=null) | ((.updated_at|fromdateiso8601)-(.run_started_at|fromdateiso8601))/60 ] | sort | if length==0 then null elif (length%2)==1 then .[length/2|floor] else ((.[length/2-1]+.[length/2])/2) end' "$api_tmp")

if [ "$self_test_runs" -gt 0 ]; then
  self_test_pass_rate=$(awk -v s="$self_test_success" -v r="$self_test_runs" 'BEGIN { printf "%.2f", (s/r)*100 }')
else
  self_test_pass_rate="0.00"
fi

rolling_gate=false
awk -v p="$self_test_pass_rate" 'BEGIN{ if (p+0 >= 95) exit 0; else exit 1 }' && rolling_gate=true || rolling_gate=false

rm -f "$api_tmp"

# Adoption baseline count from code search.
q='"Solvely-Colin/solvely-launchpad/.github/workflows/" "@v1" path:.github/workflows language:YAML -repo:Solvely-Colin/solvely-launchpad'
code_resp=$(gh api -X GET search/code -f q="$q" -f per_page=100)
external_repos_on_v1=$(echo "$code_resp" | jq -r '[.items[].repository.full_name] | unique | length')

# Upsert adoption week row.
atmp=$(mktemp)
jq \
  --arg wk "$week_start" \
  --arg today "$(date -u +%Y-%m-%d)" \
  --argjson ext "$external_repos_on_v1" \
  '
  .weeks = (
    [ .weeks[] | select(.week_start != $wk) ] +
    [
      (
        (.weeks[] | select(.week_start == $wk))
        // {
          week_start: $wk,
          external_repos_on_v1: null,
          setup_pr_merge_rate: null,
          time_to_first_green_ci_hours: null,
          weekly_active_repos: null,
          issues_response_sla_met: null,
          notes: ""
        }
      )
      | .external_repos_on_v1 = $ext
      | .notes = ("Updated via tooling/metrics/update-weekly.sh on " + $today)
    ]
  )
  | .weeks |= sort_by(.week_start)
  ' "$afile" > "$atmp"
mv "$atmp" "$afile"

# Upsert reliability week row.
rtmp=$(mktemp)
jq \
  --arg wk "$week_start" \
  --arg today "$(date -u +%Y-%m-%d)" \
  --argjson runs "$self_test_runs" \
  --argjson pass "$self_test_pass_rate" \
  --argjson med "${median_runtime:-null}" \
  --argjson flaky 0 \
  --argjson gate "$rolling_gate" \
  '
  .weeks = (
    [ .weeks[] | select(.week_start != $wk) ] +
    [
      (
        (.weeks[] | select(.week_start == $wk))
        // {
          week_start: $wk,
          self_test_runs: null,
          self_test_pass_rate: null,
          median_fixture_runtime_minutes: null,
          flaky_incidents: null,
          rolling_7d_launch_gate_met: false,
          notes: ""
        }
      )
      | .self_test_runs = $runs
      | .self_test_pass_rate = $pass
      | .median_fixture_runtime_minutes = $med
      | .flaky_incidents = $flaky
      | .rolling_7d_launch_gate_met = $gate
      | .notes = ("Updated via tooling/metrics/update-weekly.sh on " + $today)
    ]
  )
  | .weeks |= sort_by(.week_start)
  ' "$rfile" > "$rtmp"
mv "$rtmp" "$rfile"

echo "week_start=${week_start}"
echo "external_repos_on_v1=${external_repos_on_v1}"
echo "self_test_runs=${self_test_runs}"
echo "self_test_pass_rate=${self_test_pass_rate}"
echo "rolling_7d_launch_gate_met=${rolling_gate}"
