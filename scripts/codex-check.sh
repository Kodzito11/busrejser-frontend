#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

section() {
  printf '\n==> %s\n' "$1"
}

section "Install dependencies"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

section "Build"
npm run build

section "Test"
if node -e "const p = require('./package.json'); process.exit(p.scripts && p.scripts.test ? 0 : 1);"; then
  npm test
else
  echo "No test script found; skipping npm test."
fi

printf '\nCodex check passed.\n'
