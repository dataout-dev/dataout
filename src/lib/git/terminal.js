// A small, deliberately-constrained "terminal" that parses a typed command line and runs
// it against a live (fs, dir) repo via engine.js, producing git-CLI-like output text.
// This is the interactive layer learners type into; engine.js stays a plain function library.
import { structuredPatch } from 'diff'
import * as eng from './engine.js'

export function tokenize(line) {
  const tokens = []
  let current = ''
  let quote = null
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (quote) {
      if (ch === quote) quote = null
      else current += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (/\s/.test(ch)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += ch
  }
  if (current) tokens.push(current)
  return tokens
}

function parseFlags(args) {
  const flags = new Set()
  const opts = {}
  const positional = []
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === '-m' || arg === '--message') {
      opts.message = args[++i]
    } else if (arg.startsWith('--message=')) {
      opts.message = arg.slice('--message='.length)
    } else if (arg.startsWith('--')) {
      flags.add(arg.slice(2))
    } else if (arg.startsWith('-') && arg.length > 1) {
      for (const ch of arg.slice(1)) flags.add(ch)
    } else {
      positional.push(arg)
    }
  }
  return { flags, opts, positional }
}

function shortOid(oid) {
  return oid.slice(0, 7)
}

function formatDiff(filepath, before, after) {
  if (before === after) return ''
  const patch = structuredPatch(`a/${filepath}`, `b/${filepath}`, before ?? '', after ?? '', '', '')
  const lines = [`diff --git a/${filepath} b/${filepath}`]
  if (before === null) lines.push('new file mode 100644')
  if (after === null) lines.push('deleted file mode 100644')
  lines.push(`--- ${before === null ? '/dev/null' : `a/${filepath}`}`)
  lines.push(`+++ ${after === null ? '/dev/null' : `b/${filepath}`}`)
  for (const hunk of patch.hunks) {
    lines.push(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`)
    lines.push(...hunk.lines)
  }
  return lines.join('\n')
}

async function cmdInit(fs, dir) {
  await eng.initRepo(fs, dir, {})
  const branch = await eng.currentBranchName(fs, dir)
  return ok(`Initialized empty Git repository (branch ${branch})`)
}

async function cmdAdd(fs, dir, { positional }) {
  if (positional.length === 0) return err('Nothing specified, nothing added.')
  if (positional.includes('.') || positional.includes('-A')) {
    await eng.stageAll(fs, dir)
    return ok('')
  }
  for (const filepath of positional) await eng.stageFile(fs, dir, filepath)
  return ok('')
}

async function cmdCommit(fs, dir, { flags, opts }) {
  if (flags.has('amend')) {
    if (!opts.message) return err('error: switch `amend` requires a value for -m')
    const c = await eng.commit(fs, dir, opts.message, { amend: true })
    return ok(`[${await eng.currentBranchName(fs, dir)} ${shortOid(c)}] ${opts.message}`)
  }
  if (!opts.message) return err('error: commit message required: use -m "..."')
  const clean = await eng.isClean(fs, dir)
  const rows = await eng.statusRows(fs, dir)
  const staged = rows.filter((r) => r.staged)
  if (staged.length === 0) {
    if (clean) return err('nothing to commit, working tree clean')
    return err('no changes added to commit (use "git add")')
  }
  const oid = await eng.commit(fs, dir, opts.message)
  return ok(`[${await eng.currentBranchName(fs, dir)} ${shortOid(oid)}] ${opts.message}`)
}

async function cmdStatus(fs, dir, { flags }) {
  const branch = await eng.currentBranchName(fs, dir)
  const rows = await eng.statusRows(fs, dir)
  if (flags.has('s') || flags.has('short')) {
    if (rows.length === 0) return ok('')
    const codeFor = (r) => {
      const s = r.staged === 'added' ? 'A' : r.staged === 'modified' ? 'M' : r.staged === 'deleted' ? 'D' : ' '
      const w = r.untracked ? '?' : r.unstaged === 'modified' ? 'M' : r.unstaged === 'deleted' ? 'D' : ' '
      return r.untracked ? '??' : `${s}${w}`
    }
    return ok(rows.map((r) => `${codeFor(r)} ${r.filepath}`).join('\n'))
  }
  const staged = rows.filter((r) => r.staged)
  const unstaged = rows.filter((r) => r.unstaged)
  const untracked = rows.filter((r) => r.untracked)
  const lines = [`On branch ${branch}`]
  if (staged.length) {
    lines.push('Changes to be committed:')
    for (const r of staged) lines.push(`\t${r.staged}:   ${r.filepath}`)
    lines.push('')
  }
  if (unstaged.length) {
    lines.push('Changes not staged for commit:')
    for (const r of unstaged) lines.push(`\t${r.unstaged}:   ${r.filepath}`)
    lines.push('')
  }
  if (untracked.length) {
    lines.push('Untracked files:')
    for (const r of untracked) lines.push(`\t${r.filepath}`)
    lines.push('')
  }
  if (!staged.length && !unstaged.length && !untracked.length) lines.push('nothing to commit, working tree clean')
  return ok(lines.join('\n').replace(/\n+$/, ''))
}

async function cmdDiff(fs, dir, { flags, positional }) {
  const staged = flags.has('staged') || flags.has('cached')
  if (positional.length === 2 && !staged) {
    const refDiff = await tryDiffTwoRefs(fs, dir, positional[0], positional[1])
    if (refDiff) return refDiff
  }
  const rows = await eng.statusRows(fs, dir)
  const targets = positional.length ? rows.filter((r) => positional.includes(r.filepath)) : rows
  const parts = []
  for (const row of targets) {
    if (staged) {
      if (!row.staged) continue
      const before = await eng.fileAtRef(fs, dir, 'HEAD', row.filepath)
      const after = row.staged === 'deleted' ? null : await readStagedContent(fs, dir, row.filepath)
      parts.push(formatDiff(row.filepath, before, after))
    } else {
      if (!row.unstaged && !row.untracked) continue
      const before = row.untracked ? null : await readIndexOrHeadContent(fs, dir, row.filepath)
      const after = row.unstaged === 'deleted' ? null : await eng.readWorkingFile(fs, dir, row.filepath)
      parts.push(formatDiff(row.filepath, before, after))
    }
  }
  return ok(parts.filter(Boolean).join('\n'))
}

// `git diff <refA> <refB>` — only used when both positionals resolve as real refs; otherwise
// cmdDiff falls back to treating them as working-tree file paths.
async function tryDiffTwoRefs(fs, dir, refA, refB) {
  try {
    const oidA = await eng.expandRef(fs, dir, refA)
    const oidB = await eng.expandRef(fs, dir, refB)
    const filesA = await eng.listFilesAtRef(fs, dir, oidA)
    const filesB = await eng.listFilesAtRef(fs, dir, oidB)
    const parts = []
    for (const filepath of new Set([...filesA, ...filesB])) {
      const before = await eng.fileAtRef(fs, dir, oidA, filepath)
      const after = await eng.fileAtRef(fs, dir, oidB, filepath)
      const d = formatDiff(filepath, before, after)
      if (d) parts.push(d)
    }
    return ok(parts.join('\n'))
  } catch {
    return null
  }
}

async function readStagedContent(fs, dir, filepath) {
  // The staged (index) blob content == current working file content once staged,
  // since this sandbox always stages the working copy verbatim.
  return eng.readWorkingFile(fs, dir, filepath)
}

async function readIndexOrHeadContent(fs, dir, filepath) {
  const staged = await readStagedContent(fs, dir, filepath)
  if (staged !== null) return staged
  return eng.fileAtRef(fs, dir, 'HEAD', filepath)
}

async function cmdLog(fs, dir, { flags }) {
  const commits = await eng.repoLog(fs, dir)
  if (commits.length === 0) return ok('')
  if (flags.has('oneline')) {
    return ok(commits.map((c) => `${shortOid(c.oid)} ${c.message.split('\n')[0]}`).join('\n'))
  }
  const blocks = commits.map((c) => {
    const date = new Date(c.author.timestamp * 1000).toUTCString()
    return `commit ${c.oid}\nAuthor: ${c.author.name} <${c.author.email}>\nDate:   ${date}\n\n    ${c.message.split('\n').join('\n    ')}\n`
  })
  return ok(blocks.join('\n'))
}

async function cmdRestore(fs, dir, { flags, positional }) {
  if (positional.length === 0) return err('error: you must specify a path')
  for (const filepath of positional) {
    if (flags.has('staged')) await eng.restoreStaged(fs, dir, filepath)
    else await eng.restoreWorking(fs, dir, filepath)
  }
  return ok('')
}

async function cmdCheckout(fs, dir, { positional }) {
  const dashDash = positional.indexOf('--')
  if (dashDash === -1) return err('error: this sandbox only supports "git checkout -- <path>" (restoring a file)')
  const paths = positional.slice(dashDash + 1)
  for (const filepath of paths) await eng.restoreWorking(fs, dir, filepath)
  return ok('')
}

async function cmdReset(fs, dir, { flags, positional }) {
  const mode = flags.has('hard') ? 'hard' : flags.has('soft') ? 'soft' : 'mixed'
  const ref = positional[0] ?? 'HEAD'
  await eng.resetTo(fs, dir, ref, mode)
  if (mode === 'hard') {
    const oid = await eng.headOid(fs, dir)
    return ok(`HEAD is now at ${shortOid(oid)}`)
  }
  return ok('')
}

async function cmdRevert(fs, dir, { positional }) {
  if (positional.length === 0) return err('error: you must specify a commit to revert')
  const oid = await eng.revertCommit(fs, dir, positional[0])
  return ok(`[${await eng.currentBranchName(fs, dir)} ${shortOid(oid)}] Revert`)
}

async function cmdShow(fs, dir, { positional }) {
  const arg = positional[0] ?? 'HEAD'
  const colon = arg.indexOf(':')
  if (colon !== -1) {
    const ref = arg.slice(0, colon) || 'HEAD'
    const filepath = arg.slice(colon + 1)
    const content = await eng.fileAtRef(fs, dir, ref, filepath)
    if (content === null) return err(`fatal: path '${filepath}' does not exist in '${ref}'`)
    return ok(content.replace(/\n$/, ''))
  }
  const ref = arg
  const commits = await eng.repoLog(fs, dir, ref)
  if (commits.length === 0) return err(`fatal: bad revision '${ref}'`)
  const [c] = commits
  const date = new Date(c.author.timestamp * 1000).toUTCString()
  const header = `commit ${c.oid}\nAuthor: ${c.author.name} <${c.author.email}>\nDate:   ${date}\n\n    ${c.message}\n`
  const parent = c.parents[0]
  const changed = new Set([...(await eng.listFilesAtRef(fs, dir, c.oid)), ...(parent ? await eng.listFilesAtRef(fs, dir, parent) : [])])
  const diffs = []
  for (const filepath of changed) {
    const before = parent ? await eng.fileAtRef(fs, dir, parent, filepath) : null
    const after = await eng.fileAtRef(fs, dir, c.oid, filepath)
    const d = formatDiff(filepath, before, after)
    if (d) diffs.push(d)
  }
  return ok([header, ...diffs].join('\n'))
}

async function cmdTag(fs, dir, { positional }) {
  if (positional.length === 0) {
    const tags = await eng.listTagNames(fs, dir)
    return ok(tags.join('\n'))
  }
  const [name, ref = 'HEAD'] = positional
  await eng.createTag(fs, dir, name, ref)
  return ok('')
}

function ok(stdout) {
  return { ok: true, stdout, stderr: '' }
}

function err(message) {
  return { ok: false, stdout: '', stderr: message }
}

const HANDLERS = {
  init: cmdInit,
  add: cmdAdd,
  commit: cmdCommit,
  status: cmdStatus,
  diff: cmdDiff,
  log: cmdLog,
  restore: cmdRestore,
  checkout: cmdCheckout,
  reset: cmdReset,
  revert: cmdRevert,
  show: cmdShow,
  tag: cmdTag,
}

export async function runCommand(fs, dir, line) {
  const args = tokenize(line.trim())
  if (args.length === 0) return ok('')
  if (args[0] !== 'git') return err(`${args[0]}: command not found (this sandbox only runs git commands)`)
  const [sub, ...rest] = args.slice(1)
  const handler = HANDLERS[sub]
  if (!handler) return err(`git: '${sub}' is not supported in this sandbox`)
  try {
    return await handler(fs, dir, parseFlags(rest))
  } catch (e) {
    return err(e.message ?? String(e))
  }
}

// Replays a scripted sequence of steps used by reference solutions, traps and the
// walkthrough reveal: each step is either a command-line string, { write: { path: content } }
// or { rm: path }.
export async function runSteps(fs, dir, steps) {
  const log = []
  for (const step of steps) {
    if (typeof step === 'string') {
      const result = await runCommand(fs, dir, step)
      log.push({ step, ...result })
      if (!result.ok) return { ok: false, log }
    } else if (step.write) {
      for (const [filepath, content] of Object.entries(step.write)) await eng.writeWorkingFile(fs, dir, filepath, content)
      log.push({ step: 'write', ok: true })
    } else if (step.rm) {
      await eng.removeWorkingFile(fs, dir, step.rm)
      log.push({ step: 'rm', ok: true })
    }
  }
  return { ok: true, log }
}
