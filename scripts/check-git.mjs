import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import fs from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { seedRepo } from '../src/lib/git/engine.js'
import { runSteps } from '../src/lib/git/terminal.js'
import { evalAssertion, runChecks } from '../src/lib/git/grading.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const only = process.argv[2] ?? null

const { gitLessons, gitSections, gitTiers } = await import(pathToFileURL(join(root, 'src/data/git/index.js')).href)
const { gitExams } = await import(pathToFileURL(join(root, 'src/data/git/exams/index.js')).href)

let failures = 0
let checked = 0

function fail(where, message) {
  failures += 1
  console.log(`FAIL ${where}: ${message}`)
}

function report(where, problems) {
  checked += 1
  for (const problem of problems) fail(where, problem)
}

function checkChoice(where, q) {
  const problems = []
  if (!q.q || !Array.isArray(q.options) || q.options.length < 3 || q.options.length > 5) problems.push('a question needs text and 3 to 5 options')
  else {
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) problems.push('answer index is out of range')
    if (new Set(q.options).size !== q.options.length) problems.push('two options are identical')
    if (!q.why) problems.push('a question needs an explanation (why)')
  }
  report(where, problems)
}

function freshDir() {
  return mkdtempSync(join(tmpdir(), 'git-check-')).split('\\').join('/')
}

// Seeds a fresh repo, replays `steps`, and returns the pass/fail of every case against the
// resulting state. A step failing to run at all (a broken reference/trap) surfaces as its
// own problem rather than a silent all-fail.
async function tryScenario(seed, steps, cases) {
  const dir = freshDir()
  try {
    await seedRepo(fs, dir, seed ?? {})
    const replay = await runSteps(fs, dir, steps ?? [])
    if (!replay.ok) {
      const last = replay.log[replay.log.length - 1]
      return { error: `step failed: ${JSON.stringify(last.step)} -> ${last.stderr}`, results: [] }
    }
    const results = await runChecks(fs, dir, cases)
    return { error: null, results }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function checkGitExercise(item, { requirePrompt, requireTask } = {}) {
  const problems = []
  const cases = item.cases ?? []
  if (cases.length === 0) return ['exercise has no hidden cases']
  if (requirePrompt && !item.prompt) problems.push('practice has no prompt')
  if (requireTask && !item.task) problems.push('exam question has no task text')
  if (!requirePrompt && !requireTask && !item.title) problems.push('challenge has no title')
  if (!requirePrompt && !requireTask && !item.brief) problems.push('challenge has no brief')
  if (!item.walkthrough) problems.push('no walkthrough')

  return problems
}

async function checkReference(item) {
  const problems = []
  const cases = item.cases ?? []
  if (cases.length === 0) return problems

  const ref = await tryScenario(item.seed, item.reference, cases)
  if (ref.error) problems.push(`the reference ${ref.error}`)
  else if (!ref.results.every((r) => r.passed)) {
    const failed = ref.results.filter((r) => !r.passed).map((r) => r.label)
    problems.push(`the reference fails its own cases: ${failed.join(', ')}`)
  }

  const starter = await tryScenario(item.seed, item.starter ?? [], cases)
  if (!starter.error && starter.results.every((r) => r.passed)) {
    problems.push('the starter state (untouched seed) already passes every case')
  }

  const traps = item.traps ?? []
  if (traps.length === 0) problems.push('no traps: add wrong command sequences that the hidden cases must reject')
  for (const trap of traps) {
    const result = await tryScenario(item.seed, trap, cases)
    if (!result.error && result.results.every((r) => r.passed)) {
      problems.push(`a wrong sequence passes every case: ${JSON.stringify(trap).slice(0, 90)}`)
    }
  }
  return problems
}

const ids = new Set()
const inScope = (lesson) => !only || lesson.id === only || lesson.tier === only || lesson.section === only

for (const lesson of gitLessons.filter(inScope)) {
  if (ids.has(lesson.id)) fail(lesson.id, 'duplicate lesson id')
  ids.add(lesson.id)
  const where = lesson.id

  if (!lesson.title || !lesson.blurb) fail(where, 'missing title or blurb')

  if (lesson.kind === 'learn' && lesson.check.length !== 5) fail(where, `a learn-heavy lesson needs 5 concept-check questions (has ${lesson.check.length})`)
  if (lesson.kind === 'read' && lesson.check.length < 5) fail(where, 'a reading lesson needs a 5-question quiz')
  lesson.check.forEach((q, i) => checkChoice(`${where} check ${i + 1}`, q))

  const docPath = join(root, 'src/content/git', `${lesson.id}.md`)
  if (!existsSync(docPath)) fail(where, 'no lesson document')
  else {
    const text = readFileSync(docPath, 'utf8').replace(/\r\n/g, '\n')
    if (text.trim().length < 400) fail(where, 'the lesson document is very short')
  }

  if (lesson.kind === 'code' && !lesson.practice && lesson.real.length === 0) fail(where, 'a code lesson needs a practice exercise or real-repo challenges')

  if (lesson.practice) {
    checked += 1
    checkGitExercise(lesson.practice, { requirePrompt: true }).forEach((p) => fail(`${where} practice`, p))
    ;(await checkReference(lesson.practice)).forEach((p) => fail(`${where} practice`, p))
  }

  for (const [i, real] of lesson.real.entries()) {
    checked += 1
    const w = `${where} real ${i + 1}`
    checkGitExercise(real, { requirePrompt: false }).forEach((p) => fail(w, p))
    ;(await checkReference(real)).forEach((p) => fail(w, p))
  }
  if (lesson.practice && lesson.kind === 'code' && lesson.real.length !== 0 && lesson.real.length !== 3) {
    fail(where, `expected 3 real-repo challenges, found ${lesson.real.length}`)
  }
}

for (const tier of gitTiers.filter((t) => !t.soon && (!only || only === t.id))) {
  const questions = gitExams[tier.id] ?? []
  if (questions.length === 0) {
    if (only) console.log(`note: ${tier.id} has no exam questions yet`)
    continue
  }
  if (questions.length !== 10) fail(`exam ${tier.id}`, `expected 10 questions, found ${questions.length}`)
  const total = questions.reduce((sum, q) => sum + q.points, 0)
  if (total !== 100) fail(`exam ${tier.id}`, `points add up to ${total}, expected 100`)
  const seen = new Set()
  for (const q of questions) {
    if (seen.has(q.id)) fail(`exam ${tier.id}`, `duplicate question id ${q.id}`)
    seen.add(q.id)
    const where = `exam ${tier.id} ${q.id}`
    if (q.kind === 'mcq') checkChoice(where, q)
    else {
      checked += 1
      checkGitExercise(q, { requireTask: true }).forEach((p) => fail(where, p))
      ;(await checkReference(q)).forEach((p) => fail(where, p))
    }
  }
}

for (const section of gitSections.filter((s) => !only || s.id === only || s.tier === only)) {
  if (!section.lessons.length) fail(section.id, 'section has no lessons')
}

console.log(`\nChecked ${checked} items in ${gitLessons.filter(inScope).length} lessons.`)
if (failures > 0) {
  console.log(`${failures} problem${failures === 1 ? '' : 's'} found.`)
  process.exit(1)
}
console.log('All OK')
