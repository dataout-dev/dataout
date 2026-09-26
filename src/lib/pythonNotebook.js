import { MAX_CELLS, MAX_IMPORT_BYTES, MAX_SOURCE_LENGTH, newCell } from './notebook'

export const PY_NOTEBOOK_VERSION = 1
export const PY_STORAGE_KEY = 'dataout-pynotebook-v1'
export const DEFAULT_PY_DATASET_ID = 'palmer-penguins'

const CELL_TYPES = ['python', 'markdown']

export function starterPyNotebook(datasetId) {
  if (datasetId === 'palmer-penguins') {
    return {
      version: PY_NOTEBOOK_VERSION,
      datasetId,
      cells: [
        newCell(
          'markdown',
          '## Welcome to your Python notebook\n\n' +
            'Each cell runs on its own, but they all share one Python session, so a variable you create in one cell is ' +
            'available in the next. Press **Shift+Enter** to run a cell and move to the next one.\n\n' +
            'This notebook has the Palmer Penguins dataset ready. `rows()` returns its rows as a list of dictionaries. ' +
            'Your cells are saved in this browser.'
        ),
        newCell('python', 'print("Hello from Python!")\n2 + 3 * 4'),
        newCell('markdown', 'Load the penguins and look at the first one. The last line of a cell is shown automatically:'),
        newCell('python', "penguins = rows('palmer-penguins')\nprint(len(penguins), 'penguins')\npenguins[0]"),
        newCell('markdown', 'How many penguins of each species? `Counter` comes from the standard library:'),
        newCell(
          'python',
          'from collections import Counter\n\nCounter(p["species"] for p in penguins)'
        ),
        newCell('markdown', 'Average body mass per species. Some penguins have no measurement, so those are skipped:'),
        newCell(
          'python',
          'masses = {}\nfor p in penguins:\n    if p["body_mass_g"] is not None:\n        masses.setdefault(p["species"], []).append(p["body_mass_g"])\n\n{species: round(sum(v) / len(v)) for species, v in masses.items()}'
        ),
        newCell(
          'markdown',
          'Libraries such as pandas and numpy are downloaded the first time you import them, which takes a few seconds:'
        ),
        newCell(
          'python',
          'import pandas as pd\n\ndf = pd.DataFrame(penguins)\ndf.groupby("species")["flipper_length_mm"].mean().round(1)'
        ),
      ],
    }
  }

  return {
    version: PY_NOTEBOOK_VERSION,
    datasetId: null,
    cells: [
      newCell(
        'markdown',
        '## A blank Python session\n\nCells share one Python session, so what you define in one cell is there for the next. ' +
          'Press **Shift+Enter** to run a cell.'
      ),
      newCell('python', 'def greet(name):\n    return f"Hello, {name}!"\n\ngreet("world")'),
      newCell('python', 'squares = [n * n for n in range(1, 8)]\nprint(squares)\nsum(squares)'),
    ],
  }
}

export function serializePyNotebook(notebook) {
  return JSON.stringify(
    {
      version: PY_NOTEBOOK_VERSION,
      language: 'python',
      datasetId: notebook.datasetId ?? null,
      cells: notebook.cells.map(({ type, source }) => ({ type, source })),
    },
    null,
    2
  )
}

export function parsePyNotebook(text) {
  if (typeof text !== 'string' || text.length > MAX_IMPORT_BYTES) {
    throw new Error('That file is too large to be a notebook.')
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error("That file isn't valid JSON.")
  }

  if (!data || typeof data !== 'object' || data.version !== PY_NOTEBOOK_VERSION || data.language !== 'python') {
    throw new Error("That doesn't look like a DataOut Python notebook.")
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
    version: PY_NOTEBOOK_VERSION,
    datasetId: typeof data.datasetId === 'string' ? data.datasetId : null,
    cells,
  }
}

export function loadSavedPyNotebook() {
  try {
    const saved = localStorage.getItem(PY_STORAGE_KEY)
    return saved ? parsePyNotebook(saved) : null
  } catch {
    return null
  }
}

export function savePyNotebook(notebook) {
  try {
    localStorage.setItem(PY_STORAGE_KEY, serializePyNotebook(notebook))
    return true
  } catch {
    return false
  }
}
