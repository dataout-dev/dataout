import { py, pro } from './common.js'

export const packagingToolingWorkflow = {
  id: 'packaging-tooling-and-workflow',
  title: 'Packaging, tooling and workflow',
  intro: 'Shipping and maintaining Python projects.',
  lessons: [
    {
      id: 'py-project-structure-pyproject',
      title: 'Project structure and pyproject.toml (reading)',
      blurb: 'src layout, dependencies and extras, entry points, and lock files.',
      kind: 'read',
      check: [
        {
          q: 'What does the "src layout" (putting your package under `src/mypackage/` instead of directly in the project root) actually buy you?',
          options: [
            'Nothing; it is purely a style preference',
            'It prevents accidentally importing the package from the working directory instead of the actually-installed version, catching packaging mistakes before they reach real users',
            'It makes the code run faster',
            'It is required by the Python language',
          ],
          answer: 1,
          why: 'Without src layout, running tests from the project root can silently succeed against the local source tree even when the packaged distribution is broken — src layout forces tests to run against the installed package instead.',
        },
        {
          q: 'What is `pyproject.toml` for?',
          options: [
            'It is an optional file with no real effect',
            'The standard, tool-agnostic place to declare a project’s metadata (name, version, dependencies) and configure the build backend and other tools, replacing the older setup.py-only approach',
            'It only configures pytest',
            'It replaces the need for any dependency to be installed at all',
          ],
          answer: 1,
          why: '`pyproject.toml` centralises what used to be spread across `setup.py`, `setup.cfg`, and various tool-specific config files, under one standard format every modern Python tool understands.',
        },
        {
          q: 'What is an "extra" in a project’s dependencies (e.g. `pip install myproject[dev]`)?',
          options: [
            'A required dependency that cannot be skipped',
            'An optional, named group of extra dependencies (like testing or linting tools) that most users installing the package do not need, but a contributor working on it does',
            'A dependency that costs extra money',
            'A synonym for a lock file',
          ],
          answer: 1,
          why: 'Extras let a package keep its core install lightweight while still offering optional bundles (`[dev]`, `[docs]`, `[postgres]`) for users who need the additional functionality or tooling.',
        },
        {
          q: 'What does an "entry point" declared in `pyproject.toml` let you do?',
          options: [
            'Nothing observable',
            'Register a command-line script name (so `pip install` sets up a real terminal command) or a plugin hook another tool can discover, without the user needing to know the underlying module path',
            'It is only used for web servers',
            'It replaces `__main__.py` entirely in every project',
          ],
          answer: 1,
          why: 'An entry point is how installing a package can hand you a runnable command like `mytool` on your PATH, mapped internally to a specific function.',
        },
        {
          q: 'Why do projects use a lock file (from `uv`, `pip-tools`, `poetry`, and similar tools) in addition to a looser dependency spec in `pyproject.toml`?',
          options: [
            'Lock files are redundant and rarely used',
            '`pyproject.toml` typically declares acceptable version *ranges*; a lock file pins the exact resolved versions actually installed, so every machine and every CI run gets identical dependencies',
            'Lock files replace pyproject.toml entirely',
            'Lock files are only needed for very large projects',
          ],
          answer: 1,
          why: 'Without a lock file, two installs on different days (or different machines) can silently resolve to different dependency versions even from the same `pyproject.toml` — a lock file makes installs reproducible.',
        },
      ],
    },
    {
      id: 'py-building-publishing-packages',
      title: 'Building and publishing a package (reading)',
      blurb: 'Wheels and sdists, build backends, versioning, publishing, and supply-chain security.',
      kind: 'read',
      check: [
        {
          q: 'What is the difference between an sdist and a wheel?',
          options: [
            'They are the same thing with two names',
            'An sdist is a source distribution (the raw source, built at install time); a wheel is a pre-built, ready-to-install binary distribution that installs faster and does not need a build step on the user’s machine',
            'A wheel only works on Windows',
            'An sdist is always smaller than a wheel',
          ],
          answer: 1,
          why: 'A wheel skips the build step entirely at install time, which matters a lot for packages with compiled extensions that would otherwise need a compiler on every installing machine.',
        },
        {
          q: 'What does a "build backend" (declared in `pyproject.toml`, e.g. `setuptools`, `hatchling`, `flit_core`) actually do?',
          options: [
            'It runs your tests',
            'It is the tool responsible for actually turning your source tree into a wheel or sdist when you run a build command',
            'It manages your virtual environments',
            'It is only relevant for command-line tools',
          ],
          answer: 1,
          why: '`pyproject.toml` declares which backend to use; a generic `python -m build` command then delegates the actual packaging work to whichever backend is specified, keeping the build tooling itself interchangeable.',
        },
        {
          q: 'What is the practical difference between SemVer (Semantic Versioning) and CalVer (Calendar Versioning)?',
          options: [
            'They are identical numbering schemes',
            'SemVer (`MAJOR.MINOR.PATCH`) encodes compatibility information in the version number itself (a major bump signals breaking changes); CalVer encodes a release date (e.g. `2026.09`) and says nothing about compatibility by itself',
            'CalVer is only used by very old projects',
            'SemVer versions are always higher numbers than CalVer versions',
          ],
          answer: 1,
          why: 'Choosing between them is a real decision: SemVer communicates "is it safe to upgrade" directly in the number; CalVer communicates "how current is this" instead.',
        },
        {
          q: 'What does "trusted publishing" (used by PyPI) provide over a long-lived API token stored in CI secrets?',
          options: [
            'No real difference',
            'A short-lived, automatically issued credential tied to a specific CI workflow run, removing the need to store a long-lived secret token that could leak or be reused if compromised',
            'It makes packages install faster',
            'It is only available for private packages',
          ],
          answer: 1,
          why: 'A leaked long-lived token can be used by an attacker indefinitely; a trusted-publishing credential is scoped and short-lived by design, shrinking the damage a single leak could do.',
        },
        {
          q: 'Why does supply-chain security matter specifically for published packages?',
          options: [
            'It does not; only the code you personally write matters',
            'A published package is code that potentially thousands of other projects will pull in and run automatically — a compromised release (stolen credentials, a malicious dependency) can propagate to every downstream user',
            'Supply-chain security only applies to compiled binaries',
            'It is solely PyPI’s responsibility, not the package author’s',
          ],
          answer: 1,
          why: 'Publishing is a trust relationship: everyone who installs your package is trusting that what actually got published is what you intended, which is exactly what stolen publishing credentials or a compromised build step can violate.',
        },
      ],
    },
    {
      id: 'py-documentation-docstrings-doctest',
      title: 'Documentation: docstrings, doctest and doc generators',
      blurb: 'Docstring styles, doctest, type hints as documentation, and keeping docs in sync.',
      kind: 'code',
      practice: {
        prompt: 'Write `add(a, b)` with a docstring containing at least one `>>> add(...)` doctest example that genuinely passes. Write `doctest_ok()` that runs `add`’s doctests (using `doctest.DocTestFinder`/`DocTestRunner`) and returns `True` only if every example in the docstring actually passes.',
        starter: 'import doctest\n\ndef add(a, b):\n    """\n    >>> add(2, 3)\n    5\n    """\n    return a + b\n\ndef doctest_ok():\n    ...\n',
        solution: py`import doctest

def add(a, b):
    """
    >>> add(2, 3)
    5
    >>> add(-1, 1)
    0
    """
    return a + b

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(add, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0`,
        samples: ['doctest_ok()'],
        cases: [
          ['add still adds correctly', 'add(2, 3)'],
          ['add works for negative numbers', 'add(-1, 1)'],
          ['doctest_ok confirms the docstring examples actually pass', 'doctest_ok()'],
        ],
        traps: [
          py`import doctest

def add(a, b):
    """
    >>> add(2, 3)
    -1
    >>> add(-1, 1)
    -2
    """
    return a - b

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(add, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0`,
          py`import doctest

def add(a, b):
    """
    >>> add(2, 3)
    999
    """
    return a + b

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(add, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0`,
        ],
      },
      real: [
        pro({
          title: 'A doctest for a real track formatter',
          use: ['tracks'],
          starter: 'import doctest\n\ndef describe_track(name, ms):\n    """\n    >>> print(describe_track("Test", 200000))\n    Test (3.3 min)\n    """\n    ...\n\ndef doctest_ok():\n    ...\n\nfirst = tracks[0]\nanswer = (describe_track(first["Name"], first["Milliseconds"]).endswith("min)"), doctest_ok())\n',
          given: '# tracks is a list of dictionaries; first is the real first row.',
          brief: 'Write `describe_track(name, ms)` returning `f"{name} ({ms/60000:.1f} min)"`, and `doctest_ok()` as in the lesson (using `describe_track` instead of `add`). Store `(ends_with_min_paren, doctest_result)` in `answer`.',
          reference: py`import doctest

def describe_track(name, ms):
    """
    >>> print(describe_track("Test", 200000))
    Test (3.3 min)
    """
    return f"{name} ({ms/60000:.1f} min)"

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(describe_track, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0

first = tracks[0]
answer = (describe_track(first["Name"], first["Milliseconds"]).endswith("min)"), doctest_ok())`,
          walkthrough: 'The doctest here checks a fixed, made-up example ("Test", 200000) inside the docstring — it does not need real data to verify itself, but the function it documents is then reused directly against a real track.',
          traps: [py`import doctest

def describe_track(name, ms):
    """
    >>> print(describe_track("Test", 200000))
    Test (3.3 min)
    """
    return f"{name} - {ms/60000:.1f} minutes"

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(describe_track, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0

first = tracks[0]
answer = (describe_track(first["Name"], first["Milliseconds"]).endswith("min)"), doctest_ok())`],
        }),
        pro({
          title: 'A doctest for a real customer formatter',
          use: ['customers'],
          starter: 'import doctest\n\ndef full_name(first, last):\n    """\n    >>> print(full_name("Ada", "Lovelace"))\n    Ada Lovelace\n    """\n    ...\n\ndef doctest_ok():\n    ...\n\nrow = customers[0]\nanswer = (full_name(row["FirstName"], row["LastName"]), doctest_ok())\n',
          given: '# customers is a list of dictionaries; row is the real first customer.',
          brief: 'Write `full_name(first, last)` returning `f"{first} {last}"`, and `doctest_ok()` as in the lesson (using `full_name`). Store `(real_full_name, doctest_result)` in `answer`.',
          reference: py`import doctest

def full_name(first, last):
    """
    >>> print(full_name("Ada", "Lovelace"))
    Ada Lovelace
    """
    return f"{first} {last}"

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(full_name, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0

row = customers[0]
answer = (full_name(row["FirstName"], row["LastName"]), doctest_ok())`,
          walkthrough: 'A docstring example is documentation a reader can trust precisely because `doctest` actually executes it — unlike a comment, it cannot silently drift out of sync with the real behaviour without a test failing.',
          traps: [py`import doctest

def full_name(first, last):
    """
    >>> print(full_name("Ada", "Lovelace"))
    Ada Lovelace
    """
    return f"{last}, {first}"

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(full_name, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0

row = customers[0]
answer = (full_name(row["FirstName"], row["LastName"]), doctest_ok())`],
        }),
        pro({
          title: 'Catching a docstring that lies',
          use: ['tracks'],
          starter: 'import doctest\n\ndef price_tag(price):\n    """\n    >>> print(price_tag(0.99))\n    $0.99\n    """\n    ...\n\ndef doctest_ok():\n    ...\n\nfirst_price = tracks[0]["UnitPrice"]\nanswer = (price_tag(first_price), doctest_ok())\n',
          given: '# tracks is a list of dictionaries; first_price is a real UnitPrice.',
          brief: 'Write `price_tag(price)` returning `f"${price:.2f}"`, and `doctest_ok()` as in the lesson. Store `(formatted_real_price, doctest_result)` in `answer`.',
          reference: py`import doctest

def price_tag(price):
    """
    >>> print(price_tag(0.99))
    $0.99
    """
    return "$" + f"{price:.2f}"

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(price_tag, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0

first_price = tracks[0]["UnitPrice"]
answer = (price_tag(first_price), doctest_ok())`,
          walkthrough: 'If the docstring example and the implementation ever disagree — formatting changes, a rounding tweak, anything — `doctest_ok()` catches it immediately, which is exactly the point of testing documentation instead of just trusting it.',
          traps: [py`import doctest

def price_tag(price):
    """
    >>> print(price_tag(0.99))
    $1.00
    """
    return "$" + f"{price:.2f}"

def doctest_ok():
    finder = doctest.DocTestFinder()
    tests = finder.find(price_tag, globs=globals())
    runner = doctest.DocTestRunner()
    failures = 0
    for test in tests:
        result = runner.run(test, out=lambda s: None)
        failures += result.failed
    return failures == 0

first_price = tracks[0]["UnitPrice"]
answer = (price_tag(first_price), doctest_ok())`],
        }),
      ],
    },
    {
      id: 'py-git-github-workflow',
      title: 'Git and GitHub workflow for Python projects (reading)',
      blurb: 'Commits, branches, pull requests, branch strategies, and code review habits.',
      kind: 'read',
      check: [
        {
          q: 'What makes a good commit message body genuinely useful later?',
          options: [
            'Restating exactly what lines changed, since `git diff` cannot show that',
            'Explaining *why* the change was made — the reasoning, trade-off, or bug being fixed — since the diff already shows *what* changed, but not why',
            'Being as short as possible, ideally one word',
            'Including the author’s name and date (git already records both)',
          ],
          answer: 1,
          why: '`git diff` and `git blame` already show what changed and by whom; the one thing they cannot recover on their own is the reasoning behind the change, which is exactly what a good commit message preserves.',
        },
        {
          q: 'What is a "feature branch" workflow?',
          options: [
            'Committing directly to the main branch for every change',
            'Creating a separate, short-lived branch for each unit of work (a feature, a fix), merged back into the main branch (often via a pull request) once it is ready',
            'A branch that only contains new features, never bug fixes',
            'A workflow specific to open-source projects only',
          ],
          answer: 1,
          why: 'Isolating work on its own branch keeps the main branch stable and reviewable, and lets multiple people work on unrelated changes without stepping on each other.',
        },
        {
          q: 'What is the point of a pull request, beyond just merging code?',
          options: [
            'It has no purpose beyond the merge itself',
            'It provides a place for code review, discussion, and automated checks (tests, linting) to run *before* a change lands, catching problems while they are still cheap to fix',
            'It is required by Git itself to merge branches',
            'It automatically fixes any bugs in the change',
          ],
          answer: 1,
          why: 'The review and CI checks a pull request triggers are the actual value — the merge itself is a small mechanical step at the end of that process.',
        },
        {
          q: 'What is a reasonable habit when resolving a merge conflict?',
          options: [
            'Always keep your own version and discard the incoming changes without looking',
            'Understand what *both* sides of the conflict were trying to do before deciding how to combine them — blindly picking one side risks silently discarding someone else’s real fix',
            'Delete the conflicting file entirely to make the conflict go away',
            'Conflicts should never happen if you are a careful programmer',
          ],
          answer: 1,
          why: 'A conflict means two changes touched the same code for a reason — understanding both intents before resolving is what prevents silently reverting someone else’s work.',
        },
        {
          q: 'Why does a `.gitignore` file matter for a Python project specifically?',
          options: [
            'It has no real purpose',
            'It keeps generated, environment-specific, or sensitive files (`__pycache__/`, a local `.venv/`, `.env` secrets) out of version control, so the repository only tracks source that is actually meant to be shared',
            'It is required for Python to run at all',
            'It only matters for compiled languages, not Python',
          ],
          answer: 1,
          why: 'Committing generated bytecode caches or a personal `.env` file with real secrets creates noise at best and a security incident at worst — `.gitignore` is what keeps those out from the start.',
        },
      ],
    },
    {
      id: 'py-ci-pre-commit',
      title: 'Continuous integration and pre-commit (reading)',
      blurb: 'What CI runs, matrix builds, caching, pre-commit hooks, and branch protection.',
      kind: 'read',
      check: [
        {
          q: 'What does a typical Python CI pipeline run on every pull request?',
          options: [
            'Nothing automatic; a human always checks everything by hand',
            'Some combination of linting, the test suite, type checking, and a build check — the same checks a careful developer would run locally, applied consistently to every change regardless of who made it',
            'Only a spell-checker on comments',
            'It deploys directly to production immediately',
          ],
          answer: 1,
          why: 'CI’s value is consistency: every single change gets the same checks, regardless of what the author remembered to run locally.',
        },
        {
          q: 'What is a "matrix build" in CI, and why use one for a Python library?',
          options: [
            'A build that only runs once, on one machine',
            'Running the same test suite across multiple combinations (several Python versions, several operating systems) in parallel, to catch version- or platform-specific breakage before users hit it',
            'A build that tests mathematical matrix operations specifically',
            'A deprecated CI feature no longer used',
          ],
          answer: 1,
          why: 'A library that claims to support Python 3.10 through 3.14 needs to actually be tested against each of them — a matrix build is how that gets verified automatically, on every change.',
        },
        {
          q: 'Why does CI caching (e.g. caching installed dependencies between runs) matter?',
          options: [
            'It has no effect on anything',
            'Reinstalling every dependency from scratch on every single CI run wastes significant time; caching the resolved dependencies between runs speeds up feedback substantially',
            'Caching is only relevant for compiled languages',
            'It reduces test coverage',
          ],
          answer: 1,
          why: 'Faster CI means faster feedback on every change — caching dependency installs is one of the highest-leverage, lowest-risk speedups available.',
        },
        {
          q: 'How does a pre-commit hook relate to CI, given CI runs the same checks anyway?',
          options: [
            'They are redundant; only one is ever needed',
            'A pre-commit hook catches an obvious problem locally, in seconds, before a commit is even made; CI is the guaranteed backstop for anyone who skipped or does not have the hook installed',
            'pre-commit hooks replace CI entirely for most teams',
            'CI cannot run any check a pre-commit hook already runs',
          ],
          answer: 1,
          why: 'They serve complementary roles: pre-commit is fast, local, and skippable; CI is slower but universal and cannot be skipped by an individual contributor.',
        },
        {
          q: 'What does "branch protection" on a repository’s main branch typically enforce?',
          options: [
            'It prevents the branch from ever being deleted, and nothing else',
            'Rules like requiring CI to pass and requiring at least one review approval before a pull request can be merged into that branch',
            'It encrypts the branch’s contents',
            'It is purely cosmetic, shown only in the GitHub UI',
          ],
          answer: 1,
          why: 'Branch protection is what actually makes "CI must pass" and "needs a review" enforced rules, rather than guidelines someone could otherwise bypass by merging directly.',
        },
      ],
    },
  ],
  checkpoint: [],
}
