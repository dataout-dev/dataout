export const exerciseSubjects = [
  {
    id: 'sql',
    name: 'SQL',
    path: '/exercise/sql',
    available: true,
    description: 'One real-world question a day, on real data. No hints, no guardrails.',
  },
  {
    id: 'python',
    name: 'Python',
    path: '/exercise/python',
    available: false,
    description: 'A daily data-wrangling challenge with Python.',
  },
  {
    id: 'de',
    name: 'Data engineering',
    path: '/exercise/de',
    available: false,
    description: 'A daily pipeline problem, from a messy source to a clean table.',
  },
]

export const availableExerciseSubjects = exerciseSubjects.filter((s) => s.available)
