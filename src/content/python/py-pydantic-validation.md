Type hints describe what code *expects*, but they are erased at runtime — nothing stops a caller from actually passing a string where an `int` was promised. `pydantic` closes that gap: it turns a class with type-hinted fields into something that actually validates and coerces real data as it arrives, typically at the boundary of a system (a web request body, a config file, a CSV row).

`pydantic` runs in this playground, so every example below is real, runnable code.

You will learn:

- defining a model and what validation gives you
- type coercion
- custom validators
- parsing JSON into a model
- a settings-management pattern
- reading pydantic's error messages
- dataclass versus pydantic

## Models and validation

```python
from pydantic import BaseModel, ValidationError

class Track(BaseModel):
    name: str
    milliseconds: int
    unit_price: float

t = Track(name="Test", milliseconds=200000, unit_price=0.99)
print(t)

try:
    Track(name="Test", milliseconds="not a number", unit_price=0.99)
except ValidationError as e:
    print(f"{len(e.errors())} error(s) found")
```

Building a `Track` with genuinely bad data raises `ValidationError` immediately, at the point data enters the system — instead of a `TypeError` surfacing much later, deep inside some unrelated function that assumed `milliseconds` was already a real number.

## Type coercion

```python
from pydantic import BaseModel

class Order(BaseModel):
    quantity: int
    price: float

o = Order(quantity="3", price="9.99")
print(o.quantity, type(o.quantity))
print(o.price, type(o.price))
```

A numeric-looking string is converted to the declared type automatically — exactly the kind of "technically the right value, wrong Python type" problem that arrives constantly from JSON, form data, or a CSV, where everything starts life as a string.

## Custom validators

```python
from pydantic import BaseModel, field_validator

class Signup(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def must_have_at_sign(cls, value):
        if "@" not in value:
            raise ValueError("not a valid email address")
        return value

print(Signup(email="a@example.com"))
```

A `field_validator` runs your own logic after the basic type check passes, for rules a plain type annotation cannot express — "contains an @", "is in the future", "is one of these three codes".

## Parsing JSON

```python
from pydantic import BaseModel

class Config(BaseModel):
    debug: bool
    retries: int

raw = '{"debug": true, "retries": 3}'
cfg = Config.model_validate_json(raw)
print(cfg.debug, cfg.retries)
```

`model_validate_json` parses and validates in one step — JSON in, a fully validated (and type-correct) object out, or a `ValidationError` naming exactly what was wrong with the payload.

## A settings-management pattern

```python
from pydantic import BaseModel

class Settings(BaseModel):
    debug: bool = False
    max_connections: int = 10

settings = Settings()
print(settings.debug, settings.max_connections)

overridden = Settings(debug=True, max_connections=50)
print(overridden.debug, overridden.max_connections)
```

A `BaseModel` with defaults doubles as a validated settings object: load values from environment variables or a config file into it once at startup, and every field is guaranteed to have the right type from that point on, with no `.get("KEY", default)` scattered through the codebase.

## Error messages

```python
from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    customer_id: int
    total: float

try:
    Invoice(customer_id="abc", total=-1)
except ValidationError as e:
    for err in e.errors():
        print(err["loc"], err["msg"])
```

Each error names the exact field (`loc`) and what went wrong (`msg`) — enough detail to show a user precisely which input to fix, rather than a single generic "invalid data" message.

## dataclass versus pydantic

A standard-library `@dataclass` is a plain, fast container with type hints for documentation — it does **not** check or coerce anything at runtime; `Track(name=123)` succeeds silently even though `123` is not a `str`. `pydantic`'s `BaseModel` looks similar but actively validates on construction. Reach for `dataclass` for internal, already-trusted data; reach for `pydantic` at a boundary where the data might not be trustworthy yet.

## Watch out: validating twice

```python
from pydantic import BaseModel

class Track(BaseModel):
    name: str
    milliseconds: int

def process(track: Track):
    # track is ALREADY a validated Track here - re-wrapping it is redundant
    track = Track(**track.model_dump())
    return track.name
```

Once a value is a validated `Track`, wrapping it in `Track(...)` again inside every function that receives it is pure overhead — validate once, at the boundary where untrusted data enters, and pass the already-validated object everywhere after that.

## Common mistakes

- Re-validating an already-validated model deep inside the codebase instead of once at the boundary.
- Using a plain `dataclass` for data that genuinely needs runtime checking, only to discover bad data much later.
- Ignoring `ValidationError`'s structured `.errors()` and just showing a generic failure message to the user.
- Forgetting that coercion is often lossy or surprising for edge cases (e.g. `"3.9"` coercing to `int` fails, since it is not a whole number) — check what actually happens at the type boundaries that matter.
