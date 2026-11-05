import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { fingerprints, parse, trace, render } from './trace.mjs'

const SCRIPT = fileURLToPath(new URL('./trace.mjs', import.meta.url))
const WHY_HEAD = 'Answer why the code is shaped this way with a cited, confidence-tiered answer.'
const WHY_TAIL = 'Present the synthesizer output and name every category you held back from the sweep.'

function skillsDir() {
  const d = mkdtempSync(join(tmpdir(), 'trace-'))
  mkdirSync(join(d, 'why'))
  writeFileSync(join(d, 'why', 'SKILL.md'), `---\nname: why\ndescription: x\n---\n\n# Why\n\n${WHY_HEAD}\n\nshort\n\n${WHY_TAIL}\n`)
  mkdirSync(join(d, 'how'))
  writeFileSync(join(d, 'how', 'SKILL.md'), '---\nname: how\n---\n\n# How\n\nTrace how the code works today and explain it for a senior engineer.\n')
  return d
}

const cc = (type, content, timestamp) => JSON.stringify({ type, timestamp, message: { role: type, content } })
const tool = (name, input) => cc('assistant', [{ type: 'tool_use', name, input }])
const result = (text) => cc('user', [{ type: 'tool_result', content: text }])

test('a full read of a skill is detected from tool output, whatever the path', () => {
  const lines = [cc('user', '/cortex should we do X or Y'), tool('Bash', { command: 'cd tools/skills && cat why/SKILL.md' }), result(`     7\t${WHY_HEAD}\n     9\tshort\n    11\t${WHY_TAIL}`)]
  const r = trace(parse(lines), fingerprints(skillsDir()))
  assert.equal(r.loads.get('why/SKILL.md').depth, 'full', 'relative-path cat counts as a full read')
  assert.equal(r.loads.has('how/SKILL.md'), false, 'unread skill is not reported')
})

test('reading only the top of a skill is partial', () => {
  const r = trace(parse([result(WHY_HEAD)]), fingerprints(skillsDir()))
  assert.equal(r.loads.get('why/SKILL.md').depth, 'partial, top only')
})

test('a sentence two skills share is not a fingerprint', () => {
  const d = skillsDir()
  mkdirSync(join(d, 'arena'))
  writeFileSync(join(d, 'arena', 'SKILL.md'), `---\nname: arena\n---\n\nRun several candidates on one brief and graft the strongest parts.\n\n${WHY_HEAD}\n`)
  const r = trace(parse([result(WHY_HEAD)]), fingerprints(d))
  assert.equal(r.loads.has('arena/SKILL.md'), false, 'arena quoting a why line does not mark arena as read')
})

test('tool calls show only with --full', () => {
  const ev = parse([tool('Bash', { command: 'git log --oneline' })])
  assert.doesNotMatch(render(trace(ev, [])), /CALL/)
  assert.match(render(trace(ev, []), { full: true }), /CALL Bash .*git log --oneline/)
})

test('a path mentioned in a tool call without its content is not a load', () => {
  const r = trace(parse([tool('Bash', { command: 'ls why/SKILL.md' }), result('why/SKILL.md')]), fingerprints(skillsDir()))
  assert.equal(r.loads.size, 0)
})

test('request blobs that copy context are ignored', () => {
  const blob = JSON.stringify({ type: 'api-request-blob', message: { content: [{ type: 'text', text: `${WHY_HEAD} ${WHY_TAIL}` }] } })
  const r = trace(parse([blob]), fingerprints(skillsDir()))
  assert.equal(r.loads.size, 0)
})

test('plans and spawns are listed with their items and agent type', () => {
  const ev = parse([
    tool('TodoWrite', { todos: [{ content: 'Classify the question' }, { content: 'skip: not a claim question' }] }),
    tool('Agent', { subagent_type: 'cortex-agent', description: 'why investigator: issue tracker' }),
  ])
  const out = render(trace(ev, []))
  assert.match(out, /PLAN \[1\] Classify the question \[2\] skip: not a claim question/)
  assert.match(out, /SPAWN Agent type=cortex-agent why investigator: issue tracker/)
})

test('codex rollout lines are parsed', () => {
  const line = (payload) => JSON.stringify({ type: 'response_item', payload })
  const ev = parse([
    line({ type: 'message', role: 'user', content: [{ type: 'input_text', text: 'why is this here' }] }),
    line({ type: 'custom_tool_call', name: 'exec', input: '{"cmd":"cat why/SKILL.md"}' }),
    line({ type: 'custom_tool_call_output', output: `${WHY_HEAD}\n${WHY_TAIL}` }),
    line({ type: 'message', role: 'developer', content: [{ type: 'input_text', text: WHY_HEAD }] }),
  ])
  assert.deepEqual(ev.map(e => e.kind), ['user', 'call', 'result'], 'developer messages are context, not loads')
  assert.equal(trace(ev, fingerprints(skillsDir())).loads.get('why/SKILL.md').depth, 'full')
})

