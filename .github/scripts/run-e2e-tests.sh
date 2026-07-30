#!/usr/bin/env bash
# Runs the Maestro e2e suite, retrying once before failing: the demo app
# occasionally crashes right after launchApp (transient RN startup flake).
set -uo pipefail

for attempt in 1 2; do
  if maestro test e2e --format=junit --output=report.xml --no-ansi; then
    exit 0
  fi
  echo "Maestro run failed (attempt $attempt)"
done
exit 1
