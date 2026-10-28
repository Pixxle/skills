### Runtime forensics

**You own the diagnosis. Instrument the live process. Do not theorize from source.** The deliverable is a cited diagnosis, not a fix.

1. Capture the live signal on the matching surface. Drive that surface through the repo's `verify-*` skill when it has one (**Same-surface verification** in [cortex's Non-negotiables](../SKILL.md#non-negotiables)). Take a CPU profile for a spinning process, a heap snapshot for a leak, or a Chrome DevTools Protocol (CDP) trace for a visual glitch. Capture a real artifact, not a guess.
2. Reduce the artifact to the smoking gun. That is the function on the hot path, the retainer chain from the leaked object to a GC root, or the loop that fires without input. Parse large artifacts in a subagent ([`principle-guard-the-context-window`](../../principle-guard-the-context-window/SKILL.md)) and keep the reduced finding in the main thread. Pick each subagent's model per [cortex's Subagents section](../SKILL.md#subagents), and its reasoning effort for the job when the runtime offers a choice.
3. Prove the mechanism before you believe it. Inject instrumentation into the running process through a CDP evaluate call, or hotfix the live code without reloading, to confirm the hypothesis cheaply.
4. Map the finding back to source. Name the file, the symbol, and the line that allocates or schedules.
5. The throughput checkpoint ([Feature](feature.md) step 4) stays one line: `throughput checkpoint: n/a, read-only forensics`.

**Reply:** the signal captured, the reduced finding, how you proved the mechanism, the source location, and the artifact paths. No fix unless asked. Hand back to [Bug fix](bug-fix.md) or [Perf issue](perf-issue.md) once the cause is known.
