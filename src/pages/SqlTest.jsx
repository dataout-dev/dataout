import { useEffect, useState } from 'react'
import initSqlJs from 'sql.js'
import { formatQueryResult } from '../lib/sqlHelpers'

function SqlTest() {
  const [result, setResult] = useState(null)

  useEffect(() => {
    async function run() {
      const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
      const db = new SQL.Database()

      db.run('CREATE TABLE employees (name TEXT, salary INT);')
      db.run("INSERT INTO employees VALUES ('Priya', 60000), ('Sam', 40000);")

      const queryResult = db.exec('SELECT name FROM employees WHERE salary > 50000;')
      setResult(formatQueryResult(queryResult))
    }
    run()
  }, [])

  return (
    <pre className="p-8 text-sm">
      {result ? JSON.stringify(result, null, 2) : 'Loading...'}
    </pre>
  )
}

export default SqlTest