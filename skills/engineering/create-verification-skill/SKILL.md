---
name: create-verification-skill
description: Generate a committed, project-local verify-<app> skill that launches the app, drives it the way a user does on web, CLI, API, iOS simulator, or Android emulator, captures evidence, and seeds a feature map of what proves each feature works. Use when a repo has no scripted way to prove behavior on the real surface, when the user asks for a verify or control skill for this repo, or when repros and pre-merge checks keep needing hand-rolled click-through scripts.
---

# Create a verification skill

A serious project needs a scripted way to drive the real app and prove behavior. This skill generates one as a project-local skill tailored to the repo. The generated skill launches the app, exercises a feature the way a user would, and captures evidence. Write it for the next agent, not for a human. That agent reads it cold, mid-task, and has never seen the app.

## Where the generated skill lives

Claude Code reads project skills from `<repo>/.claude/skills/<name>/`. Codex reads them from `<repo>/.agents/skills/<name>/`. Keep one real copy and link the other.

- The canonical directory is `.agents/skills/verify-<app>/`. It is the shared project path Codex reads, and the canonical copy for the `skills` CLI. Claude Code reads `.claude/skills/`, so it gets the link.
- `.claude/skills/verify-<app>` is a relative symlink to `../../.agents/skills/verify-<app>`. One tree means one place to edit, and the maintenance pass never reconciles two drifting copies.
- If either skills directory is already a symlink to the other, both runtimes already see one tree. Write the skill there once and skip the per-skill link.
- Commit both the directory and the symlink. Run `git check-ignore -v` on both paths first. If either is ignored, ask the user before forcing it in.

```sh
mkdir -p .agents/skills/verify-<app> .claude/skills
ln -s ../../.agents/skills/verify-<app> .claude/skills/verify-<app>
```

The rest of this skill calls the canonical directory `<skill-dir>`.

## 1. Interview the repo, not the user

Answer these from the codebase. Ask the user only what you cannot observe.

- **Surface.** What does a user touch? A web UI, a CLI or TUI, an API, a desktop app, an iOS or Android app, a library. A repo can have several. Pick the primary one and note the rest. A feature reachable from several surfaces lists each one as an entry point in the map.
- **Run.** How does the app start locally? Prefer the repo's own documented dev command (package scripts, Makefile, README quickstart). Note ports, env vars, seed data, and auth. For a mobile app, note the build command and the backend the app points at.
- **Drive.** How can an agent interact with it programmatically? Reuse an existing harness first, such as Playwright or Cypress specs, expect scripts, PTY helpers, curl-able endpoints, a debug port, or XCUITest, Espresso, Detox, or Maestro flows. Only then pick a generic recipe. Use browser automation over CDP for web and Electron, a tmux or PTY session for CLI and TUI, plain HTTP for services, and [references/mobile.md](references/mobile.md) for the iOS simulator and Android emulator.
- **Observe.** What evidence can be captured? Screenshots, recordings, terminal transcripts, response bodies, app and device logs, exit codes, DB state.
- **Isolate.** Can two instances run side by side (ports, data dirs, profiles, a dedicated simulator or emulator)? If not, say so in the generated skill. Refusing to double-drive a shared instance beats corrupting the user's session.

If the checkout does not build or start as-is, fix that first or report it precisely before generating. A skill written against a broken base teaches wrong steps. When an irrelevant missing asset blocks startup (a static dir the API never serves, a sample config), the generated skill may create it, marked as verification scaffolding, and remove it in cleanup.

## 2. Generate the skill

Write `<skill-dir>/SKILL.md`. Its frontmatter holds only `name: verify-<app>` and a `description` that names the app, the surface, and when to reach for it (verify a change, reproduce a bug, prove a PR before merge). Without frontmatter the skill never registers. Write commands any agent can run, never a tool only one runtime has, because both Claude Code and Codex load it. Ground every section in what the interview found. Leave no placeholders.

