A `print` statement is fine for a script you run once and watch. A real, long-running application needs something that survives after the terminal closes, can be filtered and searched, and does not accidentally leak sensitive data — that is what proper logging and observability are for.

You will learn:

- structured logging
- correlation ids
- log levels, used deliberately
- metrics and tracing, at a glance
- handling sensitive data in logs
- testing logs

## Structured logging

```python
import logging
import json

class JsonFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({"level": record.levelname, "message": record.getMessage()})

logger = logging.getLogger("myapp")
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)

logger.info("user logged in")
```

A structured log record (a dict, usually serialised as JSON) is directly queryable by a log aggregation system — "show me every record where `level = ERROR` and `user = ann"` — in a way a free-form text message like `"user ann logged in"` is not, without fragile text parsing.

## Correlation ids

```python
import uuid

def handle_request():
    correlation_id = str(uuid.uuid4())
    print(f"[{correlation_id}] request started")
    print(f"[{correlation_id}] request finished")

handle_request()
```

A correlation id generated once per request (or per job) and included in every log line produced while handling it is what lets you reconstruct the full story of *that one request* out of a firehose of interleaved log lines from many concurrent requests.

## Log levels, in practice

```python
import logging

logger = logging.getLogger("myapp")
logger.setLevel(logging.INFO)

logger.debug("very detailed, usually off in production")
logger.info("normal operational event")
logger.warning("something unexpected, but recovered")
logger.error("an operation failed")
logger.critical("the application itself may be about to fail")
```

Using every level as roughly this hierarchy suggests — `DEBUG` for detail you only want while actively investigating something, `INFO` for normal events worth a permanent record, `WARNING` and above for things a human should actually notice — is what keeps a production log searchable instead of an undifferentiated wall of text.

## Metrics and tracing, at a glance

Logs answer "what happened, in detail, for this one event." **Metrics** (a request count, a latency histogram) answer "how is the system doing, in aggregate, over time" — cheap to store at high volume precisely because they discard the individual-event detail. **Tracing** sits between the two: following one request's path through multiple services, showing where time was actually spent across each hop.

## Handling sensitive data

```python
def safe_log_user(user):
    return {"id": user["id"], "email_domain": user["email"].split("@")[-1]}

user = {"id": 42, "email": "ann@example.com"}
print(safe_log_user(user))
```

Logging a full email address, a password, or a credit card number "just in case it's useful for debugging" turns your log storage into a second, less-protected copy of sensitive data. Logging only what is actually needed (an id, a domain, a masked value) gets most of the debugging value with far less exposure.

## Testing logs

```python
import logging

def risky_operation(should_fail):
    logger = logging.getLogger("myapp")
    if should_fail:
        logger.error("operation failed")
        return False
    logger.info("operation succeeded")
    return True

def test_logs_error_on_failure(caplog=None):
    result = risky_operation(should_fail=True)
    assert result is False

test_logs_error_on_failure()
print("log-adjacent test passed")
```

pytest's built-in `caplog` fixture captures log records emitted during a test, letting you assert not just on a function's return value but on what it actually logged — useful when the logging itself (an audit trail, an alert-worthy error) is part of the behaviour being tested.

## Watch out: logging inside tight loops

```python
import logging

logger = logging.getLogger("myapp")
items = list(range(1000))

# BAD: one log line per item can dominate runtime and flood log storage
# for item in items:
#     logger.info(f"processing {item}")

logger.info(f"processing {len(items)} items")
```

Logging once per iteration of a hot loop can noticeably slow the loop down and flood log storage with near-identical lines — a summary before and after (or a periodic progress log, every N items) usually carries the same practical value at a fraction of the volume.

## Common mistakes

- Using free-form text messages where a structured record would let the same information actually be queried later.
- Logging sensitive data "just in case," turning logs into an unprotected copy of it.
- Setting everything to `INFO` (or worse, everything to the same level as `print`), making a genuinely alarming event indistinguishable from routine operation.
- Logging inside a hot loop instead of summarising before and after it.