test('the CLI prints a usage error without a transcript', () => {
  assert.throws(() => execFileSync('node', [SCRIPT], { stdio: 'pipe' }), (e) => e.status === 64)
})

test('the CLI traces a transcript and its subagents', () => {
  const d = mkdtempSync(join(tmpdir(), 'session-'))
  const t = join(d, 's1.jsonl')
  writeFileSync(t, [cc('user', 'first', '2026-11-05T10:00:00Z'), cc('assistant', [{ type: 'text', text: 'done' }], '2026-11-05T10:01:00Z'), cc('user', 'go', '2026-11-05T11:00:00Z'), tool('Agent', { description: 'lane' })].join('\n'))
  mkdirSync(join(d, 's1', 'subagents'), { recursive: true })
  writeFileSync(join(d, 's1', 'subagents', 'agent-a.jsonl'), cc('user', [{ type: 'tool_result', content: `${WHY_HEAD}\n${WHY_TAIL}` }], '2026-11-05T11:00:05Z'))
  writeFileSync(join(d, 's1', 'subagents', 'agent-a.meta.json'), JSON.stringify({ description: 'lane', agentType: 'general-purpose' }))
  const out = execFileSync('node', [SCRIPT, t, '--skills', skillsDir()], { encoding: 'utf8' })
  assert.match(out, /- turn 2, lane type=general-purpose: 0 tool calls, loaded why\/SKILL.md \(full\)/)
  assert.doesNotMatch(execFileSync('node', [SCRIPT, t, '--skills', skillsDir(), '--turn', '1'], { encoding: 'utf8' }), /lane/, 'a turn filter drops subagents from other turns')
  const one = execFileSync('node', [SCRIPT, t, '--skills', skillsDir(), '--subagent', 'lane'], { encoding: 'utf8' })
  assert.match(one, /why\/SKILL.md: first at event 0, full/)
})

test('assistant text is a SAY event and turns count user messages', () => {
  const ev = parse([cc('user', 'q1', 'T1'), cc('assistant', [{ type: 'text', text: 'Your goal is X.' }], 'T2'), cc('user', 'q2', 'T3')])
  assert.deepEqual(ev.map(e => [e.kind, e.turn]), [['user', 1], ['say', 1], ['user', 2]])
  const burst = parse([cc('user', '/cortex'), cc('user', 'skill body'), cc('assistant', [{ type: 'text', text: 'ok' }]), cc('user', 'next')])
  assert.deepEqual(burst.map(e => e.turn), [1, 1, 1, 2], 'back-to-back user entries are one turn')
  const out = render(trace(ev, []), { turn: 1 })
  assert.match(out, /SAY T2 Your goal is X\./)
  assert.doesNotMatch(out, /q2/)
})

test('--full shows the whole tool input', () => {
  const brief = 'x'.repeat(300) + ' END'
  const out = render(trace(parse([tool('Agent', { description: 'lane', prompt: brief })]), []), { full: true })
  assert.match(out, /END/)
})

test('a load names the call that produced it, even when calls run in parallel', () => {
  const ev = parse([
    cc('assistant', [{ type: 'tool_use', id: 'a', name: 'Bash', input: { command: 'cat why/SKILL.md' } }, { type: 'tool_use', id: 'b', name: 'Bash', input: { command: 'grep x' } }]),
    cc('user', [{ type: 'tool_result', tool_use_id: 'b', content: 'nothing' }, { type: 'tool_result', tool_use_id: 'a', content: `${WHY_HEAD}\n${WHY_TAIL}` }]),
  ])
  assert.match(render(trace(ev, fingerprints(skillsDir()))), /3 LOADED why\/SKILL.md \(full\), from call 0/)
})

test('agent files beside the skills dir are fingerprinted', () => {
  const root = mkdtempSync(join(tmpdir(), 'repo-'))
  mkdirSync(join(root, 'skills', 'why'), { recursive: true })
  writeFileSync(join(root, 'skills', 'why', 'SKILL.md'), `---\nname: why\n---\n\n${WHY_HEAD}\n`)
  mkdirSync(join(root, 'agents'))
  writeFileSync(join(root, 'agents', 'cortex-agent.md'), '---\nname: cortex-agent\n---\n\nYou are a delegate of a cortex run and own only the task in your brief.\n')
  const r = trace(parse([result('You are a delegate of a cortex run and own only the task in your brief.')]), fingerprints(join(root, 'skills')))
  assert.equal(r.loads.get('agents/cortex-agent.md').depth, 'full')
})
