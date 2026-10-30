# Guard the Context Window

When outputs, files, or repeated reads pile up, route the bulk to subagents and keep their summaries, not raw payloads, in the main thread.

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress.

**Pattern:**
- **Route bulk to subagents.** Large outputs, long files, and repeated reads go to a subagent. The main thread keeps the subagent's summary, not the raw payload.
- **Size phases and cap scope.** Limit files per phase, set turn budgets, account for mechanism costs. Size each phase so no context overflows mid-task.
