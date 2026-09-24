## SQL's if-else

Sometimes you need to turn a number or a code into something readable: a score into a grade, a status code into a word, a price into a "band". `CASE` does that.

| name   | score |
| ------ | ----- |
| Asha   | 95    |
| Ben    | 75    |
| Chitra | 59    |
| Esha   | *NULL* |

## Syntax

```sql
SELECT name,
       CASE
         WHEN score >= 90 THEN 'A'
         WHEN score >= 75 THEN 'B'
         ELSE 'F'
       END AS grade
FROM students;
```

`CASE` checks each `WHEN` from **top to bottom** and returns the value of the **first** one that is true. If none match it returns the `ELSE` value (or `NULL` if there is no `ELSE`).

## Order matters

Because it stops at the first match, put the most specific test first. In the example, a score of 95 also satisfies `score >= 75`, but it never gets there because `score >= 90` matched first.

## Don't forget NULL

Look at Esha, whose score is missing. `NULL >= 90` is unknown, not true, so every `WHEN` fails and she falls into `ELSE 'F'`. Failing an absent student is probably not what you meant. Handle it explicitly, first:

```sql
CASE
  WHEN score IS NULL THEN 'Absent'
  WHEN score >= 90 THEN 'A'
  ...
```

## CASE inside aggregates

`CASE` also works inside `COUNT` and `SUM`, which is how you count only some rows:

```sql
SELECT SUM(CASE WHEN score >= 75 THEN 1 ELSE 0 END) AS passed
FROM students;
```

You'll use this idea a lot in the Expert tier.

## Keep in mind

- Two forms exist: the one above (`CASE WHEN condition`) and a short form (`CASE column WHEN value THEN ...`) for exact matches.
- Every branch should return the same kind of value: all text or all numbers.
- Check the boundaries: `>= 90` and `> 90` treat a score of exactly 90 differently.
