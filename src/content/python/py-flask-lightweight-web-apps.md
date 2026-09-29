Flask predates FastAPI by many years and takes a different philosophy: a small, unopinionated core, with everything else added as an optional extension. It is still an excellent choice for a small service or a server-rendered website.

This is a reading lesson: running a real Flask server needs a real network socket, which this browser-based playground does not have. The ideas transfer directly the first time you run a real Flask app.

You will learn:

- routes and templates
- forms
- sessions
- blueprints
- comparing Flask, FastAPI and Django

## Routes and templates

```text
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/tracks/<int:track_id>")
def show_track(track_id):
    track = get_track(track_id)
    return render_template("track.html", track=track)
```

```text
<!-- templates/track.html -->
<h1>{{ track.name }}</h1>
<p>{{ track.milliseconds / 1000 }} seconds</p>
```

A Jinja2 template embeds Python-like expressions (`{{ track.name }}`) and control flow (`{% for %}`, `{% if %}`) directly in an HTML file, kept as a separate file from the route-handling Python code.

## Forms

```text
from flask import request

@app.route("/search", methods=["GET", "POST"])
def search():
    if request.method == "POST":
        query = request.form["query"]
        return f"Searching for {query}"
    return render_template("search_form.html")
```

`request.form` gives access to submitted form fields; the same route commonly handles both showing the form (`GET`) and processing its submission (`POST`), distinguished by `request.method`.

## Sessions

```text
from flask import session

app.secret_key = "change-me-in-production"

@app.route("/login")
def login():
    session["user_id"] = 42
    return "logged in"

@app.route("/whoami")
def whoami():
    return str(session.get("user_id"))
```

By default, Flask stores session data in a cookie on the client, cryptographically **signed** (not encrypted) with `app.secret_key` — the client can read the cookie's contents, but cannot modify them without invalidating the signature, which Flask checks on every request.

## Blueprints

```text
from flask import Blueprint

tracks_bp = Blueprint("tracks", __name__, url_prefix="/tracks")

@tracks_bp.route("/<int:track_id>")
def show(track_id):
    return f"track {track_id}"

# in the main app:
# app.register_blueprint(tracks_bp)
```

A blueprint groups a set of related routes (and their templates/static files) into a reusable, mountable unit — useful once an app grows past a handful of routes defined directly on `app`, keeping related functionality together instead of one long, flat file.

## Comparing Flask, FastAPI and Django

- **Flask**: small core, you choose the pieces (ORM, forms, auth) — flexible, more assembly required.
- **FastAPI**: built around type hints for automatic validation, serialization, and docs — strong default choice for a JSON API specifically.
- **Django**: batteries-included (ORM, admin interface, authentication, forms) — a strong default for a larger, more conventional, content-driven web application where you want most decisions already made for you.

None of the three is strictly "better" — the right choice depends on the project's shape and how much structure it needs on day one.

## Watch out: a hard-coded secret key

```text
app.secret_key = "change-me-in-production"   # exactly the kind of thing that should come from an environment variable
```

A hard-coded `secret_key` checked into version control defeats the entire purpose of signing session cookies — anyone who can read the source can forge a session. It belongs in configuration (an environment variable), exactly as the earlier lesson on configuration and secrets covered.

## Common mistakes

- Leaving business logic entirely inside route functions instead of separating it out, making routes hard to test independently of the web layer.
- Hard-coding a secret key instead of loading it from configuration.
- Mixing up `request.form` (submitted form data) with `request.args` (URL query parameters) for the wrong kind of request.
- Letting one file accumulate every route as an app grows, instead of splitting it into blueprints.