- **Launch.** The exact command that starts the app for verification, and how to tell it is ready (a log line, a prompt, a known element on the first screen). Launch reaches a usable state from an empty data dir, including migrations and seed data. Ready means usable, not just that a process answers. A database health check can pass while its init scripts still run. Include teardown. A short-lived CLI or TUI has no server to keep alive. There, launch means build the binary or install deps once, then start each drive in its own isolated PTY or tmux session. A mobile app launches on a simulator or emulator this run created, with the build installed and the backend reachable.
- **Doctor.** One read-only check that answers "is this instance worth driving?" Process up, right version or build, port owned by us, auth valid. An agent runs it first whenever anything looks off.
- **Drive.** The harness recipe with real selectors and commands from this repo, not examples. Prefer stable handles (ARIA labels, data attributes, accessibility identifiers, prompt strings, route paths, deep links) over coordinates and tab order.
- **Evidence.** What to capture for a proof and where it goes. State these proof standards in the skill.
  - Exercise the real user path, not internal setters or test-only endpoints.
  - Capture the action and the resulting state, not just the final screen.
  - Verify side effects (files written, rows inserted, messages sent) alongside what is visible.
  - Mock only where a production boundary already isolates the external system.
  - When the safe path is a dry-run or test mode, observe what it skips (files, network, git refs) instead of trusting its name. Some dry-runs still touch the network or open a browser.
- **Cleanup.** How to tear down what the run created. Never kill by process name. Kill what you started. Cleanup removes instances and scratch state, never the evidence. Proof artifacts survive teardown in a location the skill names.
- **Helpers.** Every script the skill ships is executable, and the skill body shows its invocation. A helper the reader has to reverse-engineer is not a helper. When agents keep writing throwaway glue to click through the app, ship a small control CLI instead ([principles](../principles/SKILL.md), build the lever). Give it a few composable commands, `--dry-run` on anything destructive, JSON output, useful `--help`, and errors that say what to do next.

## 3. Seed the feature map

Create `<skill-dir>/features/README.md` plus one file per user-facing feature you can identify. Aim for the top 3 to 5 to start, from routes, commands, screens, menus, or docs. Follow the shape in [references/feature-map-example/](references/feature-map-example/README.md), a README index plus one file per feature. Each file answers, from the user's point of view, what the feature is, how to reach it, how to drive it with the harness, and what observable end state proves it works. The four H2s are `Sub-features`, `How to get to it (user POV)`, `Driving it with <harness>`, and `Gotchas`.

If the seed data lacks a precondition a journey needs, the journey reports a failure and the reason goes in that feature's `Gotchas`. Never weaken the journey to make it pass. The map is the repo's maintained verification source. A proof that drives one convenient entry point is incomplete when the map lists others.

## 4. Prove the generated skill before handing it over

A generated skill that was never executed is a draft, not a deliverable. Run its own instructions end to end once. Launch, doctor, drive one mapped feature, capture evidence, clean up. One feature is enough. The map exists so later runs cover the rest.

- When the runtime can spawn a subagent, run the proof from a fresh one briefed with only `<skill-dir>/SKILL.md` and the feature to drive. The author fills gaps from memory. A cold reader hits them.
- After cleanup, confirm the evidence still exists at the named location. A cleanup that eats the proof fails this step.
- Fix what fails. Run the generated cleanup after every failed iteration too, so broken attempts do not strand processes, ports, simulators, or emulators.
- Confirm both runtimes can find it. `.claude/skills/verify-<app>/SKILL.md` resolves through the link, and `git ls-files -s .claude/skills/verify-<app>` shows mode `120000` once staged.
- If you proved it in a stand-in for the real target (a container in place of a fresh VM, a local stack in place of a remote one, one platform of a two-platform app), list every setup step the stand-in did that the target will not. Those steps stay unverified until a run on the real target covers them.

## 5. Hand off

Report the canonical path and the symlink, the feature you proved, where its evidence lives, and any unverified stand-in steps. Point the user at [maintain-verification-skill](../maintain-verification-skill/SKILL.md) to keep the map honest as the app changes. Suggest a cadence only if they ask.

From then on, same-surface checks in [fix-bug](../fix-bug/SKILL.md) and [shipping](../shipping/SKILL.md) drive the app through the generated skill.
