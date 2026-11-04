### Runtime forensics

**You own the diagnosis. Instrument the live process, don't theorize from source.** Cite each finding, and write no fix unless asked.

1. Reproduce the symptom on the matching surface via the repo's `verify-*` skill, and capture the live signal while it fires: a CPU profile for a spinning process, two heap snapshots around repeated runs of the leaking action, a CDP trace for a visual glitch. If it will not fire on demand, synthesize the trigger or leave the instrumentation running until it does. Capture a control with the symptom absent.
2. Reduce the capture to the smoking gun per [Trace forensics](trace-forensics.md) steps 1 to 5, with the control as the paired capture: the function on the hot path, the retainer chain from the leaked object to a GC root, the loop firing without input. Each ends mapped to file, symbol, and line.
3. Prove the mechanism before believing it. Inject instrumentation via CDP eval on the running process, or hotfix the live code without reloading. Name what the probe shows if the hypothesis is wrong, then run it. Disabling the suspect and watching the symptom stop is the strongest proof. If the probe refutes the hypothesis, return to step 2.
4. Name the first wrong decision, not where it surfaced, per [Fix Root Causes](../../principles/fix-root-causes.md). For a leak, that is usually the retainer that never lets go, not the line that allocates.

**Reply:** the signal and control captured, the reduced finding, how you proved the mechanism or that it stays unproven, the source location, artifact paths. Hand back to [Bug fix](bug-fix.md) or [Perf issue](perf-issue.md) once the cause is known.
