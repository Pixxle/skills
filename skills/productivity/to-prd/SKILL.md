---
name: to-prd
description: Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context, optionally embedding Claude Design mockups (downloaded as a zip) inline so they don't expire.
---

This skill takes the current conversation context and codebase understanding and produces a PRD. Do NOT interview the user — just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the major modules you will need to build or modify to complete the implementation. Actively look for opportunities to extract deep modules that can be tested in isolation.

A deep module (as opposed to a shallow module) is one which encapsulates a lot of functionality in a simple, testable interface which rarely changes.

Check with the user that these modules match their expectations. Check with the user which modules they want tests written for.

3. Write the PRD using the template below, then publish it to the project issue tracker. Apply the `enhancement` category label and set the issue's status to `backlog` (not `todo`) by default. If the user has Claude Design mockups to include, follow **Attaching Claude Design assets** below so they're re-hosted on Linear before they expire.

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## Designs

Only if the user provided Claude Design mockups. Each design embedded inline as `![caption](assetUrl)` using the permanent Linear-hosted URL — see **Attaching Claude Design assets** below. Omit this section entirely when there are no designs.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>

## Attaching Claude Design assets

Claude Design exports a **handoff bundle** — a downloaded **zip** of HTML/CSS/JSX prototypes, *not* finished images — and its own hosted URLs expire within days, so pasting those links into Linear leaves broken images later. When the user wants designs in the PRD, **render each page to a PNG and re-host it on Linear first**. The bundle almost never ships a clean image of a page; the only rasters inside are usually debug/screenshot artifacts. You produce the page image yourself.

> The bundle's `README.md` warns "don't render these files or take screenshots unless the user asks." Embedding a durable design preview in the PRD **is** that case — render it.

1. **Extract and orient.** Use the zip path the user gives, otherwise the newest `*.zip` in `~/Downloads` (confirm first). Run `scripts/inspect-design-zip.sh [zip-path]`: it unzips to a temp dir (printed as `TMPDIR<tab><dir>`), lists embeddable rasters, and lists HTML/JSX/CSS as `OTHER`. Read the bundle's `README.md` — it names the primary file the user had open. Open the relevant HTML page(s) and follow their imports (JSX, CSS) so you know what each should look like.

2. **Confirm the set.** Agree with the user which page(s) to include and a caption for each; drop any they don't want.

3. **Render each page to a PNG.** The HTML loads React + Babel from a CDN and pulls in local JSX/CSS, so serve the bundle and screenshot it with a headless browser (needs network for the CDN + web fonts):
   - Serve the project dir — the folder holding the target HTML plus its `src/`, `styles/`, `assets/`: `python3 -m http.server 8753 --bind 127.0.0.1 --directory "<project-dir>"` (run in the background).
   - Screenshot with headless Chrome, allowing virtual time for Babel to transpile + React to render, at 2× for a crisp image: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,900 --force-device-scale-factor=2 --virtual-time-budget=12000 --screenshot=/tmp/<page>.png "http://127.0.0.1:8753/<Page>.html"`
   - **Verify the render** by viewing the PNG — confirm the page actually drew (fonts loaded, no blank/placeholder), not merely that a file was written.

4. **Re-host each PNG on Linear.** Uploads must be anchored to an *issue* — use the PRD's issue, or any issue in the target team/project if the PRD is a document (the resulting asset is reusable workspace-wide). Get the exact byte size (`stat -f%z /tmp/<page>.png`), then per image run these back-to-back so the signed URL stays valid:
   - `prepare_attachment_upload` with `issue`, `filename`, `contentType: image/png`, and `size` (the exact bytes — a wrong size returns HTTP 403).
   - PUT the raw bytes within **60 seconds**, passing every header from `uploadRequest.headers` verbatim (casing matters): `curl -X PUT --data-binary @"/tmp/<page>.png" -H "<k>: <v>" … "<uploadRequest.url>"`.
   - Keep the returned permanent `assetUrl` (`uploads.linear.app/…`). Don't base64-encode or transform the file. Inline embedding does NOT need `create_attachment_from_upload`.

5. **Embed inline.** Put each design in the PRD's `## Designs` section as `![caption](assetUrl)` and `save_document`/`save_issue` to update the body. Use the Linear `assetUrl` only — never the original Claude Design link. Hand these `assetUrl`s to `/to-issues` so it can reuse them without re-rendering or re-uploading.
