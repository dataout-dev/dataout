Most security incidents in application code are not exotic — they are a small number of well-known mistakes, repeated. Knowing this short list well is worth more than knowing every obscure attack technique.

You will learn:

- input validation
- SQL injection and parameter binding
- unsafe deserialisation
- path traversal
- dependency risks
- secrets in code, recapped
- safe use of subprocess and eval
- the OWASP top ten, as a checklist

## Input validation

```python
def parse_age(text):
    age = int(text)
    if not (0 <= age <= 150):
        raise ValueError(f"implausible age: {age}")
    return age

print(parse_age("34"))
```

Validating at the boundary — the moment external input enters your system — means every function past that point can trust the value's shape, instead of every single one needing its own defensive checks against garbage input.

## SQL injection and parameter binding

```python
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (name TEXT)")
conn.execute("INSERT INTO users VALUES (?)", ("Ann",))

name = "Ann"
# SAFE: the value is bound as data, never interpreted as SQL syntax
rows = conn.execute("SELECT * FROM users WHERE name = ?", (name,)).fetchall()
print(rows)

# UNSAFE (shown, not run): f"SELECT * FROM users WHERE name = '{name}'"
# if name were "'; DROP TABLE users; --", that string becomes part of the executed SQL itself
```

Parameter binding (`?` placeholders, or named placeholders depending on the driver) is not just a style preference — it is what makes the distinction between "this is data" and "this is code" structurally impossible to blur, no matter what the input contains.

## Unsafe deserialisation

```python
import json

# SAFE: json.loads only ever produces plain data (dicts, lists, strings, numbers) - never executes anything
data = json.loads('{"name": "Ann", "age": 34}')
print(data)

# pickle.loads(untrusted_bytes) is NOT shown here - unpickling can execute arbitrary
# code as a side effect of reconstructing certain objects, so it should never run on
# data from a source you do not fully trust
```

`json` has no mechanism to execute code as a result of parsing — it can only ever produce basic data structures. `pickle` can reconstruct arbitrary Python objects, including running their constructors, which is exactly the capability that makes it dangerous on untrusted input.

## Path traversal

```python
import os

def safe_path(base_dir, user_filename):
    full = os.path.normpath(os.path.join(base_dir, user_filename))
    if not full.startswith(os.path.normpath(base_dir) + os.sep):
        raise ValueError("path escapes the base directory")
    return full

print(safe_path("/data/uploads", "report.pdf"))
try:
    safe_path("/data/uploads", "../../etc/passwd")
except ValueError as e:
    print(f"blocked: {e}")
```

Simply joining paths with `os.path.join` does not stop `"../../etc/passwd"` from escaping the intended directory — an explicit check that the *resolved* path still starts with the intended base directory is what actually closes this off.

## Dependency risks

Every third-party package you install runs with the same privileges as your own code — a compromised or malicious dependency (or a dependency *of* a dependency) can do anything your application can. Pinning versions, reviewing what a new dependency actually does before adding it, and keeping dependencies patched for known vulnerabilities are the practical mitigations.

## Secrets in code, recapped

As covered earlier in this tier: a secret committed to version control has to be treated as compromised and rotated, even after being removed in a later commit, since it remains in history.

## Safe use of subprocess and eval

```python
import subprocess

# SAFE: a list of arguments, no shell involved, no injection surface
result = subprocess.run(["echo", "hello"], capture_output=True, text=True)
print(result.stdout.strip())

# UNSAFE (shown, not run): subprocess.run(user_input, shell=True)
# with shell=True, attacker-controlled text can inject extra shell commands via ; | `` etc.

# eval() and exec() should essentially never run on untrusted input - they execute
# arbitrary Python, which is an even more direct code-execution risk than SQL injection
```

Passing a list of arguments (not a single shell string) to `subprocess.run` avoids shell interpretation entirely — no metacharacters to worry about, because there is no shell parsing the command at all.

## The OWASP top ten, as a checklist

The [OWASP Top Ten](https://owasp.org/www-project-top-ten/) is a regularly updated list of the most common, most impactful web application security risks (injection, broken authentication, security misconfiguration, and others) — not exhaustive, but a genuinely useful checklist to run through when reviewing a new feature that touches user input, authentication, or data storage.

## Watch out: rolling your own crypto

```text
# don't do this: a custom "encryption" scheme is almost always weaker than it looks
def my_cipher(text, key):
    return "".join(chr(ord(c) ^ key) for c in text)
```

A hand-rolled cipher or hashing scheme can look completely fine in every test you think to write, while still being trivially breakable by someone who understands the specific weakness. Established, widely reviewed libraries (`hashlib`, `secrets`, a maintained cryptography library) have had vastly more expert scrutiny than any one-off implementation.

## Common mistakes

- Building SQL with string formatting instead of parameter binding, even "just this once."
- Calling `pickle.load` on data from an untrusted source.
- Joining a user-supplied filename into a path without verifying the result stays inside the intended directory.
- Using `shell=True` with untrusted input, or reaching for `eval`/`exec` on anything not fully controlled by you.
