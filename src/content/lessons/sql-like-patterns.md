## Searching text

`=` only finds exact matches. To find text that **starts with**, **ends with** or **contains** something, use `LIKE` and a pattern.

| name   | city   |
| ------ | ------ |
| Aarav  | Pune   |
| Anjali | Mumbai |
| Bhavna | Delhi  |
| Kabir  | Pune   |

## Two wildcards

Inside a `LIKE` pattern:

- `%` stands for **any number of characters** (including none).
- `_` stands for **exactly one** character.

```sql
SELECT name FROM students WHERE name LIKE 'A%';   -- starts with A: Aarav, Anjali
SELECT name FROM students WHERE name LIKE '%r';   -- ends with r: Kabir
SELECT name FROM students WHERE name LIKE '%an%'; -- contains "an": Anjali
SELECT name FROM students WHERE name LIKE 'K_bir'; -- K, any one letter, then bir
```

## Case

In SQLite, `LIKE` ignores upper and lower case for ordinary English letters, so `'a%'` also matches `Aarav`. Other databases can differ.

## Common mistakes

- **Forgetting the `%`.** `LIKE 'A'` matches only the single letter A, exactly like `=`.
- **A leading `%` is slow on huge tables.** `LIKE '%son'` cannot use an index, because the database has to look at every value.
- **Spaces count.** `LIKE 'The %'` (with a space) is not the same as `LIKE 'The%'`.

## Looking for a real `%`

Rarely you need to search for a literal percent sign. Use `ESCAPE`:

```sql
WHERE discount LIKE '10\%' ESCAPE '\'
```

## Keep in mind

`LIKE` is for simple patterns. For anything more complex, databases have regular expression tools, but they differ between systems, so learn `LIKE` first.
