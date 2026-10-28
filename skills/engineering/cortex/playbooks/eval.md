### Eval

**You own the experiment design. Plan, blind, run, synthesize.**

Use for a blind A/B of a skill or prompt change, or before adopting someone else's skill. When [Authoring a skill](authoring-a-skill.md) or [`reflect`](../../../productivity/reflect/SKILL.md) changes a skill, ask for the eval in the same task. A fix written from one bad session tends to overfit it.

An agent that knows it is being evaluated behaves differently. Every rule below guards against that.

**Blinding non-negotiables:**

- No "eval", "test", "judge", "experiment", "rubric", "score", "compare", "benchmark", "candidate", or "arena" in any directory, file, or prompt a candidate sees.
- The candidate prompt looks like an organic user request. State the goal, not the meta.
- No chain-eliciting cues. Don't ask a candidate to list the skills, principles, or files it applied. Ask for design notes generally. Grade chain-following from transcripts and code shape, never from self-report.
- Sanitize directory and slug names. Use project-shaped names a user might pick.
- Don't tell a candidate other candidates exist.
- The judge may know it is judging. It sees outputs by sanitized label only, never by model or variant name.
- When comparing two variants, one judge scores both sets in a single pass on one scale, blind to which set each came from.

**Steps:**

1. **Frame.** Name the variant under test and the baseline it competes with. State what behavior counts as success. Write a rubric of 3 to 6 concrete criteria for the judge only, and hold it back from candidates.
2. **Set up sanitized environments.** Give each candidate its own working dir with a project-shaped name, in its own git worktree or temp copy. Install the variant or the baseline as the only copy of that skill or prompt the candidate can load. A globally installed copy of the same skill contaminates the run. Plant the context an organic task would have, such as a project skeleton and the skills a user's session would naturally see.
3. **Author one organic prompt.** Write what a user would type in that project. Use the same prompt for every candidate. Leak nothing about what is measured.
4. **Spawn candidates in parallel**, the same number per variant. Start each as a fresh agent session whose working directory is its sanitized dir, so it finds skills and instruction files the way a user session would. A subagent of this session may inherit this session's skills, so check what each candidate can load before trusting the isolation. Spread candidates across models when the runtime offers several, and run each variant on the same models so the variant is the only difference. Pick each candidate's reasoning effort for the job when the runtime offers a choice, and keep it the same across variants. To spawn them, read and follow phase B of [`arena`](../../arena/SKILL.md).
5. **Spawn one blinded judge.** Read and follow phase C of [`arena`](../../arena/SKILL.md). Run the judge on a different model family than the candidates when the runtime offers one, otherwise the parent model. Copy the outputs to neutral paths under shuffled labels and keep the label-to-variant key yourself. The judge gets the rubric and every labeled output and scores them in one pass.
6. **Verify the chain from transcripts, not self-report.** Chain-following means a candidate opened the skill and the files it links when the task called for them. Read each candidate's transcript and list the files it actually opened. Claude Code keeps sessions at `~/.claude/projects/<workspace-slug>/<session>.jsonl` (under `$CLAUDE_CONFIG_DIR` when set), where the slug is the absolute workspace path with every character other than letters and digits replaced by `-`. A candidate run as its own session lands under its sanitized dir's slug. One spawned as a subagent lands under this session's `<session>/subagents/`. Codex writes `${CODEX_HOME:-~/.codex}/sessions/YYYY/MM/DD/rollout-<time>-<id>.jsonl`, so match on the working directory in each file's metadata line. Read only this experiment's transcripts and never glob across other projects. That crosses workspace boundaries and reads private chats from unrelated projects. Grade from the files each candidate really read plus the shape of its code.
7. **Read every candidate output yourself** end to end and compare it with the judge's verdict. When you disagree, suspect the rubric before your own judgment, then model bias. Synthesize.
8. **Clean up.** Remove the sanitized dirs and worktrees, and restore any skill install you moved in step 2.

**Reply:** variant under test, rubric, per-candidate notes (label, variant, model, files opened), judge's verdict, your synthesis, and a recommendation on whether to promote the variant.
