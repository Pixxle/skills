# Tool Registry

All tools are **optional**. Missing tool → fall back to agent-driven curl + `scripts/mint-token.py`.
The authz spearhead never depends on a tool. `scripts/preflight.sh` reports availability; this file
is the install/verify/use reference. Prefer Homebrew on macOS, then pipx/pip, then go install.

| Tool | Class | Install | Verify | Primary use |
|------|-------|---------|--------|-------------|
| **jwt_tool** | AuthN | `pipx install jwt-tool` or `git clone github.com/ticarpi/jwt_tool` | `jwt_tool --help` | alg/none/key-confusion, aud/iss/exp tampering — B1 |
| **schemathesis** | All | `pipx install schemathesis` | `schemathesis --version` | OpenAPI property fuzzing — C4 |
| **nuclei** | AuthN/PII/inj | `brew install nuclei` or `go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest` | `nuclei -version` | authenticated templated sweep — C4 |
| **sqlmap** | Injection | `brew install sqlmap` or `pipx install sqlmap` | `sqlmap --version` | targeted SQLi confirmation — C2 |
| **ffuf** | Surface | `brew install ffuf` | `ffuf -V` | endpoint/param discovery — C4 |
| **feroxbuster** | Surface | `brew install feroxbuster` | `feroxbuster -V` | recursive content discovery — C4 |
| **OWASP ZAP** | All (heavy) | `brew install --cask zap` | `zap.sh -version` | full active scan + Autorize-style authz via `zap-api-scan.py`; use only on request |
| **restler** | All (heavy) | `git clone github.com/microsoft/restler-fuzzer` (needs .NET) | `restler --version` | stateful REST fuzzing from OpenAPI; use only on request |

## Degradation map (what to do when a tool is MISSING)

- **jwt_tool** → use `scripts/mint-token.py` to forge tokens + manual curl replays for each B1 case.
- **schemathesis** → agent walks the OpenAPI paths, sends boundary/garbage payloads with curl,
  watches for 500s and schema leaks.
- **nuclei** → skip the templated sweep; rely on the targeted playbook attacks.
- **sqlmap** → manual SQLi probes only (`'`, boolean, `pg_sleep`); report as candidate if a
  differential appears, marked "needs sqlmap confirmation".
- **ffuf/feroxbuster** → surface = OpenAPI + controller source only (no undocumented-path discovery).
- **ZAP / restler** → not part of the default run; their absence changes nothing.

## Notes
- Run authenticated: always pass `-H "Authorization: Bearer <token>"` (or the tool's header flag).
- Scope tools to the acked host only. Do not let nuclei/ffuf wander to other hosts.
- jwt_tool needs the JWKS for key-confusion: `GET {iam}/api/iam/v1/.well-known/openid-configuration`.
