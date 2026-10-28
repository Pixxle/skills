### Shipping

**You own what lands. Verify each PR independently, land only the verified run from the root, then keep your hands off the stack.**

Green is not safe. Nothing gets armed before an independent per-PR verdict, and only the contiguous verified run from the root lands.

1. **Read and follow [`shipping`](../../shipping/SKILL.md) in full.** Resolve the forge once and keep it.
2. **Verify each PR independently before it lands.** One verifier per PR, none of which wrote the code, runs the change the way a user would, parent against head, and posts `PASS`, `PASS+NOTES`, or `FAIL` on that PR. Green CI and an approving bot review are not verdicts.
3. **Land only the contiguous verified run rooted at the bottom.** The first PR without `PASS` or `PASS+NOTES` caps the run. Before trusting an older verdict, compare `git patch-id` at the verdict SHA with the current head.
4. **Land bottom-up, one PR at a time.** Read each PR back after the merge command, because a queued merge or an armed auto-merge is not a merge. Arm auto-merge only on a PR whose verdict covers its current head.
5. **Leave the stack alone while it lands.** Moving the next PR onto trunk is the only change to a branch or base. On GitHub, watch the run with babysit's queued watcher until it reports `COMPLETE` at the ceiling. It is not on `PATH`. Call it by absolute path, `../../babysit/scripts/watch-pr/watch-pr` resolved from this playbook's real path, in the target repo's checkout, as `<watch-pr> --owner <owner> --repo <repo> --queued-stack --stack-prs <bottom-to-top>`. [`shipping`](../../shipping/SKILL.md) step 5 says how to act on each verdict. If a merge stalls, find out why before you change anything.
6. **Stop at the ceiling.** Extending the run takes new verdicts, so it is a new pass through step 2.
7. **Stay in your lane.** Do not babysit CI here. That is [Babysit](babysit.md). Do not post human review voice here. That belongs to [`pr-comments`](../../pr-comments/SKILL.md).
8. **Autonomy.** Merge only when the user asked to ship, land, or merge, or a full-autonomy grant explicitly covers landing. Otherwise pause.

**Reply:** the verified run and its ceiling, each PR's verdict and who produced it, what landed and how you confirmed it, what remains unmerged and why, and what the next gap needs.
