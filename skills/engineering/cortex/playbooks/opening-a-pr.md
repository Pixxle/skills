### Opening a PR

Invoked at the end of every playbook that ships a change.

1. **Prove / sequence hold.** Real-surface checks already pass. Commits tell the story (failing-then-passing, subtract-then-reshape, or other verifiable units).
2. **Opening-a-PR gates.** Run [`unslop`](../../unslop/SKILL.md) on PR title, body, and commit subjects and bodies. Run [`no-comments`](../../no-comments/SKILL.md) on the scoped diff. Name the combination when you apply it.
3. **Branch and commits.** Work on your feature branch, preferably in a clean worktree. Patch out unrelated dirty work first. Commit liberally, then rebase into small ordered commits before opening. Prefer several narrow stacked PRs to one large PR when the story splits cleanly. Title the PR and each commit in Conventional Commits form, `type(scope): subject`, imperative, with no trailing period.
4. **PR body.** Short briefing for a reviewer who has the diff. Use `##` headings and drop empty sections.
   - `## Why` opens with the user's goal as you restated it at session start, then the problem and approach. 1 to 3 sentences.
   - `## What changed` is 1 to 3 bullets. Name a real symbol or path only when it carries the change.
   - `## Scope` says what it covers and what it leaves out.
   - `## Tradeoffs` lists only rejected alternatives a reviewer would ask about.
   - `## Blast Radius` says who or what it touches and why that is safe or risky.
   - `## Verification` lists real run paths and outcomes.

   Attach evidence that proves a claim (screenshots, recordings) after the sections. Put long SHA lists in a linked artifact.
5. **Forge.** Resolve one forge path and keep it. Prefer the repo's active forge CLI and record fallbacks. Open ready for review unless the user asked for a draft. When the run provides a built-in PR tool, create, edit, and retarget through it so tracking stays correct.
6. **Not babysit.** Post the URL and continue the parent playbook or stop. Run **Babysit** only when the user asks after the stack exists.

**Reply:** PR URL, stack base if any, verification summary.
