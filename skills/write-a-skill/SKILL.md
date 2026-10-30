---
name: write-a-skill
description: Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.
disable-model-invocation: true
---

# Writing Skills

## Process

1. **Gather requirements** - ask user about:
   - What task/domain does the skill cover?
   - What specific use cases should it handle?
   - Does it need executable scripts or just instructions?
   - Any reference materials to include?

2. **Draft the skill** - create:
   - SKILL.md with concise instructions
   - Additional reference files if SKILL.md would exceed 100 lines
   - Utility scripts if deterministic operations needed

3. **Review with user** - present draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?
   - Should any section be more/less detailed?

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── references/        # Detailed docs (if needed)
├── assets/            # Templates or output resources (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md Template

```md
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
disable-model-invocation: true
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

Every skill is explicit-only in Claude Code through `disable-model-invocation: true`. Codex reads no such flag from `SKILL.md`, so Codex can still invoke a skill implicitly.

The user starts the skill by typing its name. A router or another skill loads it by reading its `SKILL.md` at a relative link, never by invoking it by name, which the runtime blocks. So in a skill body, write every backticked skill name as the text of a link to that skill's `SKILL.md`, and phrase a routed step as "read and follow" plus that link.

## Description Requirements

The description is what the user sees when picking a skill by name, and what a router reads when choosing where to send a step. Claude Code never auto-loads a skill with `disable-model-invocation: true` from its description.

**Goal**: Give the reader just enough info to know:

1. What capability this skill provides
2. When/why to trigger it (specific keywords, contexts, file types)

**Format**:

- Max 1024 chars
- Write in third person
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"

**Good example**:

```
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

**Bad example**:

```
Helps with documents.
```

The bad example gives the reader no way to distinguish this from other document skills.

## When to Add Scripts

Add utility scripts when:

- Operation is deterministic (validation, formatting)
- Same code would be generated repeatedly
- Errors need explicit handling

Scripts save tokens and improve reliability vs generated code.

## When to Split Files

Split into separate files when:

- SKILL.md exceeds 100 lines
- Content has distinct domains (finance vs sales schemas)
- Advanced features are rarely needed

## Review Checklist

After drafting, verify:

- [ ] Description includes triggers ("Use when...")
- [ ] Folder name equals the frontmatter `name`, in lowercase kebab-case, at most 64 characters
- [ ] Frontmatter contains `name`, `description`, and `disable-model-invocation: true`
- [ ] Every backticked skill name is the text of a link to that skill's `SKILL.md`
- [ ] A step that loads another skill says to read and follow its linked `SKILL.md`, never to invoke it
- [ ] SKILL.md under 100 lines
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] References one level deep
- [ ] Bundled-resource paths are relative to the skill directory
- [ ] Tool instructions describe capabilities, not runtime-specific tool names
- [ ] The skill passes the target runtime's validator
