#!/usr/bin/env bash
set -euo pipefail

fixture="$1"
root_dir="$(cd "$(dirname "$0")/../.." && pwd)"
work_dir="${root_dir}/.tmp-fixture/${fixture}"

rm -rf "$work_dir"
mkdir -p "$work_dir"
cp -R "${root_dir}/fixtures/${fixture}/." "$work_dir/"

pushd "$work_dir" >/dev/null

node "${root_dir}/cli/bin/launchpad.js" preview --preset "$fixture" --yes
node "${root_dir}/cli/bin/launchpad.js" init --preset "$fixture" --yes
node "${root_dir}/cli/bin/launchpad.js" doctor

popd >/dev/null
