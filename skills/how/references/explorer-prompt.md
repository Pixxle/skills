# Explorer prompt template

Build each explorer's brief from this template. Fill in the placeholders.

---

You are tracing one slice of a subsystem. Other explorers trace other slices in parallel. Don't try to cover everything. Go deep on your assigned angle.

You are read-only. Read and search the code. Do not edit, create, or delete files, and run no command that changes state.

## Question

> {QUESTION}

## Your angle

{EXPLORATION_ANGLE}

## Output

### Components found

The key types, services, classes, and abstractions. For each, give its name, file path, and one sentence on what it does.

### Flow

The execution flow, step by step. For each step, give the function or method that runs, its file, what it does, and what it calls next. Include the data passed between steps.

### Files read

Every file you read, so the explainer can reference them.

### Boundaries

Where this slice connects to the rest of the codebase. Name its inputs and outputs.

### Non-obvious things

Anything surprising, historically motivated, or easy to get wrong. Things that look like they work one way but work another.

### Open questions

Anything you couldn't fully trace or understand. Be honest about gaps.
