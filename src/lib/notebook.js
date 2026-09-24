export const NOTEBOOK_VERSION = 1
export const DEFAULT_DATASET_ID = 'spotify-2024'
export const STORAGE_KEY = 'dataout-notebook-v1'

export const MAX_ROWS = 500
export const MAX_CELLS = 200
export const MAX_SOURCE_LENGTH = 100000
export const MAX_IMPORT_BYTES = 1000000

const CELL_TYPES = ['sql', 'markdown']

export function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function newCell(type = 'sql', source = '') {
  return { id: newId(), type, source }
}

export function starterNotebook(datasetId) {
  if (datasetId === 'spotify-2024') {
    return {
      version: NOTEBOOK_VERSION,
      datasetId,
      cells: [
        newCell(
          'markdown',
          '## Welcome to your SQL notebook\n\n' +
            'Each cell runs on its own, but they all share one database, so a table you create in one cell is ' +
            'available in the next. Press **Shift+Enter** to run a cell and move to the next one.\n\n' +
            'This notebook has the `songs` table loaded: about 4,600 of the most streamed songs of 2024. ' +
            'Your cells are saved in this browser.'
        ),
        newCell('sql', 'SELECT track, artist, release_date, spotify_streams\nFROM songs\nLIMIT 5;'),
        newCell('markdown', 'What columns does the table have?'),
        newCell('sql', "SELECT name, type FROM pragma_table_info('songs');"),
        newCell('markdown', 'The ten most streamed songs on Spotify:'),
        newCell('sql', 'SELECT track, artist, spotify_streams\nFROM songs\nORDER BY spotify_streams DESC\nLIMIT 10;'),
        newCell(
          'markdown',
          'Some numbers are missing (`NULL`). `COUNT(*)` counts every row, while `COUNT(column)` skips the missing ones:'
        ),
        newCell(
          'sql',
          'SELECT COUNT(*) AS songs,\n       COUNT(siriusxm_spins) AS with_siriusxm,\n       COUNT(*) - COUNT(siriusxm_spins) AS missing\nFROM songs;'
        ),
        newCell('markdown', 'Do explicit songs (`1`) get more streams on average than clean ones (`0`)?'),
        newCell(
          'sql',
          'SELECT explicit_track,\n       COUNT(*) AS songs,\n       ROUND(AVG(spotify_streams)) AS avg_streams\nFROM songs\nGROUP BY explicit_track;'
        ),
      ],
    }
  }

  return {
    version: NOTEBOOK_VERSION,
    datasetId: null,
    cells: [
      newCell(
        'markdown',
        '## A blank database\n\nCreate your own tables here. Cells share one database, so what you create in one cell ' +
          'is there for the next. Press **Shift+Enter** to run a cell.'
      ),
      newCell(
        'sql',
        "CREATE TABLE fruit (name TEXT, price INT);\nINSERT INTO fruit VALUES ('apple', 30), ('mango', 80), ('banana', 20);"
      ),
      newCell('sql', 'SELECT * FROM fruit ORDER BY price DESC;'),
    ],
  }
}

const totalChanges = (db) => db.exec('SELECT total_changes()')[0].values[0][0]

export function runSql(db, source, { maxRows = MAX_ROWS } = {}) {
  if (!source.trim()) return { ok: true, empty: true, results: [], changes: 0, ms: 0 }

  const started = performance.now()
  try {
    const before = totalChanges(db)
    const resultSets = db.exec(source)
    const changes = totalChanges(db) - before

    const results = resultSets.map((set) => ({
      columns: set.columns,
      rows: set.values.length > maxRows ? set.values.slice(0, maxRows) : set.values,
      totalRows: set.values.length,
      truncated: set.values.length > maxRows,
    }))

    return { ok: true, results, changes, ms: performance.now() - started }
  } catch (err) {
    return { ok: false, error: err.message, ms: performance.now() - started }
  }
}

export function runCells(db, cells, startCount = 0, { stopOnError = false } = {}) {
  const outputs = {}
  let count = startCount

  for (const cell of cells) {
    if (cell.type !== 'sql' || !cell.source.trim()) continue
    count += 1
    const result = runSql(db, cell.source)
    outputs[cell.id] = { ...result, count }
    if (!result.ok && stopOnError) break
  }

  return { outputs, count }
}

export function describeDb(db) {
  const found = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  const names = found.length ? found[0].values.map((row) => row[0]) : []

  return names.map((name) => {
    const quoted = `"${name.replace(/"/g, '""')}"`
    const info = db.exec(`PRAGMA table_info(${quoted})`)
    const columns = info.length ? info[0].values.map((row) => ({ name: row[1], type: row[2] })) : []
    const rowCount = db.exec(`SELECT COUNT(*) FROM ${quoted}`)[0].values[0][0]
    return { name, columns, rowCount }
  })
}

export function serializeNotebook(notebook) {
  return JSON.stringify(
    {
      version: NOTEBOOK_VERSION,
      datasetId: notebook.datasetId ?? null,
      cells: notebook.cells.map(({ type, source }) => ({ type, source })),
    },
    null,
    2
  )
}

export function parseNotebook(text) {
  if (typeof text !== 'string' || text.length > MAX_IMPORT_BYTES) {
    throw new Error('That file is too large to be a notebook.')
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error("That file isn't valid JSON.")
  }

  if (!data || typeof data !== 'object' || data.version !== NOTEBOOK_VERSION) {
    throw new Error("That doesn't look like a DataOut notebook.")
  }
  if (!Array.isArray(data.cells) || data.cells.length === 0 || data.cells.length > MAX_CELLS) {
    throw new Error(`A notebook needs between 1 and ${MAX_CELLS} cells.`)
  }

  const cells = data.cells.map((cell) => {
    if (
      !cell ||
      !CELL_TYPES.includes(cell.type) ||
      typeof cell.source !== 'string' ||
      cell.source.length > MAX_SOURCE_LENGTH
    ) {
      throw new Error('One of the notebook cells is invalid.')
    }
    return newCell(cell.type, cell.source)
  })

  return {
    version: NOTEBOOK_VERSION,
    datasetId: typeof data.datasetId === 'string' ? data.datasetId : null,
    cells,
  }
}

export function loadSavedNotebook() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseNotebook(saved) : null
  } catch {
    return null
  }
}

export function saveNotebook(notebook) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeNotebook(notebook))
    return true
  } catch {
    return false
  }
}
