# Sub-agent briefs

Each brief is a self-contained prompt for an `Explore` sub-agent. The agent does not see your conversation — copy the brief verbatim, fill in the `{{...}}` placeholders, and adapt the file-extension hints to the project's language.

All four briefs share these output rules:

- Write files directly to `{{repo_root}}/_mapping/<area>/NN_<domain>.md` where `NN` is a two-digit ordinal and `<domain>` is a short snake_case name (e.g. `01_identity_org.md`).
- Group findings by **domain**, not by file type. One file per coherent domain cluster.
- Absolute file paths in every citation. Line numbers where they sharpen the point.
- Risk-rank security/correctness findings as 🔴 HIGH / 🟠 MED / 🟡 LOW.
- Honest tone: surface dead code, drift, missing pieces, commented-out auth checks. Do not rationalise.
- Length is governed by the codebase, not a target word count. A small Rails app may produce a 400-line file; a large monolith 1000+.
- End each sub-report with a short "what's missing / not investigated" note when applicable.

---

## Brief 1 — Models

```
You are mapping the data model of {{project_name}} at {{repo_root}}.

Investigate and write your findings to {{repo_root}}/_mapping/models/.

Cover:

1. Every persistent table / collection / aggregate. Group them by domain
   (identity, billing, scheduling, …) and produce one file per domain
   cluster, named NN_<domain>.md.

2. For each domain file include:
   - Tables in the cluster, their purpose in one line
   - Key fields (PII, money, status enums, denormalised counters)
   - Associations and ownership FKs
   - Validations, callbacks, scopes — especially callbacks doing business
     logic (these are usually smells)
   - Indexes / uniqueness / foreign keys (or notable absence)

3. **God objects** — rank classes/tables by responsibility surface, not just
   line count. For each:
   - File path + line count
   - Why it's a god object (count responsibilities, list them)
   - Pointer to the worst-offending method
   - Suggested decomposition path in one paragraph

4. **Permissions / authorization model** — produce a dedicated file
   (e.g. NN_permissions.md). Document:
   - How a request is authenticated
   - How authorization is computed (policy classes, role enums, FK ownership,
     feature flags)
   - All orthogonal axes that compose into a decision
   - Every policy gap you can find: missing `authorize!` calls, commented-out
     checks, typo'd predicates, endpoints with no policy at all. Risk-rank.
   - Sensitive-data exposure in serializers / entities (plaintext PII, OAuth
     tokens, unconditional `expose` of email/phone/GPS)

5. **Cross-service model concerns** if multiple services share a database
   or define the same class differently — call this out explicitly.

Use absolute file paths. Include short code excerpts only when they sharpen
a point. Do not summarise files — interrogate them.

Output target: typically 5–8 files for a medium-to-large codebase, fewer for
small ones. Cap individual files around 1000 lines.
```

---

## Brief 2 — Workers

```
You are mapping the async architecture of {{project_name}} at {{repo_root}}.

Investigate and write your findings to {{repo_root}}/_mapping/workers/.

Cover:

1. **The async framework itself** — first file (e.g. 01_async_architecture.md).
   Document:
   - Queue runtime (Sidekiq / Celery / BullMQ / Lambda / …) and configuration
   - Every queue: name, weight/concurrency, what it carries
   - Retry semantics, dead-letter handling, uniqueness locks
   - Any in-house wrapper (`Operations::Async`, custom job base class) — explain
     the pattern, who uses it, and where it's bypassed
   - Cron / scheduled jobs: every entry, schedule, what it does, known stampede
     or fan-out hazards

2. **Per-domain async paths** — one file per domain cluster, matching the model
   clustering where possible. For each:
   - Trigger (HTTP request, model callback, cron, webhook)
   - Chain of jobs and what each does
   - Sync-vs-async boundary — call out anything that *looks* async but actually
     runs in the request thread, and vice versa
   - Idempotency: does Sidekiq/queue retry duplicate the side effect?
   - Failure modes: what happens if the job dies mid-way

3. **Inter-service messaging** — if there are multiple services:
   - Mechanism (shared Redis queues, RabbitMQ, Kafka, HTTP, gRPC)
   - Every message type and its consumer
   - Trust model (signed payloads? shared keys? naked queue names?)
   - Drift hazards (stub classes that must match across repos, schemas that
     must stay in sync manually)

4. **Inbound webhooks** — Stripe, OAuth callbacks, third-party push:
   - Where they land
   - Are they processed sync or async (and is that the right choice?)
   - Signature verification — and any bypass paths
   - Idempotency / event-ID dedup
   - What state they mutate

5. **External service calls** — third-party HTTP roundtrips made from the
   request thread that probably shouldn't be (push providers, payment APIs,
   chat systems, OAuth refresh).

Risk-rank correctness hazards. Be specific about money handling, retry-safety,
and webhook reliability.
```

