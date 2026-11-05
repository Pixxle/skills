---
name: routing-audit
description: Audits a finished cortex session against the route it should have taken. Rebuilds the intended flow from the skills as they stood at that time, grades each step from the transcript as followed, only read, substituted, or skipped, and recommends skill changes that make the route hard to skip. Use after a cortex run when the user asks whether a skill was actually followed, why a step was skipped, or how to tighten the skills.
disable-model-invocation: true
---

# Routing audit

Grade a past session against its intended route, then recommend skill changes. Edit no skill here.

Open a todolist with the seven steps below. Where the runtime gives you none, track them in your reply.

## 1. Find the session

Take the session the user names: a transcript path, a session id, or a workspace plus a time. Read only that session and its subagents, never a glob across projects. Claude Code keeps sessions at `~/.claude/projects/<workspace-slug>/<session>.jsonl`, where the slug is the workspace path with every character other than letters and digits replaced by `-`, and subagents at any depth under `<session>/subagents/`. Codex keeps them at `${CODEX_HOME:-~/.codex}/sessions/YYYY/MM/DD/rollout-*.jsonl`. Without a name, take the newest session in the named workspace other than this one, and say which you took. To audit one request in a longer session, find its turn number in step 3 and pass `--turn N`.

## 2. Pin the skills to the session

The skills may have changed since the run. Take the audited turn's first timestamp, which is UTC. In the skills repo, `TZ=UTC git reflog --date=iso-local` lists each checkout in UTC. Installed skills follow the checkout, so pin the SHA HEAD pointed at then. Use `git rev-list -1 --before=<ts> <branch>`, with `origin/<branch>` in a fresh clone, only when the reflog no longer reaches that far, and say so. Extract it with `git archive <commit> skills agents | tar -x -C <scratch>/pinned`. Use that tree for every later step.

## 3. Trace the transcript

Run `node scripts/trace.mjs <transcript> --skills <scratch>/pinned/skills` from this skill's directory. It numbers each event and groups them into turns. It lists user messages, the agent's replies, plans, spawns, and each skill or agent file whose content a tool returned, plus each subagent and the turn it started in. `--full --from N --to M` adds tool calls and full inputs, such as a brief or a workflow script, in a range. `--subagent <label>` prints one subagent. A file counts as read only from its content in tool output, never from a path in a command. `partial, top only` or `partial, end only` means one of its two fingerprints matched. Each LOADED line names the call that returned it. Check that call with `--full` before you call the file read.

## 4. Build the intended flow

Build it from the pinned files, not from memory. Match the audited request to a playbook or routed skill per the pinned [`cortex`](../cortex/SKILL.md) routing. Walk each step of the playbook, or each section of the routed skill. Expand every skill a step routes to into the actions it requires: its mode, spawns, searches, and the output it must return. Add the cortex triggers that fired, such as the verbatim todolist copy. Keep a step only when its trigger held, and cite the event that shows it held. A runtime skill the user invoked from outside the repo cannot be pinned. Treat it as context that can explain a substitution.

Write one row per required action, with the source `file:line` and the event that would prove it happened.

## 5. Grade each step

Split a step into one row per required action, so a partly followed step shows its followed and missing parts. Give each row one verdict with event numbers:

- **Followed.** The required actions appear.
- **Read only.** The skill loaded, and its required actions are missing.
- **Substituted.** The agent did the work another way, such as tracing inline instead of spawning the explainer.
- **Skipped with reason.** A `skip:` todo or the reply names the skip and why.
- **Skipped silently.** No load and no stated skip.
- **Not triggered.** The step's condition did not hold.
- **Unverifiable.** The transcript does not record it, such as the model a spawn ran on.
- **After the window.** The step falls after the audited turn.

The agent's later explanation of what it did is a claim to check, not evidence.

## 6. Find the cause in the skill text

For each gap, quote the pinned sentence that allowed it and name the cause:

- The steps are alternatives, so the todolist copy makes no sense.
- The trigger names no skill, or reaches it through another step.
- The mode or depth is unstated.
- The wording reads as optional.
- An expensive step offers no cheaper path.
- Nothing says the step runs when the evidence already looks decisive.
- The reply contract lets the skip go unreported.
- Two files disagree.

When the text was clear and the agent ignored it, say so. Then the fix is structure, not wording.

## 7. Recommend

Give one change per gap, strongest first, per [Encode Lessons in Structure](../principles/encode-lessons-in-structure.md). A script or check beats a step whose output must appear in the todolist or reply, which beats a rewrite. Checks that exist here are a rule in the repo's skill checker, a script a step must run and paste, a hook, and this trace run in an Eval. For each, give the file, the current sentence, and the proposed text. Mark each change to agent behavior for the [Eval](../cortex/playbooks/eval.md) playbook before it lands. To apply a change, read and follow the [Authoring a skill](../cortex/playbooks/authoring-a-skill.md) playbook on its own branch.

**Reply:** the session and the pinned commit, the flow table with verdicts and events, each cause with its quoted sentence, the ranked changes, and what the transcript could not show.
