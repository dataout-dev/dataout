Writing raw SQL (as an earlier tier did) works, but an ORM (Object-Relational Mapper) lets you work with rows as ordinary Python objects — with real relationships you can navigate as attributes — while SQLAlchemy still generates the actual SQL underneath.

You will learn:

- the declarative ORM model
- sessions and transactions
- relationships
- queries with select()
- the N+1 query problem
- testing with an in-memory sqlite database

## The declarative ORM model

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Track(Base):
    __tablename__ = "tracks"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    unit_price: Mapped[float]

print(Track.__tablename__, Track.name)
```

Each class maps to a table; each `Mapped[...]`-annotated attribute maps to a column, with its Python type driving the underlying SQL type. `Track.name` outside of an instance is a special descriptor SQLAlchemy uses to build queries — not a plain string — which is exactly what makes `select(Track.name)` below work.

## Sessions and transactions

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

class Base(DeclarativeBase):
    pass

class Track(Base):
    __tablename__ = "tracks"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)

with Session(engine) as session:
    session.add(Track(name="Test Track"))
    session.commit()
    count = session.query(Track).count()

print(count)
```

A `Session` tracks pending changes and groups them into a transaction — nothing is actually written until `session.commit()`, which is what lets several related changes succeed or fail together as one atomic unit.

## Relationships

```python
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Artist(Base):
    __tablename__ = "artists"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    albums: Mapped[list["Album"]] = relationship(back_populates="artist")

class Album(Base):
    __tablename__ = "albums"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"))
    artist: Mapped["Artist"] = relationship(back_populates="albums")

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)

with Session(engine) as session:
    session.add(Artist(name="Test Artist", albums=[Album(title="First"), Album(title="Second")]))
    session.commit()
    artist = session.query(Artist).first()
    print(artist.name, [a.title for a in artist.albums])
```

`relationship()` lets you navigate `artist.albums` as a real Python list of `Album` objects — SQLAlchemy issues the join (or a follow-up query) behind the scenes, so the relationship reads like plain attribute access even though a real query is happening.

## Queries with select()

```python
from sqlalchemy import create_engine, select, func, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Artist(Base):
    __tablename__ = "artists"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    albums: Mapped[list["Album"]] = relationship(back_populates="artist")

class Album(Base):
    __tablename__ = "albums"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"))
    artist: Mapped["Artist"] = relationship(back_populates="albums")

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)

with Session(engine) as session:
    session.add(Artist(name="A", albums=[Album(title="1"), Album(title="2")]))
    session.add(Artist(name="B", albums=[Album(title="3")]))
    session.commit()

    rows = session.execute(
        select(Artist.name, func.count(Album.id)).join(Album).group_by(Artist.name)
    ).all()
    print(rows)
```

The modern `select()` style builds a query as an explicit, composable object — `.join(...)`, `.where(...)`, `.group_by(...)` — executed via `session.execute(...)`, which is the recommended style in SQLAlchemy 2.0 over the older `session.query(...)` shorthand, though both still work.

## The N+1 query problem

```text
artists = session.query(Artist).all()
for artist in artists:
    print(artist.name, len(artist.albums))   # each .albums access can trigger its OWN query
```

Accessing `artist.albums` inside a loop, once per artist, can silently issue one query per artist (N queries) on top of the original query that fetched the artists (1) — "N+1 queries" for what could have been a single query with an explicit join. `selectinload`/`joinedload` (SQLAlchemy's eager-loading options) fetch related rows upfront in one or two queries instead of triggering one per row.

## Migrations with Alembic (reading)

Changing a model's columns after real data already exists needs a **migration** — a versioned, scripted change to the actual database schema. Alembic is SQLAlchemy's standard migration tool: it can auto-generate a migration script from the difference between your models and the current database schema, though generated migrations should always be reviewed before running them against real data.

## Testing with sqlite in memory

Every example on this page uses `create_engine("sqlite://")` — an entirely in-memory SQLite database, created fresh and gone the instant the connection closes. This is the standard way to test ORM code without needing a real, persistent database running anywhere, and is exactly what the practice test and challenges on this page do too.

## Watch out: lazy loading in loops

The N+1 example above is the single most common SQLAlchemy performance mistake in real applications — it works correctly, produces the right data, and is often only *noticed* once a table has thousands of rows and a page that used to load instantly starts taking seconds, purely from the accumulated round-trips.

## Common mistakes

- Forgetting `session.commit()` and being confused when data "disappears" (nothing was actually persisted).
- Triggering an N+1 query pattern by accessing a relationship inside a loop without eager loading.
- Using `session.query(...)` and `select(...)` inconsistently within one codebase instead of settling on the modern `select()` style.
- Editing a database's schema directly instead of going through a migration, losing a clear, versioned history of how the schema evolved.
