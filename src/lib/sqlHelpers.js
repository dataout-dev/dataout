// src/lib/sqlHelpers.js
export function formatQueryResult(execResult) {
  if (!execResult || execResult.length === 0) return []

  const { columns, values } = execResult[0]

  return values.map((row) => {
    const rowObject = {}
    columns.forEach((col, i) => {
      rowObject[col] = row[i]
    })
    return rowObject
  })
}


export function resultsMatch(actual, expected) {
  if (actual.length !== expected.length) return false

  const normalize = (rows) =>
    rows.map((row) => JSON.stringify(row)).sort()

  const a = normalize(actual)
  const b = normalize(expected)

  return a.every((row, i) => row === b[i])
}