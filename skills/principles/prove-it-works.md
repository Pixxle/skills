# Prove It Works

Verify every task output by checking the real thing directly. Do not infer from proxies, self-reports, or "it compiles."

**Why:** Unverified work has unknown correctness. Indirect verification (file mtimes, output freshness, agent self-reports, cached screenshots) feels cheaper than direct observation. Acting on a wrong inference costs far more than checking the source.

Check the real thing, not a proxy:
- Check process liveness directly, not indirectly through derived state
- Read the actual value, not a cached or derived representation
- Check on the real surface, the one the change's users touch (the UI, the CLI, the API response), not a neighbor that is easier to reach
- When verification fails, suspect the observation method before suspecting the system

## Script the check when you can

The strongest proof is a deterministic script that re-runs the same comparison, not a one-time eyeball. Write the script, run it, and keep its output as an artifact a reviewer can re-run instead of trusting your word.

Keep the artifact visible for the human. Commit it only for large or complex work where the trail has to be auditable later, like a big port or migration. For that trail, read and follow the decision-trail mode of [`handoff`](../handoff/SKILL.md).

## Combinations

- **With the [Laziness Protocol](laziness-protocol.md).** Ship the smallest change the evidence justifies. A belt-and-suspenders addition that "might help" fails both.
- **With [Sequence Work into Verifiable Units](sequence-verifiable-units.md).** Each unit's check is a real-surface check, not "it compiles." Failing-then-passing commit order is the stacked form.
