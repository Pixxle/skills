# Notice

Parts of this collection derive from two plugins in Cursor's
[cursor/plugins](https://github.com/cursor/plugins) repository, both published
under the MIT License: pstack by Lauren Tan, and thermos by Cursor.

The ports keep each upstream's workflow rules and drop its Cursor-specific
packaging.

## pstack

Upstream: <https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack>.

The ports are pinned to cursor/plugins commit
`c742dd61706fbacc1b95f1a20b7b988cf096ce6c` (pstack 0.15.36, 2026-10-27). Diff
against that commit when you sync a port with upstream.

### Derived skills

- cortex, from `poteto-mode`, with the playbooks and scripts listed below
- principles, the lookup in `skills/principles/SKILL.md`, from `poteto-mode`'s
  Principles index
- unslop
- no-comments
- tdd
- swarm, with Cursor tool parameters and model slugs replaced by capability
  terms
- babysit, including BUGBOT-TRIAGE.md, from `poteto-mode`'s bugbot-triage
  reference
- shipping
- handoff (pause, pickup, and decision-trail modes, including scripts/log.sh).
  The decision-trail mode derives from `show-me-your-work`.
- how
- why
- architect
- arena
- interrogate
- reflect
- correct
- figure-it-out
- benchmark-checklist
- bro
- create-verification-skill
- maintain-verification-skill

### Derived principles

One file per upstream `principle-*` skill, as `skills/principles/<name>.md`:

- attack-the-premise
- boundary-discipline
- build-the-lever
- encode-lessons-in-structure
- exhaust-the-design-space
- experience-first
- explain-the-number
- fix-root-causes
- foundational-thinking
- guard-the-context-window
- laziness-protocol
- make-operations-idempotent
- migrate-callers-then-delete-legacy-apis
- minimize-reader-load
- model-the-domain
- never-block-on-the-human
- outcome-oriented-execution
- prove-it-works
- redesign-from-first-principles
- separate-before-serializing-shared-state
- sequence-verifiable-units
- subtract-before-you-add
- test-behavior-not-implementation
- type-system-discipline

### Derived cortex playbooks

From `poteto-mode`'s playbooks, in `skills/cortex/playbooks/`:

- Authoring a skill
- Autonomous run
- Autopilot full
- Autopilot stack
- Babysit
- Bug fix
- Eval
- Feature
- Hillclimb
- Investigation
- Multi-phase plan
- Opening a PR
- Orchestrate
- Pause safely
- Perf issue
- Prototype
- Refactoring
- Runtime forensics
- Session pickup
- Shipping
- Trace forensics
- Visual parity
- Worktree cleanup

### Derived scripts

- `skills/babysit/scripts/watch-pr/`, a Node port of upstream
  `poteto-mode/scripts/watch-pr` (Bun), with zero dependencies and `node:test`
  suites
- `skills/cortex/scripts/check-plan.mjs` and its test, from
  `poteto-mode/scripts/check-plan.mjs` and `check-plan.test.ts`
- `skills/cortex/scripts/worktree-audit.sh`, from
  `poteto-mode/scripts/worktree-audit.sh`. Its test is local.

### Derived agent definitions

- comment-sicko
- cortex-agent, from `poteto-agent`

## thermos

Upstream: <https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/thermos>.

The thermos license below is copied from the same cursor/plugins commit
(thermos 1.0.0).

### Derived skills

- thermo-nuclear-code-quality-review, adapted from thermos's skill of the same
  name
- thermo-nuclear-refactor, which applies the thermo-nuclear code-quality bar
  from thermos to existing code

## pstack license

```text
MIT License

Copyright (c) 2026 Lauren Tan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## thermos license

```text
MIT License

Copyright (c) 2026 Cursor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
