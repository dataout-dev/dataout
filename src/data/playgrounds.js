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
    available: false,
    description: 'Notebooks for data analysis with Python.',
  },
]

export const availablePlaygrounds = playgrounds.filter((p) => p.available)
export const sqlPlayground = playgrounds.find((p) => p.id === 'sql')
