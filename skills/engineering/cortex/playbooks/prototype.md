### Prototype

**You own the design decision, not the code. The prototype is a throwaway instrument. The real build follows Feature.**

This is the one playbook where the "smallest change" of [`principle-laziness-protocol`](../../principle-laziness-protocol/SKILL.md) and the verification bar invert. Speed over polish. Code quality does not matter. No planning. The rigor is in picking the right design cheaply. Propose variations the user didn't ask for. Throw an approach away and try another.

1. **Scope the decision** the prototype exists to make. That is which layout, which interaction, which density, or for an empirical fork which behavior, timing, or approach. No decision means no prototype. Route to [Feature](feature.md).
2. **Load the skill.** Read and follow [`prototype`](../../prototype/SKILL.md). Pick its logic or UI branch from the decision being made.
3. **Gather references when the design space is open.** Search for prior art. Summarize a moodboard of themes, palettes, and layouts. Let the user pick directions before you build. Skip this when the direction is set.
4. **Build throwaway, apart from production code.** Where the prototype goes depends on the branch. When this step and the skill's rules differ, follow the skill's rules for both branches.
   - **UI decision.** Follow the skill's UI branch. With a host page, render the variants on that page behind `?variant=`. With none, use its named throwaway route when the sketch needs the app's runtime. Otherwise build in an isolated scratch dir with vanilla HTML/CSS/JS or the lightest stack that renders the idea, CDN deps, and a dev server with hot reload.
   - **Logic or state-model decision.** Follow the skill's logic branch. Put the prototype next to the module it is for, in the host project's language and tooling. Isolate the logic in a portable module under a thin terminal shell, and run it with one script in the project's existing task runner.
   - **Behavioral or timing probe.** Write the smallest script that exercises the question. Put it next to the code it probes, per the skill's rule to keep a prototype close to where it is used. Use an isolated scratch dir only when the probe is tied to no module.

   In a scratch dir, use no production framework. In every case, write no tests and add no abstractions beyond the logic branch's portable module.
5. **Compare alternatives behind one switcher** (buttons or a keypress), each variant labeled. This is [`principle-exhaust-the-design-space`](../../principle-exhaust-the-design-space/SKILL.md) made cheap.
6. **Verify on the matching surface.** For a visual decision, screenshot each variant through the repo's `verify-*` skill when it has one ([cortex's Non-negotiables](../SKILL.md#non-negotiables)), and drive the interaction. For a logic, behavioral, or timing decision, observe the thing you are deciding. Drive the cases, log the timing, print the output, or watch the render. The observation is the test here, not an assertion. The observation settles the empirical fork. Do not ask the human what the prototype already shows.
7. **Present and hand off.** Give the alternatives, trade-offs, and a recommendation. The output is the decision plus the throwaway artifact, not shippable code. Capture the answer somewhere durable. Delete or absorb the throwaway per the skill's rules once the decision is settled. Until then it stays at its path for the user to try. Hand the chosen direction to [Feature](feature.md) for the real build, where [`architect`](../../architect/SKILL.md) settles the production shape.

**Reply:** the decision the prototype served and which branch, the variants explored, the evidence (screenshots for a visual decision, the observed state, output, or timing for a logic or behavioral one), trade-offs, your recommendation, the prototype path, and whether it was kept for review, deleted, or absorbed. Say plainly that the prototype is throwaway.
