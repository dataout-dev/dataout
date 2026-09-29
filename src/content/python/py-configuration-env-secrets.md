The same codebase usually needs to behave differently in different places — a different database, a different log level, a different API key — without a single line of code changing between them. That is what configuration is for.

You will learn:

- the twelve-factor idea
- environment variables and .env files
- layered configuration
- never committing secrets
- validating settings at startup
- secret managers, briefly

## The twelve-factor idea

The ["twelve-factor app"](https://12factor.net) methodology's config principle, in one sentence: anything that varies between deploys (a database URL, a feature flag, an API key) belongs in the **environment**, not in the code. The same built artifact — the same Docker image, the same installed package — should run correctly in development, staging, and production purely by changing its environment, never by rebuilding it differently for each.

## Environment variables and .env files

```python
import os

debug = os.environ.get("DEBUG", "false").lower() == "true"
port = int(os.environ.get("PORT", "8000"))
print(debug, port)
```

Environment variables are always strings — note the explicit `int(...)` conversion and the `.lower() == "true"` comparison, since `os.environ.get("DEBUG")` never hands you a real `bool` directly. A `.env` file is a common local-development convenience: a plain `KEY=value` file loaded into the environment at startup (typically by a small library), so a developer does not have to `export` a dozen variables by hand every session.

## Layered configuration

```python
import os

DEFAULTS = {"timeout": 30, "retries": 3}

def get_config():
    config = dict(DEFAULTS)
    if "TIMEOUT" in os.environ:
        config["timeout"] = int(os.environ["TIMEOUT"])
    return config

print(get_config())
```

A real application typically layers several sources, each able to override the last: built-in defaults, then a config file, then environment variables, then (for a CLI) command-line flags. This lets a sensible default live in code while still letting any specific deploy override just the one setting it actually needs to.

## Never committing secrets

```text
# .gitignore
.env
*.pem
secrets.yaml
```

A secret committed to Git — even briefly, even in a private repository — is effectively permanent: it exists in history even after being "removed" in a later commit, and anyone with a clone from before that removal still has it. The only safe response to an accidentally committed secret is to treat it as compromised and rotate it, not merely to delete it from the latest commit.

## Validating settings at startup

```python
import os

def load_settings():
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise RuntimeError("API_KEY environment variable is required but was not set")
    return {"api_key": api_key}

os.environ["API_KEY"] = "demo-key-for-this-example"
print(load_settings())
```

Checking every required setting once, at startup, means a missing or malformed value fails immediately with a clear message — rather than surfacing as a confusing `NoneType has no attribute ...` deep inside a request handler, minutes or hours after the process actually started.

## Secret managers, briefly

For anything beyond a small side project, a dedicated secret manager (a cloud provider's built-in one, or a tool like Vault) is the usual upgrade path from environment variables: it adds access control (who can read which secret), rotation, and an audit log of who accessed what and when — none of which a plain environment variable or `.env` file gives you.

## Watch out: printing configuration in logs

```python
config = {"api_key": "sk-real-secret-value", "timeout": 30}

# BAD: this would leak the secret straight into log files
# print(f"Starting with config: {config}")

safe_config = {k: ("***" if "key" in k or "secret" in k else v) for k, v in config.items()}
print(f"Starting with config: {safe_config}")
```

Logging the full configuration dict "for debugging" is a common way secrets end up in log files — which are often stored, copied, and retained far longer (and read by more people) than anyone initially expects. Redacting anything that looks like a secret before logging is the safer default.

## Common mistakes

- Comparing an environment variable string directly against a Python `bool` instead of parsing it explicitly.
- Committing a `.env` file because it was not added to `.gitignore` in time.
- Discovering a missing required setting only when the code path that uses it finally runs, instead of at startup.
- Logging an entire configuration object without redacting anything that looks like a secret.
