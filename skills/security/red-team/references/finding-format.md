# Finding Format & Report

Lightweight, proof-of-concept-centred. The thing that makes a finding worth more than a static
scanner's guess is the **replayable PoC** — an exact request anyone can re-run to reproduce the
exploit. No code-fix suggestions (out of scope); report only.

## Per-finding file: `red-team-output/findings/<id>.md`

`<id>` = `RT-<class>-<n>`, e.g. `RT-AC-1` (access-control), `RT-AUTHN-2`, `RT-DATA-3`.

```markdown
# RT-AC-1 — Cross-tenant invoice read via orgId swap

- **Class:** access-control            # access-control | authn | data-injection
- **Severity:** CRITICAL               # CRITICAL | HIGH | MEDIUM | LOW (see scale below)
- **Endpoint:** GET /api/orgs/{orgId}/invoices/{invoiceId}
- **Identity used:** user_a (tenant A)
- **Status:** CONFIRMED                 # CONFIRMED (verifier reproduced) | CANDIDATE | DISMISSED
- **Mutating:** no                      # yes ⇒ this PoC writes/deletes data

## Impact
One sentence: who can do what to whom.

## Baseline (authorized request)
```
curl -s -H "Authorization: Bearer $TOKEN_A" \
  https://host/api/orgs/A_ORG/invoices/A_INV    # 200, returns A's own invoice
```

## Proof-of-concept exploit
```
curl -s -H "Authorization: Bearer $TOKEN_A" \
  https://host/api/orgs/B_ORG/invoices/B_INV    # 200 — returns tenant B's invoice (LEAK)
```

## Observed result
What proves it: status code + the response slice showing cross-boundary data.
**Redact real sensitive values** — name the leaked field and that it was exposed; do not paste
actual PII/secrets/tokens.

## Verification
How the verifier agent independently reproduced it (separate identity/run).
```

## Severity scale (impact × exploitability)
- **CRITICAL** — unauth or cross-tenant access to sensitive data; auth bypass; cross-boundary write;
  RCE/injection with data impact.
- **HIGH** — cross-user data access; privilege escalation; meaningful PII/secret exposure.
- **MEDIUM** — limited exposure, rate-limit bypass, SSRF (path-limited), reflected issues needing
  conditions.
- **LOW** — info disclosure (versions, verbose errors) without direct data impact.

## Mutation tagging (writes)
Every state-mutating attack request must carry a tag so changes are traceable and cleanable:
- Header `X-RedTeam: <run-id>` on the request (and note it in the PoC), and/or a recognizable marker
  in created data (e.g. name prefix `REDTEAM-`).
- Log each mutation (method, URL, what was created/changed/deleted) in
  `red-team-output/mutations.log` so the operator can review/revert.

## Consolidated report: `red-team-output/report.md`
- **Summary** — target host, run-id, identities/tenancy model, counts by severity.
- **Confirmed findings** — ordered by severity, each linking its `findings/<id>.md`.
- **Attacked & clean** — table of classes/endpoints exercised that held up (evidence of coverage).
- **Dismissed candidates** — what looked promising but the verifier could not reproduce, and why.
- **Coverage gaps** — endpoints not reached, tools missing, classes skipped (e.g. single-tenant so
  cross-tenant N/A), so the reader knows the limits of the run.
```
