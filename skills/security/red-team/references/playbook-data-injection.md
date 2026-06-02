# Playbook — Sensitive Data Exposure & Injection

Two themes: data that should never reach a given caller, and classic injection. Tools augment but
never replace targeted replay. Tailor "sensitive" to what Phase 0 profiling found the app to hold
(PII, financial, health, credentials, secrets).

## C1 — Sensitive-data exposure
- **Over-exposure**: list/detail/search endpoints and exports (CSV/Excel/PDF/JSON) returning more
  fields than the UI shows — internal IDs, other users' data, password hashes, tokens, secrets.
- **Inconsistent redaction/masking**: if the app masks a field (SSN, card, email) in one endpoint,
  check whether a sibling (export, search, sync, legacy, admin, error path) leaks the raw value.
- **Error leakage**: trigger errors (malformed input, type mismatch, oversized payload) and inspect
  responses for stack traces, SQL, connection strings, file paths, internal hostnames, or echoed
  sensitive input.
- **Verbose responses & headers**: debug endpoints, `/actuator`, `/metrics`, `.env`, source maps,
  `Server`/`X-Powered-By` version disclosure.

## C2 — Injection (SQL / NoSQL / command / template / LDAP)
Treat as **targeted confirmation**, not blanket scanning — most modern stacks parameterize. From the
inventory, pick params that plausibly reach a query/shell/template (search, filter, sort/`ORDER BY`
fields, raw ID lists, file names, eval'd expressions):
- Manual probes: `'`, `' OR '1'='1`, boolean differentials, time-based (`SLEEP`/`pg_sleep`/`WAITFOR`);
  NoSQL operators (`{"$gt":""}`, `{"$ne":null}`); command chars (`; | $( )`); template payloads
  (`{{7*7}}`, `${7*7}`). Watch for 500s, timing deltas, changed result sets, reflected evaluation.
- If a param looks injectable, confirm with the right tool (e.g. **sqlmap** for SQLi):
  `sqlmap -u '<url>' --headers="Authorization: Bearer <token>" -p <param> --batch`.

## C3 — Path traversal / SSRF / file handling
- File download/upload/key params: traversal (`..%2f`, absolute paths), and cross-owner object
  access via key/ID swap (overlaps access-control A1 — cross-link the finding).
- SSRF: any param taking a URL/host (webhooks, import-from-url, image/PDF fetch, callbacks) — try
  internal targets (cloud metadata `169.254.169.254`, localhost services, internal ports).
  Host/protocol-controlling SSRF is high value; path-only is low.
- Upload handling: content-type/extension bypass, oversized files, archive/zip-slip, stored XSS via
  filename.

## C4 — Schema-driven fuzzing & templated sweep
- **schemathesis** against the OpenAPI, authenticated:
  `schemathesis run <openapi-url> --header "Authorization: Bearer <token>" --checks all` — surfaces
  500s, schema violations, auth gaps, error-detail leaks.
- **nuclei** authenticated sweep: `nuclei -u <base_url> -H "Authorization: Bearer <token>"
  -tags exposure,misconfig,injection`.
- **ffuf/feroxbuster** for endpoints/params absent from the schema; feed hits back to access-control.

## C5 — XSS / client-side
Modern frameworks auto-escape; flag only concrete sinks: raw HTML injection
(`dangerouslySetInnerHTML`, `v-html`, `innerHTML`, server-rendered unescaped output), unsanitized
redirect/URL params (open redirect), or markdown/HTML rendered from user content. Confirm by storing
a payload via the API and observing it execute in a rendered view. Do not report theoretical XSS.

## Confirming
Verifier agent reproduces: the over-exposed/unmasked response, the injection differential or sqlmap
proof, the cross-owner file fetch, the SSRF callback, or the executed XSS. Capture the request and
the offending response slice — **redact actual sensitive values** in the report (name the field and
that it was exposed; don't paste real PII/secrets).
