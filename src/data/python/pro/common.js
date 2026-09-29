const TABLES = {
  tracks: ['chinook', 'Track'],
  customers: ['chinook', 'Customer'],
  invoices: ['chinook', 'Invoice'],
  albums: ['chinook', 'Album'],
  artists: ['chinook', 'Artist'],
  genres: ['chinook', 'Genre'],
  employees: ['chinook', 'Employee'],
  songs: ['spotify-2024', 'songs'],
}

// String.raw keeps backslashes as they are, so Python code reads naturally.
export const py = String.raw

// A real-data challenge on Chinook or the Spotify songs. `use` names the lists to load.
export const pro = ({ use = [], dataset, ...c }) => {
  const sets = new Set(use.map((name) => TABLES[name][0]))
  if (dataset) sets.add(dataset)
  if (sets.size !== 1) throw new Error(`pro() needs exactly one dataset, got ${[...sets]} for ${c.title}`)
  return {
    dataset: dataset ?? [...sets][0],
    starter: 'answer = ',
    ...c,
    hidden: use.map((name) => `${name} = rows('${TABLES[name][0]}', '${TABLES[name][1]}')\n`).join('') + (c.hidden ?? ''),
  }
}
