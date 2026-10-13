import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const worker = join(root, 'scripts', 'python_check_worker.py')
const only = process.argv[2] ?? null

const { edaLessons, edaProjects } = await import(pathToFileURL(join(root, 'src/data/eda/index.js')).href)

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

for (const lesson of edaLessons.filter((l) => !only || l.id === only)) {
  if (ids.has(lesson.id)) fail(lesson.id, 'duplicate lesson id')
  ids.add(lesson.id)
  const where = lesson.id

  if (!lesson.title || !lesson.blurb) fail(where, 'missing title or blurb')
  if (lesson.kind === 'learn' && lesson.check.length !== 5) fail(where, `a learn lesson needs 5 concept-check questions (has ${lesson.check.length})`)
  lesson.check.forEach((q, i) => checkChoice(`${where} check ${i + 1}`, q))

  const docPath = join(root, 'src/content/eda', `${lesson.id}.md`)
  if (!existsSync(docPath)) fail(where, 'no lesson document')
  else {
    const text = readFileSync(docPath, 'utf8').replace(/\r\n/g, '\n')
    if (text.trim().length < 400) fail(where, 'the lesson document is very short')
    report(`${where} doc`, run({ task: 'doc', text }, `${where} doc`))
  }

  if (lesson.practice) {
    if (!lesson.practice.prompt) fail(where, 'practice has no prompt')
    report(`${where} practice`, run({ task: 'practice', practice: lesson.practice }, `${where} practice`))
  }
  if (lesson.kind === 'code' && !lesson.practice) fail(where, 'a code lesson needs a practice block')
}

for (const project of edaProjects.filter((p) => !only || p.id === only)) {
  const where = project.id
  if (!project.title || !project.tagline || !project.blurb) fail(where, 'missing title, tagline or blurb')
  if (!project.dataset) fail(where, 'missing dataset id')
  if (!Array.isArray(project.checklist) || project.checklist.length === 0) fail(where, 'missing checklist')

  if (project.kind === 'guided') {
    if (!Array.isArray(project.steps) || project.steps.length < 3) fail(where, 'a guided project needs at least 3 steps')
    project.steps?.forEach((step, i) => {
      if (!step.title || !step.body) fail(`${where} step ${i + 1}`, 'missing title or body')
    })
  } else if (project.kind === 'unguided') {
    if (!project.intro) fail(where, 'an unguided project needs an intro brief')
  } else {
    fail(where, `unknown project kind "${project.kind}"`)
  }

  if (!Array.isArray(project.verify) || project.verify.length === 0) fail(where, 'missing optional verify challenges')
  for (const item of project.verify ?? []) {
    if (!item.label || !item.task || !item.reference || !item.given) {
      fail(`${where} verify ${item.id}`, 'missing label, task, given or reference')
      continue
    }
    report(`${where} verify ${item.id}`, run({ ...item, task: 'challenge' }, `${where} verify ${item.id}`))
  }
}

console.log(`\nChecked ${checked} items across ${edaLessons.length} lessons and ${edaProjects.length} projects.`)
if (failures > 0) {
  console.log(`${failures} problem${failures === 1 ? '' : 's'} found.`)
  process.exit(1)
}
console.log('All OK')
