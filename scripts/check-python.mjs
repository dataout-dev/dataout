import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const worker = join(root, 'scripts', 'python_check_worker.py')
const only = process.argv[2] ?? null

const { pyLessons, pySections, pyTiers } = await import(pathToFileURL(join(root, 'src/data/python/index.js')).href)
const { pyExams } = await import(pathToFileURL(join(root, 'src/data/python/exams/index.js')).href)

const python = process.env.PYTHON ?? 'python'
let failures = 0
let checked = 0

function fail(where, message) {
  failures += 1
  console.log(`FAIL ${where}: ${message}`)
}

function run(payload, where) {
  const result = spawnSync(python, [worker], { input: JSON.stringify(payload), encoding: 'utf8', timeout: 60000, cwd: root })
  if (result.error || result.status !== 0) {
    fail(where, `checker crashed or timed out. ${result.error?.message ?? ''} ${(result.stderr ?? '').split('\n').slice(-4).join(' | ')}`)
    return []
  }
  try {
    return JSON.parse(result.stdout)
  } catch {
    fail(where, `unreadable checker output: ${result.stdout.slice(0, 200)}`)
    return []
  }
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

const ids = new Set()
const inScope = (lesson) => !only || lesson.id === only || lesson.tier === only || lesson.section === only

for (const lesson of pyLessons.filter(inScope)) {
  if (ids.has(lesson.id)) fail(lesson.id, 'duplicate lesson id')
  ids.add(lesson.id)
  const where = lesson.id

  if (!lesson.title || !lesson.blurb) fail(where, 'missing title or blurb')

  if (lesson.kind === 'learn' && lesson.check.length !== 5) fail(where, `a learn-heavy lesson needs 5 concept-check questions (has ${lesson.check.length})`)
  if (lesson.kind === 'read' && lesson.check.length < 5) fail(where, 'a reading lesson needs a 5-question quiz')
  lesson.check.forEach((q, i) => checkChoice(`${where} check ${i + 1}`, q))

  const docPath = join(root, 'src/content/python', `${lesson.id}.md`)
  if (!existsSync(docPath)) fail(where, 'no lesson document')
  else {
    const text = readFileSync(docPath, 'utf8').replace(/\r\n/g, '\n')
    if (text.trim().length < 800) fail(where, 'the lesson document is very short')
    report(`${where} doc`, run({ task: 'doc', text }, `${where} doc`))
  }

  if (lesson.practice) {
    if (!lesson.practice.prompt) fail(where, 'practice has no prompt')
    report(`${where} practice`, run({ task: 'practice', practice: lesson.practice }, `${where} practice`))
  }

  if (lesson.kind === 'code' && !lesson.practice && lesson.real.length === 0) fail(where, 'a code lesson needs a practice test or real-data challenges')

  lesson.real.forEach((real, i) => {
    report(`${where} real ${i + 1}`, run({ task: 'challenge', ...real }, `${where} real ${i + 1}`))
    if (!real.dataset || !real.title) fail(`${where} real ${i + 1}`, 'missing dataset or title')
  })
  if (lesson.practice && lesson.kind === 'code' && lesson.real.length !== 0 && lesson.real.length !== 3) {
    fail(where, `expected 3 real-data challenges, found ${lesson.real.length}`)
  }
}

for (const tier of pyTiers.filter((t) => !t.soon && (!only || only === t.id))) {
  const questions = pyExams[tier.id] ?? []
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
    else report(where, run({ ...q, task: 'challenge' }, where))
  }
}

for (const section of pySections.filter((s) => !only || s.id === only || s.tier === only)) {
  if (!section.lessons.length) fail(section.id, 'section has no lessons')
}

console.log(`\nChecked ${checked} items in ${pyLessons.filter(inScope).length} lessons.`)
if (failures > 0) {
  console.log(`${failures} problem${failures === 1 ? '' : 's'} found.`)
  process.exit(1)
}
console.log('All OK')