---

## Brief 3 — Endpoints

```
You are mapping the HTTP/API surface of {{project_name}} at {{repo_root}}.

Investigate and write your findings to {{repo_root}}/_mapping/endpoints/.

Cover:

1. **Routing surface** — first file. List:
   - Total endpoint count
   - Versioning strategy (URL prefix, Accept header, …) and which versions
     are actually live
   - Authentication entry points (sign in, refresh, OTP)
   - Anonymous endpoints (the only ones reachable without a token)

2. **Per-domain endpoint groups** — one file per domain cluster. For each
   endpoint, document:
   - HTTP method + path
   - What it touches (which models / operations / external services)
   - Authorization: what policy fires, what role/flag is required
   - Request shape (key params) and response shape (key entity fields)
   - Side effects beyond the obvious — especially **GET endpoints that mutate
     state** (`seen_at`, counters, lazy refreshes) — flag these explicitly

3. **Authorization gaps** — collect into a risk-ranked table per file:
   - Endpoints with no `authorize!` call
   - Endpoints with commented-out policy checks
   - Policy methods with logical typos (`||` vs `&&`)
   - Endpoints that delegate auth to a query class but don't check the result
   - Public endpoints exposing more than they should (emails, GPS, PII)

4. **Webhook & callback endpoints** — Stripe, OAuth, SMS providers:
   - Signature verification
   - Idempotency (event-ID dedup table?)
   - Sync vs async processing

5. **Inconsistencies** — duplicate routes, dead routes, parallel "v1/v2"
   implementations both wired up, commented-out catch-all 404 handlers,
   route mounts that skip the auth middleware.

Use absolute file paths. Include the file path of the endpoint definition
AND the operation/controller it dispatches to.
```

---

## Brief 4 — Frontend leakage (skip if no frontend)

```
You are mapping where business logic has leaked into the {{frontend_tech}}
frontend of {{project_name}} at {{repo_root}}.

Investigate and write your findings to {{repo_root}}/_mapping/{{frontend_dir}}/.

You are not documenting the frontend's architecture. You are hunting for
logic that **should live on the backend** but has been reimplemented (or
duplicated) in the client. Cover:

1. **Money / tax / pricing math** — any calculation involving rates, fees,
   commissions, currency conversion, tax tiers, payout breakdowns. Look for
   hardcoded constants (tax rates, fee percentages, magic numbers). Compare
   against the backend equivalent: is the FE trusting it, or recomputing?

2. **Permission decisions** — `canManage*`, `isAdmin`, `_rightsByOrganization`
   helpers. Any client-side encoding of backend authorization rules is a
   drift hazard. Quote the comments that confirm "the backend does X" — those
   are the strongest signal.

3. **State machine duplications** — `OfferStatus`, `BookingStatus`, etc.
   enums and their derived booleans. Brittle if the server adds a status.

4. **Validation duplicated server-side** — Luhn checks, SSN/personnummer
   validators, email regexes that diverge from the server's.

5. **Aggregations and counters** — unread counts, "mutual connections",
   onboarding completeness derived from list filters client-side.

6. **Multi-call FE joins** — sequences of API calls stitched together
   client-side that should be one backend endpoint.

7. **Hardcoded feature dates / cutoffs** — `DateTime(2023, 10)` style
   constants gating features. Should be server flags.

8. **Comment-code mismatches** — comments saying "from June 2024" or
   "// bad: ... // good: ..." next to manually-tuned values. These are
   archaeological evidence of past drift.

For each finding, document:
- What it is and where (absolute path + line numbers)
- The backend equivalent (does one exist? is it being called?)
- Risk: HIGH / MED / LOW
- Migration recommendation in one sentence

Group findings into 3–5 domain files. End with a consolidated migration
order ranked by foundational-ness — what must move first to unblock
the rest.
```
