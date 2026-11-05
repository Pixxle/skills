#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync, realpathSync, statSync } from 'node:fs'
import { join, dirname, basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const USAGE = 'usage: trace.mjs <transcript.jsonl> [--skills <skills-dir>] [--turn N] [--full [--from N] [--to M]] [--subagent <label>]'

const norm = (s) => s.replace(/\s+/g, ' ').trim()
const safeJson = (s) => { try { return JSON.parse(s) } catch { return null } }

export function fingerprints(skillsDir) {
  const files = []
  const walk = (d, root, prefix) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n)
      if (statSync(p).isDirectory()) { if (n !== 'scripts' && n !== 'node_modules') walk(p, root, prefix) }
      else if (n.endsWith('.md')) files.push({ path: p, name: prefix + relative(root, p) })
    }
  }
  walk(skillsDir, skillsDir, '')
  const agentsDir = join(skillsDir, '..', 'agents')
  if (existsSync(agentsDir)) walk(agentsDir, agentsDir, 'agents/')
  const bodies = files.map(f => {
    const body = readFileSync(f.path, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '')
    return body.split('\n').map(norm).filter(l => l.length >= 40 && !l.startsWith('#') && !l.startsWith('|') && !l.startsWith('```')).map(l => l.slice(0, 120))
  })
  const seen = new Map()
  bodies.forEach(ls => new Set(ls).forEach(l => seen.set(l, (seen.get(l) ?? 0) + 1)))
  const out = []
  files.forEach((f, i) => {
    const unique = bodies[i].filter(l => seen.get(l) === 1)
    if (unique.length) out.push({ file: f.name, head: unique[0], tail: unique[unique.length - 1] })
  })
  return out
}

function textOf(c) {
  if (c == null) return ''
  if (typeof c === 'string') return c
  if (Array.isArray(c)) return c.map(textOf).join('\n')
  if (typeof c === 'object') return textOf(c.text ?? c.content ?? c.output ?? '')
  return String(c)
}

function summarize(input) {
  const i = typeof input === 'string' ? safeJson(input) ?? { raw: input } : input ?? {}
  const pick = i.description ?? i.command ?? i.cmd ?? i.file_path ?? i.path ?? i.prompt ?? i.raw ?? ''
  return norm(String(pick)).slice(0, 140)
}

const PLAN_TOOLS = /^(TodoWrite|mcp__ccd_turn__update_plan|update_plan)$/
const SPAWN_TOOLS = /^(Agent|Task|spawn_agent|Workflow)$/

function call(name, input, id) {
  const i = typeof input === 'string' ? safeJson(input) ?? input : input
  const raw = typeof i === 'string' ? i : JSON.stringify(i ?? {})
  if (PLAN_TOOLS.test(name)) {
    const items = (i?.items ?? i?.todos ?? []).map(t => t.content ?? t.step ?? '').filter(Boolean)
    return { kind: 'plan', name, items, change: items.length ? null : norm(raw).slice(0, 140), raw, id }
  }
  if (SPAWN_TOOLS.test(name)) return { kind: 'spawn', name, type: i?.subagent_type ?? i?.agent_type ?? '', summary: summarize(i), raw, id }
  return { kind: 'call', name, summary: summarize(i), raw, id }
}

export function parse(lines) {
  const events = []
  let turn = 0
  let agentActed = true
  const byId = new Map()
  const push = (ev, ts) => {
    if (ev.kind === 'user') { if (agentActed) turn++; agentActed = false }
    else if (ev.kind !== 'result') agentActed = true
    if (ev.callId !== undefined) { const c = byId.get(ev.callId); if (c !== undefined) ev.callIdx = c }
    if (ev.id !== undefined) byId.set(ev.id, events.length)
    events.push({ ...ev, ts: ts ?? '', turn })
  }
  for (const line of lines) {
    if (!line.trim()) continue
    const e = safeJson(line)
    if (!e) continue
    const ts = e.timestamp
    if (e.type === 'user' || e.type === 'assistant') {
      const content = e.message?.content
      if (e.type === 'user' && typeof content === 'string') { push({ kind: 'user', text: content }, ts); continue }
      for (const b of Array.isArray(content) ? content : []) {
        if (e.type === 'user' && b.type === 'text') push({ kind: 'user', text: b.text }, ts)
        if (e.type === 'user' && b.type === 'tool_result') push({ kind: 'result', text: textOf(b.content), callId: b.tool_use_id }, ts)
        if (e.type === 'assistant' && b.type === 'text' && b.text.trim()) push({ kind: 'say', text: b.text }, ts)
        if (e.type === 'assistant' && b.type === 'tool_use') push(call(b.name, b.input, b.id), ts)
      }
    } else if (e.type === 'response_item') {
      const p = e.payload ?? {}
      if (p.type === 'message' && p.role === 'user') push({ kind: 'user', text: textOf(p.content) }, ts)
      if (p.type === 'message' && p.role === 'assistant') push({ kind: 'say', text: textOf(p.content) }, ts)
      if (p.type === 'function_call' || p.type === 'custom_tool_call') push(call(p.name, p.arguments ?? p.input, p.call_id), ts)
      if (p.type === 'function_call_output' || p.type === 'custom_tool_call_output') push({ kind: 'result', text: textOf(p.output), callId: p.call_id }, ts)
    }
  }
  return events
}

