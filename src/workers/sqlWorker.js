import initSqlJs from 'sql.js'
import { openCase, evaluateLesson, expectedFor } from '../lib/lessonGrading.js'
import { runExerciseQuery } from '../lib/exerciseGrading.js'
import { importCsv } from '../lib/csvImport.js'
import { describeDb, runCells } from '../lib/notebook.js'

const NO_SESSION = 'NO_SESSION'

let sqlReady
const loadSql = () => (sqlReady ??= initSqlJs({ locateFile: () => '/sql-wasm.wasm' }))

const datasets = new Map()
const sessions = new Map()

function session(id) {
  const db = sessions.get(id)
  if (!db) {
    const err = new Error('That database was reset. Run it again.')
    err.code = NO_SESSION
    throw err
  }
  return db
}

function replace(id, db) {
  sessions.get(id)?.close()
  sessions.set(id, db)
}

function listTables(db) {
  const names = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  return (names[0]?.values ?? []).map(([tableName]) => {
    const info = db.exec(`PRAGMA table_info("${tableName.replace(/"/g, '""')}")`)
    return { tableName, columns: (info[0]?.values ?? []).map((row) => ({ name: row[1], type: row[2] })) }
  })
}

const handlers = {
  async 'dataset.load'({ id, bytes }) {
    const SQL = await loadSql()
    datasets.set(id, bytes)
    const db = new SQL.Database(bytes)
    try {
      return listTables(db)
    } finally {
      db.close()
    }
  },

  async 'dataset.query'({ id, query }) {
    const SQL = await loadSql()
    return runExerciseQuery(SQL, datasets.get(id), query)
  },

  async 'dataset.grade'({ id, query, reference }) {
    const SQL = await loadSql()
    const bytes = datasets.get(id)
    const actual = runExerciseQuery(SQL, bytes, query)
    const expected = runExerciseQuery(SQL, bytes, reference)
    return { actual, expected }
  },

  async 'lesson.open'({ id, lesson }) {
    const SQL = await loadSql()
    const first = lesson.testCases[0]
    const db = openCase(SQL, lesson, first)
    replace(id, db)
    return { tables: listTables(db), expected: expectedFor(SQL, lesson, first) }
  },

  async 'lesson.evaluate'({ lesson, query }) {
    const SQL = await loadSql()
    return evaluateLesson(SQL, lesson, query)
  },

  async 'db.open'({ id, bytes }) {
    const SQL = await loadSql()
    replace(id, bytes ? new SQL.Database(bytes) : new SQL.Database())
  },

  'db.exec'({ id, sql }) {
    return session(id).exec(sql)
  },

  'db.run'({ id, sql }) {
    session(id).run(sql)
  },

  'db.describe'({ id }) {
    return describeDb(session(id))
  },

  'db.runCells'({ id, cells, startCount, stopOnError }) {
    return runCells(session(id), cells, startCount, { stopOnError })
  },

  'db.importCsv'({ id, bytes, fileName, tableName }) {
    return importCsv(session(id), bytes, { fileName, tableName })
  },

  'db.close'({ id }) {
    sessions.get(id)?.close()
    sessions.delete(id)
  },
}

self.onmessage = async ({ data: { id, op, payload } }) => {
  try {
    const handler = handlers[op]
    if (!handler) throw new Error(`Unknown operation "${op}".`)
    const result = await handler(payload ?? {})
    self.postMessage({ id, result })
  } catch (err) {
    self.postMessage({ id, error: { message: err?.message ?? String(err), code: err?.code } })
  }
}
