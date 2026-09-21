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


// Runs `query` against every test case, each on its own throwaway database. Only a label
// and a pass/fail boolean are kept, never the rows produced or the expected rows.
export function evaluateSubmission(SQL, testCases, query) {
  const results = []

  for (const testCase of testCases) {
    let passed = false
    const db = new SQL.Database()

    try {
      db.run(testCase.setupSQL)
      const actual = formatQueryResult(db.exec(query))
      passed = resultsMatch(actual, testCase.expectedResult)
    } catch {
      // This case fails, but the remaining cases still get checked.
      passed = false
    } finally {
      db.close()
    }

    results.push({ label: testCase.label, passed })
  }

  return results
}

export function resultsMatch(actual, expected) {
  if (actual.length !== expected.length) return false

  const normalize = (rows) =>
    rows.map((row) => JSON.stringify(row)).sort()

  const a = normalize(actual)
  const b = normalize(expected)

  return a.every((row, i) => row === b[i])
}