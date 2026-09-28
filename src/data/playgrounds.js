export const playgrounds = [
  {
    id: 'sql',
    name: 'SQL',
    path: '/playground/sql',
    available: true,
    description: 'A notebook for SQL. Query real datasets, upload your own CSV, and keep notes next to your queries.',
  },
  {
    id: 'python',
    name: 'Python',
    path: '/playground/python',
    available: true,
    description: 'A notebook for Python. Run code in cells, use built-in datasets, and import pandas and numpy.',
  },
]

export const availablePlaygrounds = playgrounds.filter((p) => p.available)
export const pythonPlayground = playgrounds.find((p) => p.id === 'python')
export const sqlPlayground = playgrounds.find((p) => p.id === 'sql')
