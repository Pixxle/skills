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
- principles, now the index of the principle leaves
- unslop
- no-comments
- fix-bug, which folds in the rules of upstream `tdd`
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

### Derived principle leaves

One leaf skill per upstream `principle-*` skill, under the same name:

- principle-attack-the-premise
- principle-boundary-discipline
- principle-build-the-lever
- principle-encode-lessons-in-structure
- principle-exhaust-the-design-space
- principle-experience-first
- principle-explain-the-number
- principle-fix-root-causes
- principle-foundational-thinking
- principle-guard-the-context-window
- principle-laziness-protocol
- principle-make-operations-idempotent
- principle-migrate-callers-then-delete-legacy-apis
- principle-minimize-reader-load
- principle-model-the-domain
- principle-never-block-on-the-human
- principle-outcome-oriented-execution
- principle-prove-it-works
- principle-redesign-from-first-principles
- principle-separate-before-serializing-shared-state
- principle-sequence-verifiable-units
- principle-subtract-before-you-add
- principle-test-behavior-not-implementation
- principle-type-system-discipline

### Derived cortex playbooks

From `poteto-mode`'s playbooks, in `skills/engineering/cortex/playbooks/`:

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
- Refactor, from `refactoring.md`
- Runtime forensics
- Session pickup
- Shipping
- Trace forensics
- Visual parity
- Worktree cleanup

The Map system, Swarm review, Bump deps, Changelog, and Writing playbooks are
local and not derived from pstack.

### Derived scripts

- `skills/engineering/babysit/scripts/watch-pr/`, a Node port of upstream
  `poteto-mode/scripts/watch-pr` (Bun), with zero dependencies and `node:test`
  suites
- `skills/engineering/cortex/scripts/check-plan.mjs` and its test, from
  `poteto-mode/scripts/check-plan.mjs` and `check-plan.test.ts`
- `skills/engineering/cortex/scripts/worktree-audit.sh`, from
  `poteto-mode/scripts/worktree-audit.sh`. Its test is local.

### Derived agent definitions

- comment-sicko
- cortex-agent, from `poteto-agent`

### Outline only

swarm-review is not a port of upstream `swarm`, which is a different skill. It
borrows only that skill's Frame, Fan out, Aggregate, and Report outline.

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
