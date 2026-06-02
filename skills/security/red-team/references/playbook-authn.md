# Playbook — Authentication & Session

Targets the credential/token/session lifecycle: issuance, validation, refresh, logout, and the
login surfaces. Adapt to `auth.scheme` (bearer JWT / session cookie / OAuth / API key). For JWT,
tool of choice is **jwt_tool**; falls back to `scripts/mint-token.py` + curl when absent.

## B1 — Token / signature validation (JWT)
For a captured valid token, mutate and replay against a protected endpoint. Each acceptance is a
finding:
- **alg confusion / `none`**: re-sign with `alg: none`; attempt RS256→HS256 confusion using the
  server's public key (from `jwks_url`) as the HMAC secret.
- **signature stripping / tamper**: flip a claim without re-signing; truncate/garble the signature.
- **audience / issuer**: change `aud` / `iss` — still accepted?
- **expiry**: replay an expired token; set `exp` far-future on a tampered token.
- **key confusion / rotation**: sign with a secondary/old key if you have one — accepted where it
  shouldn't be?

`jwt_tool <token> -t <url> -rh "Authorization: Bearer <token>"` for the battery; confirm hits with curl.

## B2 — Credential / token-type confusion
- If endpoints accept multiple token types (access vs refresh vs partial/MFA-pending vs service),
  send the *wrong* type to an endpoint that should require a full session. Acceptance = bypass.
- For session cookies: test that the cookie is `HttpOnly`/`Secure`/`SameSite`; attempt fixation
  (does the session ID rotate on login?) and prediction.

## B3 — Refresh / logout / session invalidation
- Replay a used refresh token (should be single-use/rotated) — reuse = vuln.
- After logout, replay the pre-logout token/cookie — still working = broken logout.
- Concurrent-session and absolute-timeout behavior, if specified.
- OAuth flows: `redirect_uri` validation, `state` (CSRF) enforcement, PKCE, authorization-code
  reuse/interception, scope upgrade.

## B4 — Login / OTP / reset rate-limit & brute force
For login, OTP, password-reset, and any token-issuing endpoint:
- Exceed the apparent limit and confirm a 429/lockout actually triggers.
- Attempt to bypass the counter: vary `X-Forwarded-For`/`Forwarded`, header casing, trailing path
  slashes, alternate routes (gateway vs direct service), distributed values. Does any reset it?
- OTP/reset-token guessability: short codes, long validity windows, missing single-use, tokens in
  URLs/logs, account-enumeration via differential responses or timing.

## B5 — Unauthenticated reach
For every endpoint marked public / lacking an auth gate in the inventory, call it with **no**
credential and with a garbage credential. Anything returning protected data or performing a
mutation is a finding.

## Confirming
Verifier agent reproduces the accepted-token / bypassed-limit / failed-invalidation with a clean
replay. Capture the exact credential used (include it in the PoC) and the server response.