export function trace(events, prints) {
  const loads = new Map()
  events.forEach((ev, idx) => {
    if (ev.kind !== 'user' && ev.kind !== 'result') return
    const t = norm(ev.text)
    for (const f of prints) {
      const head = t.includes(f.head), tail = t.includes(f.tail)
      if (!head && !tail) continue
      const depth = head && tail ? 'full' : head ? 'partial, top only' : 'partial, end only'
      const prev = loads.get(f.file)
      if (!prev) loads.set(f.file, { first: idx, depth })
      else if (depth === 'full') prev.depth = 'full'
      ;(ev.loads ??= []).push(`${f.file} (${depth})`)
    }
  })
  return { events, loads }
}

export function render({ events, loads }, { full = false, from = 0, to = Infinity, turn = null } = {}) {
  const head = full ? '## Timeline with tool calls and full inputs' : '## Timeline (rerun with --full for tool calls and full inputs)'
  const out = [head, '']
  let lastTurn = null
  events.forEach((ev, i) => {
    if (i < from || i > to || (turn !== null && ev.turn !== turn)) return
    if (ev.turn !== lastTurn && ev.kind === 'user') { out.push(`-- turn ${ev.turn} ${ev.ts}`); lastTurn = ev.turn }
    const cut = (s, n) => (full ? norm(s).slice(0, 2000) : norm(s).slice(0, n))
    if (ev.kind === 'user') out.push(`${i} USER ${cut(ev.text, 200)}`)
    if (ev.kind === 'say') out.push(`${i} SAY ${ev.ts} ${cut(ev.text, 200)}`)
    if (ev.kind === 'call' && full) out.push(`${i} CALL ${ev.name} ${cut(ev.raw, 0)}`)
    if (ev.kind === 'spawn') out.push(`${i} SPAWN ${ev.name}${ev.type ? ` type=${ev.type}` : ''} ${full ? cut(ev.raw, 0) : ev.summary}`)
    if (ev.kind === 'plan') out.push(ev.items.length ? `${i} PLAN ${ev.items.map((s, n) => `[${n + 1}] ${norm(s)}`).join(' ')}` : `${i} PLAN-UPDATE ${ev.change}`)
    if (ev.loads) out.push(`${i} LOADED ${ev.loads.join(', ')}${ev.callIdx !== undefined ? `, from call ${ev.callIdx}` : ''}`)
  })
  out.push('', '## Skill files loaded', '')
  const shown = [...loads].filter(([, v]) => turn === null || events[v.first].turn === turn)
  for (const [f, v] of shown.sort((a, b) => a[1].first - b[1].first)) out.push(`- ${f}: first at event ${v.first}, ${v.depth}`)
  if (!shown.length) out.push('- none')
  return out.join('\n')
}

function subagentFiles(transcript) {
  const dir = join(transcript.replace(/\.jsonl$/, ''), 'subagents')
  if (!existsSync(dir)) return []
  const found = []
  const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (n.endsWith('.jsonl') && n !== 'journal.jsonl') found.push(p) } }
  walk(dir)
  return found
}

function label(f) {
  const meta = f.replace(/\.jsonl$/, '.meta.json')
  const m = existsSync(meta) ? safeJson(readFileSync(meta, 'utf8')) : null
  return [m?.description, m?.agentType && `type=${m.agentType}`, m?.model && `model=${m.model}`].filter(Boolean).join(' ') || basename(f)
}

export function turnOf(mainEvents, ts) {
  let t = 0
  for (const ev of mainEvents) if (ev.kind === 'user' && ev.ts && ev.ts <= ts) t = ev.turn
  return t
}

function main(argv) {
  const [file, ...rest] = argv
  if (!file || file.startsWith('-')) { console.error(USAGE); process.exit(64) }
  const here = dirname(realpathSync(fileURLToPath(import.meta.url)))
  const arg = (k) => { const j = rest.indexOf(k); return j >= 0 ? rest[j + 1] : undefined }
  const skillsDir = arg('--skills') ?? join(here, '..', '..')
  const prints = fingerprints(skillsDir)
  const run = (f) => trace(parse(readFileSync(f, 'utf8').split('\n')), prints)
  const top = run(file)
  const subs = subagentFiles(file).map(f => {
    const r = run(f)
    return { label: label(f), file: f, turn: turnOf(top.events, r.events.find(e => e.ts)?.ts ?? ''), ...r }
  })
  const turn = arg('--turn') !== undefined ? Number(arg('--turn')) : null
  const opts = { full: rest.includes('--full'), from: Number(arg('--from') ?? 0), to: Number(arg('--to') ?? Infinity), turn }
  const name = arg('--subagent')
  if (name !== undefined) {
    const s = subs.find(x => x.label.includes(name))
    if (!s) { console.error(`no subagent matches ${name}`); process.exit(1) }
    console.log(`# Subagent ${s.label}, started in turn ${s.turn}\n\n${render(s, { ...opts, turn: null })}`)
    return
  }
  console.log(`# Trace of ${basename(file)}${turn !== null ? `, turn ${turn}` : ''}\n\nSkills compared: ${skillsDir} (${prints.length} files)\n\n${render(top, opts)}`)
  const mine = subs.filter(s => turn === null || s.turn === turn)
  if (mine.length) {
    console.log('\n## Subagents (rerun with --subagent <label> for one timeline)\n')
    for (const s of mine) console.log(`- turn ${s.turn}, ${s.label}: ${s.events.filter(e => e.kind === 'call').length} tool calls, loaded ${[...s.loads].map(([f, v]) => `${f} (${v.depth})`).join(', ') || 'no skill files'}`)
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main(process.argv.slice(2))
