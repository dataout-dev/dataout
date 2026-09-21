// Turns an uploaded CSV file into a table in the notebook's SQLite database.
// Everything happens in the browser; the file is never sent anywhere.

import { decodeBytes, detectDelimiter, parseCsv } from './csv'

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024
export const MAX_UPLOAD_ROWS = 300000
export const MAX_UPLOAD_COLUMNS = 200

// Spellings of "no value" that we store as NULL, like empty cells. The list is deliberately
// short and case-exact: "NA" (Namibia) or "Nan" (a name) can be real data.
const NULL_TOKENS = new Set(['NaN', 'nan', 'NULL', 'null', 'N/A', 'n/a', '#N/A'])

const INTEGER_TEXT = /^-?\d+$/
const NUMBER_TEXT = /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/

// ---------------------------------------------------------------- naming

// "Video Views (2023)" -> "video_views_2023". Accents are dropped, anything else becomes "_".
export function snakeCase(name) {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function tableNameFromFile(fileName) {
  const base = fileName.replace(/^.*[\\/]/, '').replace(/\.[^.]*$/, '')
  const name = snakeCase(base)
  if (!name) return 'uploaded_data'
  return /^\d/.test(name) ? `t_${name}` : name
}

const same = (a, b) => a.toLowerCase() === b.toLowerCase()

// SQLite itself decides whether a name is usable unquoted (SELECT, ORDER, GROUP...): if a
// throwaway table can't be created with it, we add a trailing underscore.
function usableUnquoted(db, name) {
  try {
    db.run(`CREATE TEMP TABLE "__probe" (${name} INT); DROP TABLE "__probe";`)
    return true
  } catch {
    try {
      db.run('DROP TABLE IF EXISTS temp."__probe"')
    } catch {
      // nothing to clean up
    }
    return false
  }
}

function safeName(db, name) {
  return usableUnquoted(db, name) ? name : `${name}_`
}

function uniqueName(name, taken) {
  if (!taken.some((t) => same(t, name))) return name
  let n = 2
  while (taken.some((t) => same(t, `${name}_${n}`))) n++
  return `${name}_${n}`
}

// One safe, unique SQL name per header cell.
export function columnNames(db, headerCells) {
  const names = []
  headerCells.forEach((cell, i) => {
    let name = snakeCase(String(cell))
    if (!name) name = `column_${i + 1}`
    else if (/^\d/.test(name)) name = `c_${name}`
    names.push(uniqueName(safeName(db, name), names))
  })
  return names
}

// -------------------------------------------------------------- typing

// INTEGER, REAL or TEXT for one column's values (null = missing).
export function inferType(values) {
  let sawValue = false
  let allInteger = true

  for (const value of values) {
    if (value === null) continue
    sawValue = true

    // Leading zeros mean identifiers (zip codes, IDs): keep them exactly as written.
    if (/^-?0\d/.test(value)) return 'TEXT'

    if (INTEGER_TEXT.test(value)) {
      if (!Number.isSafeInteger(Number(value))) return 'TEXT'
      continue
    }
    if (NUMBER_TEXT.test(value)) {
      // 2.28E+11 is a whole number written in scientific notation; 5.0 stays a decimal.
      if (!(/[eE]/.test(value) && Number.isSafeInteger(Number(value)))) allInteger = false
      continue
    }
    return 'TEXT'
  }

  if (!sawValue) return 'TEXT'
  return allInteger ? 'INTEGER' : 'REAL'
}

// ------------------------------------------------------------ importing

const quote = (identifier) => `"${identifier.replace(/"/g, '""')}"`

function existingTables(db) {
  const found = db.exec("SELECT name FROM sqlite_master WHERE type = 'table'")
  return found.length ? found[0].values.map((row) => row[0]) : []
}

// Creates a table from the file's bytes and returns a summary. Throws an Error with a message that
// is safe to show. `tableName` is used as the starting point when re-loading a saved upload.
export function importCsv(db, bytes, { fileName, tableName } = {}) {
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw new Error(`That file is too large (the limit is ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB).`)
  }

  // Text files never contain NUL bytes; Excel workbooks, images, PDFs and zip files do.
  if (bytes.subarray(0, 8192).includes(0)) {
    throw new Error("That doesn't look like a CSV text file. If it's an Excel file, save it as CSV first (File > Save As > CSV).")
  }

  const { text, encoding } = decodeBytes(bytes)
  const delimiter = detectDelimiter(text)
  const rows = parseCsv(text, delimiter)

  if (rows.length === 0) throw new Error('That file is empty.')
  const [header, ...records] = rows
  if (records.length === 0) throw new Error('That file only has a header row and no data.')
  if (records.length > MAX_UPLOAD_ROWS) {
    throw new Error(`That file has more than ${MAX_UPLOAD_ROWS.toLocaleString()} rows, which is more than the playground can hold.`)
  }
  if (header.length > MAX_UPLOAD_COLUMNS) {
    throw new Error(`That file has more than ${MAX_UPLOAD_COLUMNS} columns.`)
  }

  // Normalise every record to the header's width, and turn "no value" spellings into NULL.
  let nullTokens = 0
  const table = records.map((record, r) => {
    if (record.length > header.length && record.slice(header.length).some((cell) => cell.trim() !== '')) {
      throw new Error(`Row ${r + 2} has more values than the header. The file may use a different delimiter or have unbalanced quotes.`)
    }
    return header.map((_, c) => {
      const raw = (record[c] ?? '').trim()
      if (raw === '') return null
      if (NULL_TOKENS.has(raw)) {
        nullTokens++
        return null
      }
      return raw
    })
  })

  const types = header.map((_, c) => inferType(table.map((row) => row[c])))
  const names = columnNames(db, header)

  const taken = existingTables(db)
  const finalName = uniqueName(safeName(db, tableName ?? tableNameFromFile(fileName ?? 'upload.csv')), taken)

  db.run(`CREATE TABLE ${quote(finalName)} (${names.map((n, c) => `${quote(n)} ${types[c]}`).join(', ')})`)

  try {
    db.run('BEGIN')
    const insert = db.prepare(`INSERT INTO ${quote(finalName)} VALUES (${names.map(() => '?').join(', ')})`)
    for (const row of table) {
      insert.run(row.map((value, c) => (value !== null && types[c] !== 'TEXT' ? Number(value) : value)))
    }
    insert.free()
    db.run('COMMIT')
  } catch (err) {
    try {
      db.run('ROLLBACK')
    } catch {
      // no open transaction
    }
    db.run(`DROP TABLE IF EXISTS ${quote(finalName)}`)
    throw new Error(`Couldn't load that file: ${err.message}`)
  }

  return {
    tableName: finalName,
    columns: names.map((name, c) => ({ name, type: types[c], original: String(header[c]).trim() })),
    rowCount: table.length,
    encoding,
    delimiter,
    nullTokens,
    renamed: tableName !== undefined && finalName !== tableName,
  }
}
