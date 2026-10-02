import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'
import { lessons, tiers } from '../src/data/curriculum/index.js'
import { exams } from '../src/data/curriculum/exams.js'
import { evaluateLesson, expectedFor, openCase } from '../src/lib/lessonGrading.js'
import { resultsMatch } from '../src/lib/sqlHelpers.js'
import { createRealChecker } from './lib/checkReal.mjs'

const root = path.resolve(import.meta.dirname, '..')
const SQL = await initSqlJs()
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/datasets/manifest.json'), 'utf8'))

let problems = 0
const fail = (where, msg) => {
  problems++
  console.log(`  FAIL ${where}: ${msg}`)
}

const { checkReal: checkRealShared, datasetBytes, reverseTables } = createRealChecker({ root, manifest, fail })
const checkReal = (where, real) => checkRealShared(SQL, where, real)

const ids = new Set()
let mcq = 0
for (const tier of tiers) {
  console.log(`\n== ${tier.name}`)
  for (const lesson of lessons.filter((l) => l.tier === tier.id)) {
    const where = lesson.id
    let line = `${String(lesson.number).padStart(2, '0')} ${lesson.id.padEnd(30)}`

    if (ids.has(lesson.id)) fail(where, 'duplicate id')
    ids.add(lesson.id)
    for (const key of ['title', 'blurb', 'concept', 'minutes', 'skills', 'successNote']) if (!lesson[key]) fail(where, `missing ${key}`)
    if (!fs.existsSync(path.join(root, `src/content/lessons/${lesson.id}.md`))) fail(where, 'no Markdown doc in src/content/lessons')

    if (lesson.kind === 'mcq') {
      mcq++
      if (lesson.options?.length !== 4) fail(where, 'a multiple-choice lesson needs 4 options')
      if (!'ABCD'.includes(lesson.correct)) fail(where, 'correct must be A, B, C or D')
      if (!lesson.question || !lesson.why) fail(where, 'missing question or why')
      line += ' multiple choice'
    } else {
      for (const key of ['prompt', 'schema', 'solution']) if (!lesson[key]) fail(where, `missing ${key}`)
      if (lesson.testCases.length < 3) fail(where, 'needs at least 3 cases (sample, normal, edge)')

      const outputs = []
      try {
        for (const c of lesson.testCases) outputs.push(expectedFor(SQL, lesson, c))
      } catch (err) {
        fail(where, `solution errors: ${err.message}`)
        console.log(line)
        continue
      }
      line += ` cases ${outputs.map((o) => o.length).join('/')}`
      if (outputs[0].length === 0) fail(where, 'the sample case returns no rows')
      const distinct = new Set(outputs.map((o) => JSON.stringify(o)))
      if (distinct.size < 2) fail(where, 'the solution returns the same rows on every case')

      const own = evaluateLesson(SQL, lesson, lesson.solution)
      if (!own.every((r) => r.passed)) fail(where, 'the solution does not pass its own cases')

      if (lesson.orderMatters) {
        lesson.testCases.forEach((c, i) => {
          const db = openCase(SQL, lesson, c)
          reverseTables(db)
          const r = db.exec(lesson.solution)
          db.close()
          const rows = (r[r.length - 1]?.values ?? []).map((v) => Object.fromEntries(r[r.length - 1].columns.map((col, k) => [col, v[k]])))
          if (!resultsMatch(rows, outputs[i], true)) fail(where, `case "${c.label}" has a tie in the ordering`)
        })
      }

      for (const trap of lesson.traps ?? []) {
        const results = evaluateLesson(SQL, lesson, trap)
        if (results.every((r) => r.passed)) fail(where, `the hidden cases do not catch this wrong answer: ${trap}`)
      }
      if (!(lesson.traps ?? []).length) line += ' (no traps listed)'
    }

    if (lesson.kind !== 'mcq') {
      if (lesson.challenges.length !== 3) fail(where, `needs 3 real-data challenges, has ${lesson.challenges.length}`)
      const shapes = lesson.challenges.map((c, i) => checkReal(`${where} [real ${i + 1}]`, c) ?? '?')
      line += ` | real ${shapes.join(' ')}`
    }
    console.log(line)
  }
}

console.log('\n== Tier exams')
for (const tier of tiers) {
  const questions = exams[tier.id] ?? []
  if (questions.length !== 10) fail(`exam-${tier.id}`, `an exam needs 10 questions, has ${questions.length}`)
  const total = questions.reduce((sum, q) => sum + q.points, 0)
  const seen = new Set()
  const shapes = []
  questions.forEach((q, i) => {
    const where = `exam-${tier.id} q${i + 1}`
    if (seen.has(q.id)) fail(where, 'duplicate question id')
    seen.add(q.id)
    if (!q.task || !q.points) fail(where, 'missing task or points')
    shapes.push(checkReal(where, { ...q, title: 'exam', brief: q.task, exam: true }))
  })
  console.log(`${tier.name.padEnd(13)} ${questions.length} questions, ${total} points  [${shapes.join(', ')}]`)
}

console.log(`\n${lessons.length} lessons (${mcq} multiple choice)`)
console.log(problems ? `${problems} problem(s)` : 'All OK')
process.exit(problems ? 1 : 0)
