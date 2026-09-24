## Duplicates in real data

Real tables collect duplicates: a customer who signed up twice, a contact imported from two files. They rarely match exactly. One row has `ASHA@EXAMPLE.COM`, another `asha@example.com` with a trailing space. To find them you must first **normalise**.

| id | name     | email            |
| -- | -------- | ---------------- |
| 1  | Asha     | ASHA@EXAMPLE.COM |
| 2  | Asha R   | asha@example.com |
| 3  | Bilal    | bilal@example.com |
| 4  | Chitra   | *NULL*           |
| 5  | Chitra R | *NULL*           |

## Step 1: normalise

Make the values that should be equal actually equal:

```sql
LOWER(TRIM(email))
```

`TRIM` removes stray spaces, `LOWER` removes the case difference.

## Step 2: group and count

```sql
SELECT LOWER(email) AS email,
       MIN(id)      AS keep_id,
       COUNT(*)     AS copies
FROM contacts
WHERE email IS NOT NULL
GROUP BY LOWER(email)
HAVING COUNT(*) > 1
ORDER BY keep_id;
```

| email             | keep_id | copies |
| ----------------- | ------- | ------ |
| asha@example.com  | 1       | 2      |

- `HAVING COUNT(*) > 1` keeps only the values that repeat.
- `MIN(id)` picks one row to **keep** (the oldest). The others are the extras.

## Missing values are not duplicates

Chitra's two rows have `NULL` emails. `NULL` means unknown, so two unknowns aren't evidence of the same person. That is why the query filters `WHERE email IS NOT NULL`. Without it, the two `NULL`s would be grouped together and reported as duplicates.

## Look before you delete

Once you can list duplicates, you can remove the extras:

```sql
DELETE FROM contacts
WHERE id NOT IN (SELECT MIN(id) FROM contacts GROUP BY LOWER(email));
```

But run the `SELECT` first and read the rows. A matching email is a strong lead, not proof: two people can share an address, and a name match alone is weaker still.

## Keep in mind

- Decide what "the same" means before you write the query: same email? same name and phone?
- Keep a record of what you delete, or work on a copy.
