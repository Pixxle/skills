### Trace forensics

**You own the diagnosis from the artifact.**

Distinct from [Runtime forensics](runtime-forensics.md), which instruments the live process. Here the capture already exists. The artifact is a fixed dataset. Analyze it as captured. Do not re-run it. Keep tooling generic: a DevTools or trace parser for a cpuprofile or `.json.gz` trace, a text editor for a spindump, and your heap tooling for a heap snapshot.

1. Identify the format and load it with the right tool. Parse large artifacts in a subagent ([`principle-guard-the-context-window`](../../principle-guard-the-context-window/SKILL.md)) and keep the reduced finding in the main thread. Pick each subagent's model per [cortex's Subagents section](../SKILL.md#subagents), and its reasoning effort for the job when the runtime offers a choice.
2. Transform the raw artifact into a form you can query. Dump the trace or heap snapshot into sqlite, one row per sample, frame, or node. Reach the queryable shape before you read.
3. Narrow to the cause. Query for the frames that hold the most time and walk the call tree to the hot path. For a leak, follow the retainer chain from the leaked object to a GC root. For a spindump, find the thread that is stuck on-CPU or blocked, and its wait reason.
4. Attribute to source. Map the hot frame to file, symbol, and line through the artifact's own symbols. A frame with no source mapping is not yet a diagnosis. Resolve the symbols, or say plainly that the artifact does not carry them.
5. If you have a paired capture, diff the before and after artifacts to confirm. Otherwise, mark the finding as the strongest hypothesis the artifact supports, not a confirmed cause.
6. Hand back a cited diagnosis, with no fix unless asked. Route to [Bug fix](bug-fix.md) or [Perf issue](perf-issue.md) once the cause is known. The throughput checkpoint ([Feature](feature.md) step 4) stays one line: `throughput checkpoint: n/a, read-only forensics`.

**Reply:** the artifact and its format, the reduced finding, the source location, the artifact paths, and whether a paired capture confirmed it.
