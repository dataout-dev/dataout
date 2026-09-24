## Finding streaks

"How many days in a row did this user log in?" "Which weeks did it rain without a break?" These ask for **runs of consecutive values**. SQL has no "consecutive" keyword, but a neat trick finds them. The problem is known as **gaps and islands**: the days form islands, separated by gaps.

| user | day        |
| ---- | ---------- |
| asha | 2024-03-01 |
| asha | 2024-03-02 |
| asha | 2024-03-03 |
| asha | 2024-03-05 |
| asha | 2024-03-06 |

There are two islands: March 1-3 and March 5-6.

## The trick

1. Number the days per user: 1, 2, 3, 4, 5.
2. Subtract that number of **days** from each date.

| day        | rn | day minus rn days |
| ---------- | -- | ----------------- |
| 2024-03-01 | 1  | 2024-02-29        |
| 2024-03-02 | 2  | 2024-02-29        |
| 2024-03-03 | 3  | 2024-02-29        |
| 2024-03-05 | 4  | 2024-03-01        |
| 2024-03-06 | 5  | 2024-03-01        |

Look at the last column. While days are consecutive, the date goes up by one and the counter goes up by one, so the difference **stays the same**. A gap makes the date jump ahead of the counter, and the difference changes. Rows in the same streak share a value.

## In SQL

```sql
WITH numbered AS (
  SELECT user, day,
         date(day, '-' ||
              ROW_NUMBER() OVER (PARTITION BY user ORDER BY day) ||
              ' days') AS grp
  FROM logins
)
SELECT user,
       MIN(day) AS start_day,
       MAX(day) AS end_day,
       COUNT(*) AS days
FROM numbered
GROUP BY user, grp
ORDER BY user, start_day;
```

Grouping by `grp` gives one row per streak.

## Building blocks

- `date(day, '-3 days')` subtracts days. Building the modifier with `||` lets the number come from `ROW_NUMBER()`.
- `PARTITION BY user` restarts the count for each user.
- If a day can appear more than once, use `SELECT DISTINCT` first, or the counter runs ahead of the dates.

## Uses

Login streaks, consecutive months of payments, machine uptime, runs of losing days, and any "in a row" question. To find only long streaks, add `HAVING COUNT(*) >= 3`. To find the **longest** streak per user, wrap it in another query and take `MAX(days)`.
