import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'
import { parseCsv } from '../src/lib/csv.js'

const dir = process.argv[2]
if (!dir) {
  console.error('Usage: node scripts/build-real-datasets.mjs "<folder with the downloaded files>"')
  process.exit(1)
}

const outDir = path.resolve(import.meta.dirname, '..', 'public', 'datasets')
const SQL = await initSqlJs()

const readCsv = (name) => {
  const [header, ...rows] = parseCsv(fs.readFileSync(path.join(dir, name), 'utf8'))
  return { header, rows: rows.filter((r) => r.length === header.length) }
}

const cell = (value, type) => {
  if (value === 'NA' || value === '') return null
  if (type === 'TEXT') return value
  const n = Number(value)
  if (!Number.isFinite(n)) throw new Error(`"${value}" is not a number`)
  return n
}

function tableFromCsv(db, name, csv, columns, { extra = [], keep = () => true, prepend } = {}) {
  const index = Object.fromEntries(csv.header.map((h, i) => [h, i]))
  const defs = columns.map(([col, type]) => `${col} ${type}`)
  if (prepend) defs.unshift(prepend.def)
  for (const [col, type] of extra) defs.push(`${col} ${type}`)
  db.run(`CREATE TABLE ${name} (${defs.join(', ')});`)

  const width = defs.length
  const insert = db.prepare(`INSERT INTO ${name} VALUES (${Array(width).fill('?').join(',')})`)
  let count = 0
  db.run('BEGIN')
  csv.rows.forEach((row, i) => {
    if (!keep(row, i, index)) return
    const values = columns.map(([col, type]) => cell(row[index[col]], type))
    if (prepend) values.unshift(prepend.value(count))
    for (const [, , compute] of extra) values.push(compute(row, index))
    insert.run(values)
    count++
  })
  db.run('COMMIT')
  insert.free()
  return count
}

function save(db, file) {
  db.run('VACUUM')
  const bytes = db.export()
  fs.writeFileSync(path.join(outDir, file), Buffer.from(bytes))
  console.log(`${file}: ${(bytes.length / 1024).toFixed(0)} KB`)
  db.close()
}

{
  const db = new SQL.Database()
  const csv = readCsv('penguins.csv')
  const n = tableFromCsv(
    db,
    'penguins',
    csv,
    [
      ['species', 'TEXT'], ['island', 'TEXT'], ['bill_length_mm', 'REAL'], ['bill_depth_mm', 'REAL'],
      ['flipper_length_mm', 'INTEGER'], ['body_mass_g', 'INTEGER'], ['sex', 'TEXT'], ['year', 'INTEGER'],
    ],
    { prepend: { def: 'id INTEGER PRIMARY KEY', value: (i) => i + 1 } }
  )
  console.log(`penguins: ${n} rows`)
  save(db, 'penguins.sqlite')
}

{
  const bytes = fs.readFileSync(path.join(dir, 'Chinook_Sqlite.sqlite'))
  if (bytes.subarray(0, 15).toString() !== 'SQLite format 3') throw new Error('Chinook file is not a SQLite database')
  fs.writeFileSync(path.join(outDir, 'chinook.sqlite'), bytes)
  console.log(`chinook.sqlite: ${(bytes.length / 1024).toFixed(0)} KB (copied unchanged)`)
}

{
  const db = new SQL.Database()
  const pad = (n) => String(n).padStart(2, '0')
  const isoDate = (row, index) => `${row[index.year]}-${pad(row[index.month])}-${pad(row[index.day])}`

  const airlines = readCsv('airlines.csv')
  console.log('airlines:', tableFromCsv(db, 'airlines', airlines, [['carrier', 'TEXT'], ['name', 'TEXT']]))

  const airports = readCsv('airports.csv')
  console.log('airports:', tableFromCsv(db, 'airports', airports, [
    ['faa', 'TEXT'], ['name', 'TEXT'], ['lat', 'REAL'], ['lon', 'REAL'], ['alt', 'INTEGER'], ['tz', 'INTEGER'],
    ['dst', 'TEXT'], ['tzone', 'TEXT'],
  ]))

  const planes = readCsv('planes.csv')
  console.log('planes:', tableFromCsv(db, 'planes', planes, [
    ['tailnum', 'TEXT'], ['year', 'INTEGER'], ['type', 'TEXT'], ['manufacturer', 'TEXT'], ['model', 'TEXT'],
    ['engines', 'INTEGER'], ['seats', 'INTEGER'], ['speed', 'INTEGER'], ['engine', 'TEXT'],
  ]))

  const weather = readCsv('weather.csv')
  console.log('weather:', tableFromCsv(db, 'weather', weather, [
    ['origin', 'TEXT'], ['month', 'INTEGER'], ['day', 'INTEGER'], ['hour', 'INTEGER'], ['temp', 'REAL'],
    ['humid', 'REAL'], ['wind_speed', 'REAL'], ['precip', 'REAL'], ['visib', 'REAL'],
  ], { extra: [['weather_date', 'TEXT', isoDate]] }))

  const flights = readCsv('flights.csv')
  console.log('flights:', tableFromCsv(db, 'flights', flights, [
    ['month', 'INTEGER'], ['day', 'INTEGER'], ['dep_time', 'INTEGER'], ['sched_dep_time', 'INTEGER'],
    ['dep_delay', 'INTEGER'], ['arr_time', 'INTEGER'], ['sched_arr_time', 'INTEGER'], ['arr_delay', 'INTEGER'],
    ['carrier', 'TEXT'], ['flight', 'INTEGER'], ['tailnum', 'TEXT'], ['origin', 'TEXT'], ['dest', 'TEXT'],
    ['air_time', 'INTEGER'], ['distance', 'INTEGER'], ['hour', 'INTEGER'], ['minute', 'INTEGER'],
  ], { extra: [['flight_date', 'TEXT', isoDate]], keep: (row, i) => i % 10 === 9 }))

  save(db, 'nycflights13.sqlite')
}
