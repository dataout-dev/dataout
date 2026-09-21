// Builds public/datasets/spotify-2024.sqlite from the Kaggle CSV.
//
//   Dataset: "Most Streamed Spotify Songs 2024" by Nidula Elgiriyewithana, CC BY-SA 4.0
//   https://www.kaggle.com/datasets/nelgiriyewithana/most-streamed-spotify-songs-2024
//
// Usage (download and unzip the CSV from Kaggle first; the raw CSV is not kept in the repo):
//   node scripts/build-spotify-2024.mjs "path/to/Most Streamed Spotify Songs 2024.csv"
//
// Changes made to the original data (also listed in public/datasets/manifest.json, as CC BY-SA
// requires us to say we modified it):
//   - CSV converted to a SQLite table named `songs`; column names are snake_case
//   - Text decoded as Windows-1252 (the file is not valid UTF-8)
//   - Numbers stored as text with thousands separators ("390,470,936") converted to real numbers
//   - Release dates converted from M/D/YYYY to ISO YYYY-MM-DD
//   - `TIDAL Popularity` dropped (empty in every row)
//   - Rows with a repeated ISRC removed (first occurrence kept)
// Names whose accents were already destroyed in the source file are left exactly as they are.

import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'
import { parseCsv } from '../src/lib/csv.js'

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/build-spotify-2024.mjs "<path to Most Streamed Spotify Songs 2024.csv>"')
  process.exit(1)
}

const outFile = path.resolve(import.meta.dirname, '..', 'public', 'datasets', 'spotify-2024.sqlite')

const TEXT_COLUMNS = new Set(['Track', 'Album Name', 'Artist', 'Release Date', 'ISRC'])
const REAL_COLUMNS = new Set(['Track Score'])
const DROPPED_COLUMNS = new Set(['TIDAL Popularity'])

const snake = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const columnType = (name) => (TEXT_COLUMNS.has(name) ? 'TEXT' : REAL_COLUMNS.has(name) ? 'REAL' : 'INTEGER')

function isoDate(value) {
  const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) throw new Error(`Unexpected date format: "${value}"`)
  return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`
}

const text = new TextDecoder('windows-1252').decode(fs.readFileSync(input))
const [header, ...records] = parseCsv(text)
const rows = records.filter((r) => r.length === header.length)
if (rows.length !== records.filter((r) => r.length > 1).length) {
  throw new Error('Some CSV rows have an unexpected number of fields.')
}

const columns = header.filter((name) => !DROPPED_COLUMNS.has(name))
const index = Object.fromEntries(header.map((name, i) => [name, i]))

const SQL = await initSqlJs()
const db = new SQL.Database()
db.run(`CREATE TABLE songs (${columns.map((name) => `${snake(name)} ${columnType(name)}`).join(', ')});`)

const insert = db.prepare(`INSERT INTO songs VALUES (${columns.map(() => '?').join(', ')})`)
const seenIsrc = new Set()
let duplicates = 0

for (const row of rows) {
  const isrc = row[index.ISRC]
  if (seenIsrc.has(isrc)) { duplicates++; continue }
  seenIsrc.add(isrc)

  insert.run(
    columns.map((name) => {
      const value = (row[index[name]] ?? '').trim()
      if (value === '') return null
      if (name === 'Release Date') return isoDate(value)
      if (columnType(name) === 'TEXT') return value
      const number = Number(value.replace(/,/g, ''))
      if (!Number.isFinite(number)) throw new Error(`Non-numeric value "${value}" in column "${name}"`)
      return number
    })
  )
}
insert.free()

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, Buffer.from(db.export()))

const count = db.exec('SELECT COUNT(*) FROM songs')[0].values[0][0]
console.log(`Wrote ${path.relative(process.cwd(), outFile)}`)
console.log(`  ${count} rows, ${columns.length} columns, ${duplicates} duplicate ISRC rows removed`)
console.log(`  ${fs.statSync(outFile).size} bytes`)
