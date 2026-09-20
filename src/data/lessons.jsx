// src/data/lessons.js
export const lessons = [
  {
    id: 'sql-where-basics',
    title: 'Filtering rows',
    titleAccent: 'with WHERE.',
    topic: 'Core filtering patterns',
    blurb: 'Use conditions to return exactly the rows you need.',
    subject: 'sql',
    concept: 'A `WHERE` clause filters the rows a query returns, based on a condition.',
    setupSQL: `
      CREATE TABLE employees (name TEXT, salary INT);
      INSERT INTO employees VALUES
        ('Priya', 60000),
        ('Sam', 4000),
        ('Aditi', 15000),
        ('Rahul', 3000);
    `,
    prompt: 'Return all employees earning more than 5000.',
    successNote: 'You used WHERE to filter employees by salary.',
    expectedResult: [
      { name: 'Priya', salary: 60000 },
      { name: 'Aditi', salary: 15000 }
    ]
  },
  {
    id: 'sql-limit-basics',
    title: 'Limiting results',
    titleAccent: 'with LIMIT.',
    topic: 'Controlling result size',
    blurb: 'Cap how many rows come back with LIMIT.',
    subject: 'sql',
    concept: 'A `LIMIT` clause caps how many rows a query returns. Pair it with `ORDER BY` so you know exactly which rows you get back.',
    setupSQL: `
      CREATE TABLE products (name TEXT, price INT);
      INSERT INTO products VALUES
        ('Notebook', 40),
        ('Pen', 10),
        ('Backpack', 150),
        ('Water Bottle', 60),
        ('Desk Lamp', 90);
    `,
    prompt: 'Return the 3 cheapest products (sort by price with ORDER BY, then keep only 3 rows).',
    successNote: 'You used ORDER BY with LIMIT to pick exactly the rows you wanted.',
    expectedResult: [
      { name: 'Pen', price: 10 },
      { name: 'Notebook', price: 40 },
      { name: 'Water Bottle', price: 60 }
    ]
  }
]