export function runExerciseQuery(SQL, bytes, query) {
  const db = new SQL.Database(bytes)
  try {
    const results = db.exec(query)
    const last = results[results.length - 1]
    return last ? { columns: last.columns, rows: last.values } : { columns: [], rows: [] }
  } finally {
    db.close()
  }
}

function normalizeValue(value) {
  if (typeof value === 'number') return Number(value.toFixed(6)) + 0
  if (value instanceof Uint8Array) return `[blob ${value.length}]`
  return value
}

const rowKey = (row) => JSON.stringify(row.map(normalizeValue))

export function gradeResult(actual, expected, orderMatters) {
  if (actual.columns.length !== expected.columns.length) return { passed: false, reason: 'columns' }
  if (actual.rows.length !== expected.rows.length) return { passed: false, reason: 'rows' }

  const got = actual.rows.map(rowKey)
  const want = expected.rows.map(rowKey)

  const sameSet = [...got].sort().every((key, i) => key === [...want].sort()[i])
  if (!sameSet) return { passed: false, reason: 'values' }

  if (orderMatters && !got.every((key, i) => key === want[i])) return { passed: false, reason: 'order' }

  return { passed: true, reason: null }
}

export const failureMessages = {
  columns: (expected) =>
    `Your query returns a different number of columns than the task asks for (${expected}). Check the list under "Return".`,
  rows: () => "Your query returns a different number of rows than it should. Check your filters and any LIMIT.",
  order: () => 'Right rows, wrong order. Re-read how the task wants them sorted, including how to break ties.',
  values: () => 'Right shape, but some values are off. Check your conditions, your calculations and any rounding.',
}
