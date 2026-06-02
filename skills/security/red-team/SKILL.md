---
name: red-team
description: Dynamic penetration test against a RUNNING web application or API of any stack — profiles the target, authenticates as real users, forges tokens when a dev signing key is available, and actively attacks live endpoints to prove broken object/tenant authorization (IDOR/BOLA), privilege escalation, auth bypass, and sensitive-data/injection flaws. Produces replayable proof-of-concept exploits, not code hypotheses. Use when the user wants to pen-test, red-team, attack, or dynamically exploit a live app they own; says "red-team this", "pen test the API", "try to break access control", "attack the running server"; or wants to confirm an authorization/IDOR concern against a real server. NOT for static code review or PR-diff review — this drives a live target.
---

# Red Team — Dynamic Penetration Test (any project)

Active exploitation of an **already-running** application. The user brings a base URL; this skill
profiles the target, authenticates, attacks, and reproduces real exploits. It does not read code to
guess — it fires requests at a live server and reports only what it could actually reproduce.

Project-agnostic: works against any HTTP app/API regardless of language or framework. It adapts the
attack to whatever auth and data model the target actually has. The spearhead is **broken access
control** — the OWASP #1 risk and the class no scanner can judge, because only the application
knows which object belongs to whom.

## Phase 0 — Profile + scope acknowledgment (MANDATORY, never skip)

1. **Profile the target.** Determine: base URL + any sub-service URLs; the auth scheme (session
   cookie / Bearer JWT / OAuth / API key); whether it is multi-tenant (org/tenant/account scoping)
   or single-tenant (per-user objects); and the data sensitivity. Use source in the CWD if present,
   else the running responses. This decides which playbook items apply.
2. **Load config.** Read `references/config-template.yml` for the shape, then look for
   `red-team.config.yml` in the CWD. If absent, gather the essentials (target URL, two test
   identities, optional signing key) from the user or by inspecting the project, and write one.
3. **STOP for acknowledgment.** Resolve the target host, print it, and require the user to confirm
   by naming the host:

   > ⚠️ red-team will perform ACTIVE EXPLOITATION against `{host}`, including **state-mutating
   > writes (POST/PUT/DELETE)** and **token forgery** if a key is configured. Real data may be
   > created, modified, or deleted. Confirm you are authorized to attack this exact host by typing
   > its name.

   After acknowledgment, run freely with no further per-request prompts. Tag every mutating request
   per `references/finding-format.md`. If the user does not name the exact host, abort. Refuse if
   the host is outside `scope.allowed_hosts`.

## Phase 1 — Surface discovery

Follow `references/surface-discovery.md`. Build the route inventory mapping
`endpoint → auth requirement → authorization check → object/tenant-scope param` from any available
OpenAPI/GraphQL schema plus source in the CWD. Save to
`red-team-output/surface/route-inventory.json`. This is the attack map.

## Phase 2 — Preflight tools (optional, degrades gracefully)

Run `scripts/preflight.sh` to detect jwt_tool, schemathesis, nuclei, sqlmap, ffuf/feroxbuster,
zap, restler (see `references/tool-registry.md`). Present AVAILABLE / INSTALLABLE / MISSING and ask
whether to install. **Any missing tool falls back to agent-driven curl + forged/real tokens** — the
attack always runs.

## Phase 3 — Attack (fan-out by class → replay-to-confirm)

Acquire identities: log in as the two configured users (and forge tokens with
`scripts/mint-token.py` if a signing key/secret is configured). Then spawn one agent per applicable
class, each looping until it stops finding new issues:

1. **Access control (spearhead)** — `references/playbook-access-control.md`
2. **Authentication / session** — `references/playbook-authn.md`
3. **Sensitive data & injection** — `references/playbook-data-injection.md`

Every candidate finding goes to a **verifier agent** that must independently reproduce the exploit
before it is reported. Unreproducible candidates are dropped with a note.

## Phase 4 — Report

Per `references/finding-format.md`, write each confirmed finding with a **replayable PoC** (exact
curl/script) to `red-team-output/findings/`, then a consolidated `red-team-output/report.md`.
Report only — propose no code fixes. Surface what was attacked, what reproduced, what was dismissed.
