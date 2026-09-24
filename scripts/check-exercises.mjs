import fs from 'node:fs'
import initSqlJs from 'sql.js'
import { sqlExercises } from '../src/data/exercises/sql.js'
import { gradeResult, runExerciseQuery } from '../src/lib/exerciseGrading.js'

const SQL = await initSqlJs()
const manifest = JSON.parse(fs.readFileSync('public/datasets/manifest.json', 'utf8'))

let problems = 0
const fail = (id, msg) => {
  problems++
  console.log(`  FAIL ${id}: ${msg}`)
}

const ids = new Set()
for (const ex of sqlExercises) {
  console.log(`${ex.id} (${ex.difficulty})`)
  if (ids.has(ex.id)) fail(ex.id, 'duplicate id')
  ids.add(ex.id)

  for (const key of ['title', 'brief', 'referenceQuery', 'walkthrough', 'dataset']) {
    if (!ex[key]) fail(ex.id, `missing ${key}`)
  }

  const meta = manifest.datasets.find((d) => d.id === ex.dataset)
  if (!meta) {
    fail(ex.id, `unknown dataset ${ex.dataset}`)
    continue
  }
  const bytes = new Uint8Array(fs.readFileSync(`public/datasets/${meta.file}`))

  let expected
  try {
    expected = runExerciseQuery(SQL, bytes, ex.referenceQuery)
  } catch (err) {
    fail(ex.id, `reference query errors: ${err.message}`)
    continue
  }
  if (expected.rows.length === 0) fail(ex.id, 'reference query returns no rows')
  console.log(`  ${expected.rows.length} rows x ${expected.columns.length} cols`)

  const db = new SQL.Database(bytes)
  db.run('CREATE TABLE songs_rev AS SELECT * FROM songs ORDER BY rowid DESC; DROP TABLE songs; ALTER TABLE songs_rev RENAME TO songs;')
  const reversed = db.exec(ex.referenceQuery)[0]
  db.close()
  const verdict = gradeResult({ columns: reversed.columns, rows: reversed.values }, expected, ex.orderMatters)
  if (!verdict.passed) fail(ex.id, `answer depends on storage order (${verdict.reason}): there is a tie somewhere`)

  if (!gradeResult(expected, expected, ex.orderMatters).passed) fail(ex.id, 'reference fails its own grading')
}

console.log(problems ? `\n${problems} problem(s)` : `\nAll ${sqlExercises.length} exercises OK`)
process.exit(problems ? 1 : 0)
