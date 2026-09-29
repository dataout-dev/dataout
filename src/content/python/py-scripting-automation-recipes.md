A huge fraction of real-world Python is small, practical scripts — renaming files, calling an API, turning a folder of exports into one report. The patterns here make the difference between a script you can run once and one you can trust to run unattended, repeatedly.

You will learn:

- batch file organisation with pathlib
- a scheduled-task concept
- talking to APIs and CSVs together
- retries with backoff
- idempotent scripts
- emailing reports, at a glance

## Batch organisation with pathlib

```python
from pathlib import Path

names = ["report.pdf", "photo.JPG", "notes.txt", "archive.tar.gz", "README"]

def extension_of(name):
    p = Path(name)
    return p.suffix.lstrip(".").lower() or "other"

for name in names:
    print(name, "->", extension_of(name))
```

`pathlib.Path` treats a file path as a real object with useful properties (`.suffix`, `.stem`, `.parent`) instead of manipulating path strings by hand with `os.path` — noticeably more readable once a script does more than one path operation.

## A scheduled-task concept

```text
# crontab entry (conceptual):
0 2 * * *  /usr/bin/python3 /opt/scripts/nightly_report.py
```

A script meant to run unattended, on a schedule (via cron, a cloud scheduler, or similar), has to handle things differently than one run by hand: no one is watching to notice a silent failure, so logging, alerting on failure, and idempotency (covered below) all matter more.

## Talking to APIs and CSVs together

```python
import csv
import io

# simulating a fetched API response, since no real network call happens here
api_rows = [{"id": 1, "total": 9.99}, {"id": 2, "total": 4.5}]

buffer = io.StringIO()
writer = csv.DictWriter(buffer, fieldnames=["id", "total"])
writer.writeheader()
writer.writerows(api_rows)
print(buffer.getvalue())
```

A common automation shape: pull structured data from an API, write it out as CSV for something else (a spreadsheet, another system) to consume — `csv.DictWriter` handles the header row and quoting correctly, which is easy to get subtly wrong writing CSV by hand with string joins.

## Retries with backoff

```python
import time

def call_with_retries(fn, attempts=3, base_delay=0):
    last_error = None
    for attempt in range(attempts):
        try:
            return fn()
        except ConnectionError as e:
            last_error = e
            time.sleep(base_delay * (2 ** attempt))
    raise last_error

calls = [0]
def flaky():
    calls[0] += 1
    if calls[0] < 3:
        raise ConnectionError("temporary failure")
    return "success"

print(call_with_retries(flaky, attempts=5, base_delay=0))
print(f"took {calls[0]} attempts")
```

Exponential backoff (doubling the delay each retry) avoids hammering a struggling service with immediate retries — giving it a growing window to recover before the next attempt, rather than adding to the load that may have caused the failure in the first place.

## Idempotent scripts

```python
def upsert_record(store, key, value):
    store[key] = value   # setting a key is idempotent - running this twice with the same
                          # arguments leaves the store in the same state either time
    return store

store = {}
upsert_record(store, "a", 1)
upsert_record(store, "a", 1)
print(store)
```

A script safe to re-run — because it *sets* state rather than *appending* to it, or because it checks "has this already happened?" before acting — can be safely retried after a partial failure, restarted after a crash, or run twice by accident, none of which should be true of a script that blindly appends or increments every time it runs.

## Emailing reports, at a glance

```text
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Nightly report"
msg["From"] = "reports@example.com"
msg["To"] = "team@example.com"
msg.set_content("Everything ran successfully.")

# with smtplib.SMTP("smtp.example.com") as server:
#     server.send_message(msg)
```

The standard library's `email`/`smtplib` modules can send a real report email directly — useful for a scheduled script's summary, though most real deployments route through a dedicated email-sending service rather than a raw SMTP connection, for deliverability and monitoring reasons.

## Watch out: scripts that cannot be safely re-run

```python
ledger = []

def append_only_charge(amount):
    ledger.append(amount)   # NOT idempotent - running this twice records the charge twice
    return ledger

append_only_charge(9.99)
print(ledger)
```

If `append_only_charge` were re-run after a script crash partway through (with no way to tell whether the first run's charge actually went through), the customer could be charged twice. A safer version would check a unique transaction id against what has already been recorded before appending anything new.

## Common mistakes

- Manipulating file paths as raw strings instead of using `pathlib.Path`.
- Retrying immediately, with no backoff, against a service that is already struggling.
- Writing a script that appends or increments every time it runs, with no way to safely retry after a partial failure.
- Assuming an unattended scheduled script will be noticed if it silently fails, with no logging or alerting in place.
