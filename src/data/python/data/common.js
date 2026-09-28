const TABLES = {
  tracks: ['chinook', 'Track'],
  customers: ['chinook', 'Customer'],
  invoices: ['chinook', 'Invoice'],
  albums: ['chinook', 'Album'],
  artists: ['chinook', 'Artist'],
  genres: ['chinook', 'Genre'],
  employees: ['chinook', 'Employee'],
  songs: ['spotify-2024', 'songs'],
  flights: ['nycflights13', 'flights'],
  airlines: ['nycflights13', 'airlines'],
  airports: ['nycflights13', 'airports'],
  planes: ['nycflights13', 'planes'],
  weather: ['nycflights13', 'weather'],
  penguins: ['palmer-penguins', 'penguins'],
}

// String.raw keeps backslashes as they are, so Python code (and any regex inside it) reads naturally.
export const py = String.raw

const oneDataset = (use, dataset, title) => {
  const sets = new Set(use.map((name) => TABLES[name][0]))
  if (dataset) sets.add(dataset)
  if (sets.size !== 1) throw new Error(`needs exactly one dataset, got ${[...sets]} for ${title}`)
  return dataset ?? [...sets][0]
}

// A real-data challenge loading plain rows (a list of dicts), e.g. to build arrays or objects by hand.
export const dat = ({ use = [], dataset, ...c }) => ({
  dataset: oneDataset(use, dataset, c.title),
  starter: 'answer = ',
  ...c,
  hidden: use.map((name) => `${name} = rows('${TABLES[name][0]}', '${TABLES[name][1]}')\n`).join('') + (c.hidden ?? ''),
})

// A real-data challenge with tables already loaded as pandas DataFrames, numpy and pandas already imported.
export const pdf = ({ use = [], dataset, ...c }) => ({
  dataset: oneDataset(use, dataset, c.title),
  starter: 'answer = ',
  ...c,
  hidden:
    'import pandas as pd\nimport numpy as np\n' +
    use.map((name) => `${name} = pd.DataFrame(rows('${TABLES[name][0]}', '${TABLES[name][1]}'))\n`).join('') +
    (c.hidden ?? ''),
})

// pdf(), plus a headless-safe matplotlib pyplot already imported as plt.
export const viz = (c) => pdf({ ...c, hidden: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\n' + (c.hidden ?? '') })
