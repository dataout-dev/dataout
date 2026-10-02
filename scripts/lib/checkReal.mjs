import fs from 'node:fs'
import path from 'node:path'
import { gradeResult, runExerciseQuery } from '../../src/lib/exerciseGrading.js'

// Shared validation for any "real-data challenge"-shaped object (dataset, title, brief, reference,
// orderMatters, walkthrough) — used by both the lesson/exam curriculum checker and the projects checker.
export function createRealChecker({ root, manifest, fail }) {
  const bytesCache = new Map()

  function datasetBytes(id) {
    if (!bytesCache.has(id)) {
      const meta = manifest.datasets.find((d) => d.id === id)
      if (!meta) return null
      bytesCache.set(id, new Uint8Array(fs.readFileSync(path.join(root, 'public/datasets', meta.file))))
    }
    return bytesCache.get(id)
  }

  function reverseTables(db) {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")[0]?.values ?? []
    for (const [name] of tables) {
      db.run(
        `CREATE TABLE "${name}__rev" AS SELECT * FROM "${name}" ORDER BY rowid DESC; DROP TABLE "${name}"; ALTER TABLE "${name}__rev" RENAME TO "${name}";`
      )
    }
  }

  function runOnDataset(SQL, id, query, { reversed = false } = {}) {
    const bytes = datasetBytes(id)
    if (!reversed) return runExerciseQuery(SQL, bytes, query)
    const db = new SQL.Database(bytes)
    try {
      reverseTables(db)
      const results = db.exec(query)
      const last = results[results.length - 1]
      return last ? { columns: last.columns, rows: last.values } : { columns: [], rows: [] }
    } finally {
      db.close()
    }
  }

  function checkReal(SQL, where, real) {
    if (!real.dataset || !datasetBytes(real.dataset)) return fail(where, `unknown dataset ${real.dataset}`)
    for (const key of ['title', 'brief', 'reference']) if (!real[key]) fail(where, `missing ${key}`)
    if (!real.exam && !real.walkthrough) fail(where, 'missing walkthrough')
    let expected
    try {
      expected = runOnDataset(SQL, real.dataset, real.reference)
    } catch (err) {
      return fail(where, `reference query errors: ${err.message}`)
    }
    if (expected.rows.length === 0) fail(where, 'reference returns no rows')
    if (expected.rows.length > 500) fail(where, `reference returns ${expected.rows.length} rows; keep results under 500 (the table shows 500)`)
    const reversed = runOnDataset(SQL, real.dataset, real.reference, { reversed: true })
    const verdict = gradeResult(reversed, expected, !!real.orderMatters)
    if (!verdict.passed) fail(where, `answer depends on storage order (${verdict.reason}): there is a tie somewhere`)
    if (!gradeResult(expected, expected, !!real.orderMatters).passed) fail(where, 'reference fails its own grading')
    return `${expected.rows.length}x${expected.columns.length}`
  }

  return { checkReal, datasetBytes, runOnDataset, reverseTables }
}
