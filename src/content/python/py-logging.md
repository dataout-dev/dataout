`print` is fine for a quick experiment. For real programs, you need something better: messages that have a **level** of importance, that can go to a screen or a file, that show the time and the place, and that you can switch on and off without editing the code. That is what the standard `logging` module does.

You will learn:

- why logging beats printing
- the five levels
- loggers, handlers and formatters
- how to configure the output
- `dictConfig` for larger programs
- logging exceptions with tracebacks
- what to keep out of your logs

## Why not just print?

Compare:

```python
import logging

logging.warning("disk space is low: %s%%", 93)
```

The message has a **level** (WARNING), can be filtered, formatted, sent to a file, and switched off. A print statement can do none of that without changes to your code.

## The five levels

| Level | Value | Use it for |
| ----- | ----- | ---------- |
| `DEBUG` | 10 | detailed information, useful when investigating |
| `INFO` | 20 | confirmation that things work as expected |
| `WARNING` | 30 | something unexpected, but the program continues |
| `ERROR` | 40 | a function could not do its job |
| `CRITICAL` | 50 | the program may not be able to continue |

A logger has a **threshold**. Messages below it are dropped. The default threshold of the root logger is `WARNING`, so `debug` and `info` messages disappear unless you lower it.

## Loggers, handlers and formatters

Three objects work together:

- A **logger** is what your code calls (`logger.info(...)`). Loggers have names, and they are organised in a tree.
- A **handler** decides **where** the records go: the screen, a file, the network.
- A **formatter** decides **how** the record looks.

```python
import io
import logging

stream = io.StringIO()

logger = logging.getLogger("shop")
logger.setLevel(logging.DEBUG)
logger.propagate = False

handler = logging.StreamHandler(stream)
handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
logger.addHandler(handler)

logger.debug("cart opened")
logger.info("added %s items", 3)
logger.warning("stock is low")

print(stream.getvalue())
```

We send the output to a `StringIO` here, so that we can look at it. In a real program, you would use `StreamHandler()` for the screen or `FileHandler("app.log")` for a file. The formatter uses fields such as `%(levelname)s`, `%(name)s`, `%(message)s`, `%(asctime)s` and `%(lineno)d`.

## Use lazy formatting

Pass the values as **arguments**, and not through an f-string:

```python
logger.info("user %s bought %d items", "ada", 3)
```

If `INFO` is switched off, the text is never built, which saves time. It also keeps the message template constant, which helps tools that group log messages.

## Names and the logger tree

`logging.getLogger("a.b")` is a **child** of `"a"`. A child passes its records up to its parent's handlers (this is called **propagation**). That lets you configure one handler at the top, and every module can create its own logger with the conventional name:

```python
import logging

log = logging.getLogger(__name__)
print(log.name)
print(logging.getLogger("shop.cart").parent.name)
```

The convention is one logger per module: `logger = logging.getLogger(__name__)`.

## basicConfig

For a small script, `logging.basicConfig` sets up the root logger in one call:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    force=True,
)
logging.info("program started")
```

It configures things only the first time, unless you pass `force=True`. Libraries must never call `basicConfig`. That is for the application.

## Log the traceback

Inside an `except` block, `logger.exception(...)` logs at the `ERROR` level and adds the **traceback**. You can get the same with `exc_info=True` at any level:

```python
import io
import logging

stream = io.StringIO()
logger = logging.getLogger("parser")
logger.handlers.clear()
logger.propagate = False
logger.addHandler(logging.StreamHandler(stream))

try:
    int("abc")
except ValueError:
    logger.exception("could not parse the value")

lines = stream.getvalue().splitlines()
print(lines[0])
print(lines[-1])
```

## dictConfig

For larger applications, you describe the whole setup in a dictionary, with `logging.config.dictConfig`:

```python
import io
import logging
import logging.config

stream = io.StringIO()

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"plain": {"format": "%(levelname)s:%(name)s:%(message)s"}},
    "handlers": {"capture": {"class": "logging.StreamHandler", "formatter": "plain", "stream": stream}},
    "loggers": {"app": {"handlers": ["capture"], "level": "INFO", "propagate": False}},
})

logging.getLogger("app").info("configured")
logging.getLogger("app.db").debug("hidden")
logging.getLogger("app.db").warning("slow query")
print(stream.getvalue())
```

The same dictionary can come from a JSON or YAML file, so operators can change logging without touching the code.

## Handlers can be filtered too

Each handler has its own level, so one logger can send everything to a file and only errors to the screen. That is a common set-up in production.

```python
import logging

logger = logging.getLogger("audit")
logger.handlers.clear()
logger.propagate = False
logger.setLevel(logging.DEBUG)

screen = logging.StreamHandler()
screen.setLevel(logging.ERROR)
logger.addHandler(screen)
print(logger.handlers[0].level == logging.ERROR)
```

## Never log secrets

Logs are stored, copied and read by many people. Do not write **passwords, tokens, credit card numbers or personal data** into them. If you must show an identifier, show only the last few characters.

## Common mistakes

- Calling `basicConfig` inside a library.
- Using f-strings in log calls instead of `%s` arguments.
- Adding a handler each time a function runs, which makes every line appear more than once.
- Logging secrets, or logging so much that nobody can find anything.
- Expecting `logging.info` to show anything, without lowering the level.

## Recap

- Use the levels: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
- A logger creates records, handlers send them somewhere, and formatters lay them out.
- Use `getLogger(__name__)`, lazy `%s` arguments, and `logger.exception` in `except` blocks.
- Configure once, at the application level: `basicConfig` or `dictConfig`.

## Your turn

In the **Practice** tab you write `log_lines(records)`, which logs through a configured logger and returns the lines. Then three challenges use the Chinook store.
