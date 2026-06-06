---
name: to-issues
description: Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issues, create implementation tickets, or break down work into issues, optionally embedding Claude Design mockups (downloaded as a zip) inline per slice so they don't expire.
---

# To Issues

Break a plan into independently-grabbable issues using vertical slices (tracer bullets).

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes an issue reference (issue number, URL, or path) as an argument, fetch it from the issue tracker and read its full body and comments.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Issue titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

### 3. Draft vertical slices

Break the plan into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories this addresses (if the source material has them)

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?

Iterate until the user approves the breakdown.

### 5. Publish the issues to the issue tracker

For each approved slice, publish a new issue to the issue tracker. Use the issue body template below. These issues are considered ready for AFK agents, so publish them with the correct triage label unless instructed otherwise.

Publish issues in dependency order (blockers first) so you can reference real issue identifiers in the "Blocked by" field.

If the plan includes Claude Design mockups, also follow **Attaching Claude Design assets** below to embed the relevant design in each slice it illustrates.

<issue-template>
## Parent

A reference to the parent issue on the issue tracker (if the source was an existing issue, otherwise omit this section).

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Designs

Only if a mockup illustrates this slice. The relevant design(s) embedded inline as `![caption](assetUrl)` using the permanent Linear-hosted URL — see **Attaching Claude Design assets** below. Omit this section when the slice has no design.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- A reference to the blocking ticket (if any)

Or "None - can start immediately" if no blockers.

</issue-template>

Do NOT close or modify any parent issue.

## Attaching Claude Design assets

If the source PRD or the user includes Claude Design mockups, embed the relevant ones in the issues. Claude Design's own URLs expire, so the images must be re-hosted on Linear. The user provides the design as a downloaded **zip**.

1. **Reuse if already hosted.** If `/to-prd` already uploaded these designs, reuse its `uploads.linear.app` `assetUrl`s directly and skip to step 5. Otherwise continue.

2. **Locate and inventory.** Use the zip path the user gives, else the newest `*.zip` in `~/Downloads` (confirm first). Run `scripts/inspect-design-zip.sh [zip-path]`: it unzips to a temp dir and prints one tab-separated line per embeddable image — `<bytes>`, `<mime>`, `<path>` — and lists non-raster files (SVG, HTML, source) as `OTHER` on stderr.

3. **Map designs to slices.** Agree with the user which mockup illustrates which slice; a design is embedded only in the issue(s) it belongs to. A whole-feature design belongs in the PRD — reference it rather than repeating it on every issue.

4. **Re-host each image on Linear.** Anchored to the issue it belongs to, run these back-to-back per image so the signed URL stays valid:
   - `prepare_attachment_upload` with `issue`, `filename`, `contentType`, and `size` (the bytes from the inventory — a wrong size returns HTTP 403).
   - PUT the raw bytes within **60 seconds**, passing every header from `uploadRequest.headers` verbatim (casing matters): `curl -X PUT --data-binary @"<path>" -H "<k>: <v>" … "<uploadRequest.url>"`.
   - Keep the returned permanent `assetUrl`. Don't base64-encode or transform the file; inline embedding does NOT need `create_attachment_from_upload`.

5. **Embed inline.** Add the mapped design(s) to that issue's `## Designs` section as `![caption](assetUrl)` via `save_issue`, using the Linear `assetUrl` only — never the original Claude Design link.

