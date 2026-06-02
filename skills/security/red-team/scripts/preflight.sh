#!/usr/bin/env bash
# Detect optional pen-test tools and report AVAILABLE / MISSING with an install hint.
# Reports only — it does NOT install anything (the orchestrator decides per tool-registry.md).
# All tools are optional; missing ones fall back to agent-driven curl + scripts/mint-token.py.
set -u

# tool|install hint
TOOLS=(
  "jwt_tool|pipx install jwt-tool   (or git clone github.com/ticarpi/jwt_tool)"
  "schemathesis|pipx install schemathesis"
  "nuclei|brew install nuclei   (or go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest)"
  "sqlmap|brew install sqlmap   (or pipx install sqlmap)"
  "ffuf|brew install ffuf"
  "feroxbuster|brew install feroxbuster"
  "zap.sh|brew install --cask zap   (heavy; on request only)"
  "restler|git clone github.com/microsoft/restler-fuzzer   (needs .NET; on request only)"
)

# Also useful baseline utilities (agent-driven attacks rely on these).
BASE=("curl" "jq" "python3")

printf '== Baseline ==\n'
for b in "${BASE[@]}"; do
  if command -v "$b" >/dev/null 2>&1; then
    printf '  AVAILABLE  %-12s %s\n' "$b" "$("$b" --version 2>&1 | head -n1)"
  else
    printf '  MISSING    %-12s (recommended)\n' "$b"
  fi
done

# PyJWT/cryptography for mint-token.py
if python3 -c 'import jwt, cryptography' >/dev/null 2>&1; then
  printf '  AVAILABLE  %-12s PyJWT + cryptography (mint-token.py ready)\n' "pyjwt"
else
  printf '  MISSING    %-12s pip install pyjwt cryptography (needed to forge tokens)\n' "pyjwt"
fi

printf '\n== Optional security tools ==\n'
for entry in "${TOOLS[@]}"; do
  name="${entry%%|*}"; hint="${entry#*|}"
  if command -v "$name" >/dev/null 2>&1; then
    printf '  AVAILABLE  %-14s %s\n' "$name" "$(command -v "$name")"
  else
    printf '  MISSING    %-14s install: %s\n' "$name" "$hint"
  fi
done

printf '\nMissing tools are fine — each degrades to agent-driven curl/forged-token attacks.\n'
