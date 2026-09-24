## When you need the rows that don't match

An `INNER JOIN` keeps only rows that match on both sides. But some of the most useful questions are about what is **missing**: customers who never ordered, products nobody bought, students not enrolled in anything.

**students**

| id | name   |
| -- | ------ |
| 1  | Asha   |
| 2  | Ben    |
| 3  | Chitra |

**enrollments**

| student_id | course  |
| ---------- | ------- |
| 1          | Maths   |
| 1          | Physics |
| 3          | Art     |

## LEFT JOIN

`LEFT JOIN` keeps **every** row from the left table. When there is no match on the right, the right-hand columns come back as `NULL`:

```sql
SELECT s.name, e.course
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id;
```

| name   | course  |
| ------ | ------- |
| Asha   | Maths   |
| Asha   | Physics |
| Ben    | *NULL*  |
| Chitra | Art     |

Ben is there, with a `NULL` course.

## The anti-join pattern

To find only the unmatched rows, keep those where the right side is `NULL`:

```sql
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
WHERE e.student_id IS NULL;      -- Ben
```

Test a column that can **never** be `NULL` in a real match, such as the join key.

## The quiet mistake

Filtering the right table in `WHERE` turns a left join back into an inner join:

```sql
WHERE e.course = 'Art'     -- Ben's course is NULL, so he is dropped again
```

To filter the right table **without** losing unmatched rows, put the condition in the `ON` clause instead.

## Keep in mind

- "Left" means the table written **before** `LEFT JOIN`.
- Order matters. `students LEFT JOIN enrollments` and `enrollments LEFT JOIN students` answer different questions.
- Another way to write an anti-join is `NOT EXISTS`, which you'll meet in the Advanced tier.
