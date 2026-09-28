export const pen = (c) => ({
  dataset: 'palmer-penguins',
  starter: 'answer = ',
  ...c,
  hidden: "penguins = rows('palmer-penguins')\n" + (c.hidden ?? ''),
})
