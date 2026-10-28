### Opening a PR

Invoked at the end of every playbook that ships a change.

1. **Prove / sequence hold.** Real-surface checks already pass. Commits tell the story (failing-then-passing, subtract-then-reshape, or other verifiable units).
2. **Opening-a-PR gates.** Run [`unslop`](../../unslop/SKILL.md) on PR title, body, and commit subjects/bodies. Run [`no-comments`](../../no-comments/SKILL.md) on the scoped diff. Name the combination when you apply it.
3. **Branch and commits.** Work on your feature branch. Commit liberally, then rebase into small ordered commits before opening. Prefer several narrow stacked PRs to one large PR when the story splits cleanly.
4. **PR body.** Short briefing for a reviewer who has the diff. Use `##` headings; drop empty sections:
   - `## Why` — problem and approach (1–3 sentences)
   - `## What changed` — 1–3 bullets; name a real symbol/path only when it carries the change
   - `## Scope` — what it covers and what it leaves out
   - `## Tradeoffs` — only rejected alternatives a reviewer would ask about
   - `## Blast Radius` — who/what it touches and why that is safe or risky
   - `## Verification` — real run paths and outcomes
5. **Forge.** Resolve one forge path and keep it. Prefer the repo's active forge CLI; record fallbacks. Open ready for review unless the user asked for a draft. When the run provides a built-in PR tool, create/edit through it.
6. **Not babysit.** Post the URL and continue the parent playbook or stop. Run **Babysit** only when the user asks after the stack exists.

**Reply:** PR URL, stack base if any, verification summary.
