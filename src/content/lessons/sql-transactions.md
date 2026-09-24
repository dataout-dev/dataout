## The problem: half-finished changes

Moving 500 from account A to account B takes **two** steps:

```sql
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';
UPDATE accounts SET balance = balance + 500 WHERE id = 'B';
```

What if the server crashes between them? A has lost 500 and B never got it. The money has vanished. You need the two steps to succeed or fail **together**.

## Transactions

A **transaction** groups statements into one all-or-nothing unit:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';
UPDATE accounts SET balance = balance + 500 WHERE id = 'B';
COMMIT;
```

- `BEGIN` starts the transaction.
- `COMMIT` makes every change permanent, at once.
- `ROLLBACK` undoes everything since `BEGIN`, as if it never happened.

If the crash happens before `COMMIT`, the database restores the old state when it restarts. Either both updates happened, or neither did.

## ACID in a nutshell

Databases promise four things about transactions:

| Letter | Meaning |
| ------ | ------- |
| **A**tomic | all or nothing |
| **C**onsistent | rules are never left broken |
| **I**solated | other users don't see half-finished work |
| **D**urable | once committed, it survives a crash |

## Constraints: rules the database enforces

Constraints stop bad data getting in at all:

```sql
CREATE TABLE accounts (
  id       TEXT PRIMARY KEY,           -- unique, not null
  owner    TEXT NOT NULL,              -- must have a value
  email    TEXT UNIQUE,                -- no two the same
  balance  INTEGER CHECK (balance >= 0), -- no negative balances
  branch_id INTEGER REFERENCES branches(id)  -- must exist in branches
);
```

| Constraint | Prevents |
| ---------- | -------- |
| `PRIMARY KEY` | duplicate or missing ids |
| `NOT NULL` | missing values |
| `UNIQUE` | duplicate values |
| `CHECK (...)` | values outside a rule |
| `FOREIGN KEY` | pointing at a row that doesn't exist |

A well-designed schema makes whole categories of data-quality problems impossible, which is far cheaper than finding them later (lesson 37).

## Keep in mind

- A failed statement inside a transaction usually means you should `ROLLBACK`.
- Keep transactions short. Long ones can block other users.
- Every single statement already runs in its own small transaction. You only need `BEGIN` for **groups** of statements.
