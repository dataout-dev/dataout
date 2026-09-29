Most Python services eventually expose an HTTP API. FastAPI is the most popular modern choice for building one, precisely because it leans so heavily on the type hints you already know how to write.

This is a reading lesson: an actual HTTP server needs a real network socket and a real client making requests, which this browser-based playground cannot provide. The examples below show real FastAPI code and its recorded request/response behaviour; the ideas transfer directly the first time you run a real server.

You will learn:

- HTTP methods and status codes
- REST design, briefly
- routing and validation with pydantic
- dependency injection
- async endpoints
- OpenAPI docs
- authentication, at a glance

## HTTP methods and status codes

```text
GET    /tracks/42        -> 200 OK (found) or 404 Not Found
POST   /tracks           -> 201 Created (new resource made)
PUT    /tracks/42        -> 200 OK (replaced) - idempotent
PATCH  /tracks/42        -> 200 OK (partially updated)
DELETE /tracks/42        -> 204 No Content (deleted)
```

`GET` and `HEAD` are meant to be safe (no side effects); `PUT` and `DELETE` are meant to be idempotent (doing them twice has the same effect as once); `POST` typically is not idempotent (posting the same "create a new order" request twice usually creates two orders). Status codes communicate the outcome in a way a client can act on without parsing the response body: `2xx` success, `4xx` a problem with the request, `5xx` a problem on the server.

## REST design, briefly

```text
GET    /customers/7/invoices       -> a customer's invoices
POST   /customers/7/invoices       -> create a new invoice for that customer
GET    /customers/7/invoices/103   -> one specific invoice
```

A REST API models resources as URLs and uses HTTP methods to describe the action on them, rather than encoding the verb into the URL itself (`/getCustomerInvoices?id=7` is the style REST design specifically moves away from).

## Routing and validation with pydantic

```python
from pydantic import BaseModel

class TrackIn(BaseModel):
    name: str
    milliseconds: int
    unit_price: float

# a FastAPI route (illustrative - no server actually runs here):
#
# @app.post("/tracks")
# def create_track(track: TrackIn):
#     return {"id": 1, **track.model_dump()}

payload = {"name": "Test", "milliseconds": 200000, "unit_price": 0.99}
validated = TrackIn(**payload)
print(validated)
```

Declaring the request body's shape as a pydantic model (`TrackIn`) is enough for FastAPI to validate every incoming request against it automatically — malformed JSON, a missing field, or the wrong type is rejected with a `422` response before your route function's body ever runs.

## Dependency injection

```text
def get_db_session():
    session = Session()
    try:
        yield session
    finally:
        session.close()

@app.get("/tracks")
def list_tracks(session = Depends(get_db_session)):
    return session.query(Track).all()
```

`Depends(get_db_session)` tells FastAPI: before calling `list_tracks`, run `get_db_session` and pass its result in. The setup/teardown logic (opening and closing a session) lives in exactly one place, reused by every route that needs a session, instead of being duplicated in each one.

## Async endpoints

```text
@app.get("/tracks/{track_id}")
async def get_track(track_id: int):
    track = await fetch_track_from_db(track_id)
    return track
```

A route function can be `async def`, letting it `await` I/O (a database query, a call to another service) without blocking the whole server from handling other requests in the meantime — the same asyncio concurrency model from earlier in this tier, applied to serving HTTP requests.

## OpenAPI docs

Because routes are declared with real type hints and pydantic models, FastAPI generates an interactive documentation page (conventionally at `/docs`) automatically — every endpoint, its expected request body, and its possible responses, derived from the same code that actually validates and serves requests, so the docs cannot silently drift out of sync with the real API.

## Authentication, at a glance

```text
@app.get("/me")
def read_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_token(token)
    return user
```

Authentication is usually wired in as just another dependency — `Depends(oauth2_scheme)` extracts and validates a token before the route body runs, and any route that adds this dependency automatically requires authentication, with no per-route boilerplate beyond declaring it.

## Watch out: returning too much

```python
from pydantic import BaseModel

class Customer(BaseModel):
    id: int
    name: str
    password_hash: str   # exists in the database model, but should NEVER be sent to a client

class CustomerOut(BaseModel):
    id: int
    name: str

def to_public(customer: Customer) -> CustomerOut:
    return CustomerOut(id=customer.id, name=customer.name)

internal = Customer(id=1, name="Ann", password_hash="hashed-value")
print(to_public(internal))
```

A separate "output" model (excluding fields like a password hash) is worth the small amount of extra code — returning your internal database model directly risks accidentally serialising a field that should never leave the server.

## Common mistakes

- Encoding an action into the URL (`/getUser`) instead of using the HTTP method to express it.
- Returning `200 OK` for something that actually failed, instead of the appropriate `4xx`/`5xx` status.
- Skipping a request-body model and validating fields manually, losing automatic validation and documentation.
- Returning an internal database model directly instead of a deliberately smaller "output" shape.
