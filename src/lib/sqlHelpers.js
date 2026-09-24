export function formatQueryResult(execResult) {
  if (!execResult || execResult.length === 0) return []

  const { columns, values } = execResult[execResult.length - 1]

  return values.map((row) => {
    const rowObject = {}
    columns.forEach((col, i) => {
      rowObject[col] = row[i]
    })
    return rowObject
  })
}

export function resultsMatch(actual, expected, orderMatters = false) {
  if (actual.length !== expected.length) return false

  const key = (row) =>
    JSON.stringify(row, (_name, value) => (typeof value === 'number' ? Number(value.toFixed(6)) + 0 : value))

  const a = actual.map(key)
  const b = expected.map(key)

  if (orderMatters) return a.every((row, i) => row === b[i])

  a.sort()
  b.sort()
  return a.every((row, i) => row === b[i])
}
