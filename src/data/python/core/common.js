const TABLES = {
  tracks: ['Track'],
  customers: ['Customer'],
  invoices: ['Invoice'],
  lines: ['InvoiceLine'],
  albums: ['Album'],
  artists: ['Artist'],
  genres: ['Genre'],
  employees: ['Employee'],
  playlists: ['Playlist'],
}

// A real-data challenge on the Chinook store. `use` names the lists to load, for example ['tracks', 'customers'].
export const chi = ({ use = [], ...c }) => ({
  dataset: 'chinook',
  starter: 'answer = ',
  ...c,
  hidden: use.map((name) => `${name} = rows('chinook', '${TABLES[name][0]}')\n`).join('') + (c.hidden ?? ''),
})

// String.raw keeps backslashes as they are, so regular expressions and multi-line Python code read naturally.
export const py = String.raw

// A challenge on the Chinook store where `re` is already imported.
export const rx = (c) => chi({ ...c, hidden: 'import re\n' + (c.hidden ?? '') })
