import { formatQueryResult, resultsMatch } from './sqlHelpers.js'

export function openCase(SQL, lesson, testCase) {
  const db = new SQL.Database()
  db.run(lesson.schema)
  db.run(testCase.data)
  return db
}

export function rowsFor(SQL, lesson, testCase, sql) {
  const db = openCase(SQL, lesson, testCase)
  try {
    return formatQueryResult(db.exec(sql))
  } finally {
    db.close()
  }
}

export function expectedFor(SQL, lesson, testCase) {
  return rowsFor(SQL, lesson, testCase, lesson.solution)
}

export function evaluateLesson(SQL, lesson, query) {
  return lesson.testCases.map((testCase) => {
    let passed = false
    try {
      const expected = expectedFor(SQL, lesson, testCase)
      const actual = rowsFor(SQL, lesson, testCase, query)
      passed = resultsMatch(actual, expected, lesson.orderMatters)
    } catch {
      passed = false
    }
    return { label: testCase.label, passed }
  })
}
