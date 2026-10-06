#!/usr/bin/env bash
# Runs the Maestro e2e suite, retrying once before failing.
#
# Do not use `maestro test e2e/` on the directory: Maestro runs every flow in
# that folder in parallel, and both react_version.yml and evaluations.yaml call
# launchApp on the same simulator. That races two cold starts and shows up as
# intermittent "App crashed or stopped while executing flow" on evaluations
# (often while react_version still passes).
set -uo pipefail

if [[ ! -f e2e/react_version.yml ]]; then
  echo "Missing e2e/react_version.yml (copy from e2e/react_versions/react_18.yml or react_19.yml)" >&2
  exit 1
fi

run_e2e() {
  maestro test e2e/react_version.yml --no-ansi &&
    maestro test e2e/evaluations.yaml --format=junit --output=report.xml --no-ansi
}

for attempt in 1 2; do
  if run_e2e; then
    exit 0
  fi
  echo "Maestro run failed (attempt $attempt)"
done
exit 1
