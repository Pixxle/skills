### Trace forensics

**You own the diagnosis from the artifact.** The artifact is a fixed dataset. Read it, don't re-run it.

1. Identify the format, then dump it into sqlite with a script, one row per sample, frame, or node, per the [Build the Lever](../../principles/build-the-lever.md) principle. Use a DevTools or trace parser for cpuprofile and `.json.gz` traces, and your heap tooling for a heapsnapshot. A text spindump small enough to grep can skip the dump. Never read a raw artifact into context. Delegate a large dump to a subagent per the [Guard the Context Window](../../principles/guard-the-context-window.md) principle.
2. Confirm the capture holds the symptom before you narrow. For a profile or trace, check the time window, the sample count, the process and thread, and the share spent idle or in GC. For a heap snapshot, check that it was taken after the growth.
3. Narrow to the cause. Rank frames by self time, then walk callers by total time to the hot path. For a leak, follow the retainer chain from the leaked object to a GC root. For a spindump, find the thread stuck on-CPU or blocked and its wait reason.
4. Attribute to source. Map the hot frame to file, symbol, and line through the artifact's symbols, plus source maps or debug symbols for minified or stripped code. A frame with no source mapping is not yet a diagnosis. Resolve the symbols, or say plainly the artifact does not carry them.
5. If you have a paired capture, check that both cover the same build and workload, normalize by duration or sample count, and diff them to confirm. Otherwise, mark the finding as the strongest hypothesis the artifact supports, not a confirmed cause.
6. If the artifact cannot settle the cause, name the capture that would. Route to [Runtime forensics](runtime-forensics.md) when the live process is reachable.
7. Hand back the cited diagnosis, no fix unless asked. Route a fix to [Bug fix](bug-fix.md) or [Perf issue](perf-issue.md).

**Reply:** the artifact and format, the reduced finding, the source location, the sqlite path and the queries that produced the finding, and whether a paired capture confirmed it.
