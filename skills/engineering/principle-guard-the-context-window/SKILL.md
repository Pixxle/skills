---
name: principle-guard-the-context-window
description: Keep the main thread's context small. Route bulk work to subagents and keep their summaries, not raw payloads, in the main thread, and size phases so no context overflows mid-task. Use when context is filling up with large outputs, long files, or repeated reads, or when planning a fan-out.
disable-model-invocation: true
---

# Guard the Context Window

When outputs, files, or repeated reads pile up, route the bulk to subagents and keep their summaries, not raw payloads, in the main thread.

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress.

**Pattern:**
- **Route bulk to subagents.** Large outputs, long files, and repeated reads go to a subagent. The main thread keeps the subagent's summary, not the raw payload.
- **Size phases and cap scope.** Limit files per phase, set turn budgets, account for mechanism costs. Size each phase so no context overflows mid-task.
