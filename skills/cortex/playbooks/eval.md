### Eval

**Blinding rules. A candidate must not know it is being measured.**

- No "eval", "test", "judge", "experiment", "rubric", "score", "compare", "benchmark", "candidate", or "arena" in any directory, file, slug, or prompt the candidate sees, when the word describes the run. Use project-shaped names a user might pick.
- Never ask a candidate which skills, principles, or files it applied. Ask for design notes generally.
- Never tell a candidate that other candidates exist.
- The judge may know it is judging, but sees outputs only by sanitized label, never by model name or arm.

**Steps:**

1. **Frame.** Name the variant and the baseline it would replace, usually the current version. Name the behavior that counts as success and the gap that would change the promote decision, per [Explain the Number](../../principles/explain-the-number.md). Write a 3 to 6 criterion rubric and show it only to the judge.
2. **Set up sanitized environments.** One working dir per candidate, half with the variant and half with the baseline, identical otherwise. Plant any context an organic task would have: a project skeleton, the skills the candidate would naturally read, and each arm's version of the skill under test in its own dir, where the task leads the candidate to read it.
3. **Author one organic prompt.** What a user would type. It states the organic task's goal, not what is measured.
4. **Spawn the candidates** in parallel as general-purpose subagents, with models chosen per the [`arena`](../../arena/SKILL.md) skill's Phase A step 3 and launched per its Phase B. Every model runs both arms, at least two trials per arm.
5. **Spawn one blinded judge** as a general-purpose subagent per the [`arena`](../../arena/SKILL.md) skill's Phase C. It scores every output from both arms in a single pass on one scale, and skips the base recommendation.
6. **Verify the chain from transcripts, not self-report.** Read each candidate's own local transcript, never a glob across every project's transcripts, which reads private chats from unrelated projects. Confirm that each candidate read its arm's copy of the skill, not the installed one. Grade chain-following from the files each candidate opened and the shape of its code.
7. **Score every output yourself**, criterion by criterion, and reconcile with the judge per the first paragraph of the [`arena`](../../arena/SKILL.md) skill's Phase D. Skip base selection. Recommend promotion only when the gap beats the trial-to-trial spread on every model that ran. If only one model ran, say so in the reply.

**Reply:** variant and baseline, rubric, trials per arm and model, per-candidate notes, judge's verdict, your synthesis, and whether to promote the variant.
