The dependency inversion principle told you to "depend on abstractions, not on concrete details." This lesson turns that into two concrete, everyday techniques: the **repository pattern**, which separates storage from logic, and **dependency injection**, which passes dependencies in rather than constructing them internally — both aimed squarely at making code easier to test and to change.

You will learn:

- separating storage from business logic
- the repository pattern, with an in-memory and a database-backed version
- dependency injection: passing collaborators in, explicitly
- testing with a fake repository, instead of a real database
- avoiding leaked storage details

## The problem: logic tangled with storage

```python
import sqlite3

class UserService:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)

    def register(self, name, email):
        if "@" not in email:
            raise ValueError("invalid email")
        self.conn.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
        self.conn.commit()
```

Testing `register`'s validation logic (the `"@"` check) now **requires** a real SQLite database, on disk, every single time. The business rule and the storage mechanism are tangled together.

## The repository pattern

A **repository** is an object whose whole job is storing and retrieving a kind of data, hiding **how** — a database, a file, memory — behind a small, focused interface:

```python
class InMemoryRepo:
    def __init__(self):
        self._items = {}
        self._next_id = 1

    def add(self, item):
        item_id = self._next_id
        self._items[item_id] = item
        self._next_id += 1
        return item_id

    def get(self, item_id):
        return self._items[item_id]

    def all(self):
        return list(self._items.values())

repo = InMemoryRepo()
uid = repo.add({"name": "Ada", "email": "ada@example.org"})
print(repo.get(uid))
print(repo.all())
```

A **second** implementation, backed by SQLite, can offer the **exact same interface**:

```python
import sqlite3

class SqliteRepo:
    def __init__(self, conn):
        self.conn = conn
        self.conn.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)")

    def add(self, item):
        cursor = self.conn.execute("INSERT INTO users (name, email) VALUES (?, ?)", (item["name"], item["email"]))
        self.conn.commit()
        return cursor.lastrowid

    def get(self, item_id):
        row = self.conn.execute("SELECT name, email FROM users WHERE id = ?", (item_id,)).fetchone()
        return {"name": row[0], "email": row[1]}

conn = sqlite3.connect(":memory:")
repo = SqliteRepo(conn)
uid = repo.add({"name": "Ada", "email": "ada@example.org"})
print(repo.get(uid))
```

Both repositories share the interface `add`, `get`, `all` — any code written against **that** interface works with either one, unchanged.

## Dependency injection: pass it in

**Dependency injection** simply means: a class receives its collaborators as **constructor arguments**, instead of creating them internally. `UserService` now depends on **any** repository, not specifically on SQLite:

```python
class UserService:
    def __init__(self, repo):
        self.repo = repo

    def register(self, name, email):
        if "@" not in email:
            raise ValueError("invalid email")
        return self.repo.add({"name": name, "email": email})

service = UserService(InMemoryRepo())
uid = service.register("Ada", "ada@example.org")
print(service.repo.get(uid))
```

This is the dependency inversion principle from two lessons ago, applied concretely: `UserService` depends on "something with an `add` method", and the **caller** decides which concrete repository to actually supply.

## Testing with a fake

Because `UserService` accepts any repository, testing its validation logic needs no database at all:

```python
def test_rejects_invalid_email():
    service = UserService(InMemoryRepo())
    try:
        service.register("Ada", "not-an-email")
        assert False, "should have raised"
    except ValueError:
        pass

def test_registers_a_valid_user():
    service = UserService(InMemoryRepo())
    uid = service.register("Ada", "ada@example.org")
    assert service.repo.get(uid)["name"] == "Ada"

test_rejects_invalid_email()
test_registers_a_valid_user()
print("all tests passed")
```

Both tests run instantly, need no setup or teardown of a real database, and cannot leave stray files behind — exactly the testing benefits the mocking lesson, earlier in this tier, described, now achieved through the class's own design rather than a mocking library.

## Avoiding leaked storage details

A well-designed repository's interface should describe **what** you can do (`add`, `get`, `find_by_email`), never **how** the current implementation happens to do it. A method like `run_raw_sql(query)` on a repository breaks the abstraction immediately — it forces every caller, and every alternative implementation, to know they are talking to a SQL database specifically:

```python
class UserRepo:
    def find_by_email(self, email):
        raise NotImplementedError

class SqliteUserRepo(UserRepo):
    def __init__(self, conn):
        self.conn = conn

    def find_by_email(self, email):
        row = self.conn.execute("SELECT name FROM users WHERE email = ?", (email,)).fetchone()
        return {"name": row[0]} if row else None
```

`find_by_email` describes an **intention**. Any future `InMemoryUserRepo`, or a `RestApiUserRepo` calling some remote service, could implement the exact same method, and every caller would keep working unchanged.

## Common mistakes

- Letting a service class construct its own database connection internally, making it impossible to test without a real database.
- A repository interface that leaks its implementation (raw SQL, a specific file format) into its public methods.
- Injecting a dependency but still reaching around it to the real thing "just this once".

## Recap

- A repository hides storage behind a small, focused interface; several implementations can share it.
- Dependency injection passes collaborators in through the constructor, rather than creating them internally.
- Testing against a fake (in-memory) implementation needs no real infrastructure, and is fast and reliable.

## Your turn

In the **Practice** tab you implement `InMemoryRepo` and a service that works with any repo exposing `get`/`add`. Then three challenges use real data.
