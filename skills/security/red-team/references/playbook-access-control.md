# Playbook — Access Control (SPEARHEAD)

The core of the engagement and the class no scanner can judge: only the application knows which
object belongs to whom. OWASP A01. Attack it by **replaying real requests with swapped identity and
swapped IDs**. Applies to multi-tenant apps (cross-tenant) and single-tenant apps (cross-user BOLA)
alike — `model.tenancy` in config selects the emphasis.

## Identities you operate with

- `token_a` / `token_b` — real sessions for `identities.user_a` and `user_b`. For multi-tenant
  targets these live in **different tenants/orgs**; for single-tenant, two ordinary users.
- `forged_*` — tokens minted by `scripts/mint-token.py` (only if `jwt.enabled`).
- **Harvested IDs**: for each identity, capture the object IDs that legitimately appear in *its own*
  responses (orgIds, account/userIds, resource IDs). These become the cross-boundary payloads.

## Attacks (run each inventory endpoint, prioritized)

### A1 — Broken object-level authorization (IDOR / BOLA)
For every endpoint whose `scope_params` carry an object or tenant ID:
1. Call as `token_a` with **A's own** IDs → baseline (expect 200 + A's data).
2. Replay **identically** as `token_a`, substituting **B's** IDs in route/query/body.
3. **Vuln** if you get B's data, or anything other than a clean 403/404. A `200` returning another
   user's/tenant's data is critical, more so for sensitive records.
Also enumerate sibling resources: increment numeric IDs; replace GUIDs with B's; try predictable
keys (email, slug, sequential). Guessable IDs that leak data = higher severity.

### A2 — Scope / ownership inconsistency (check says A, query returns B)
Target endpoints flagged "authz check + ID from request":
- Pass A in the field the authorization check reads, but B in the field the query filters on (or a
  list mixing A and B IDs). If B's data comes back, the check and the data access disagree.
- Exercise both branches of any conditional access logic.

### A3 — Privilege / function-level escalation
- Find write/admin endpoints guarded by a *read* or *coarse* check, or admin functions with no
  role check. As `low_priv` (or `token_a`), attempt the elevated op. Success = escalation.
- Mass-assignment: include extra fields in a write body (`role`, `isAdmin`, `ownerId`, `orgId`,
  `verified`) and see if the server honors them.
- Self-grant: attempt to assign yourself a role/permission/membership you should not hold.
- Force-browse admin routes/UI endpoints directly with a non-admin token.

### A4 — Forged-claim authorization bypass (does the server trust the token?)
Only if `jwt.enabled` (you possess a dev/test key or secret). Using `scripts/mint-token.py`:
- Mint a **validly-signed** token with `user_a`'s subject but **B's** tenant/org claim, then hit B's
  endpoints. Access granted on the claim alone ⇒ server trusts the token instead of re-checking
  authorization server-side. Critical.
- Mint a token elevating role/permission claims and retry A3 targets.
- Mint a token impersonating another subject (`sub`/`userId`) against user-scoped endpoints.

### A5 — Cross-boundary write (only if `scope.allow_writes`)
Repeat A1/A2 with POST/PUT/DELETE: as `token_a`, create/modify/delete a resource owned by B. A
successful mutation of B's data is the most severe outcome. Tag every write (finding-format).

## Confirming a finding

Report only after the **verifier agent** independently replays the exact request and observes the
cross-boundary data / escalation again. Capture: the authorized baseline response, the attack
request, and the attack response proving the leak. The proof is the live response, never a code
reading.
