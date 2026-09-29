Turning a project into something `pip install`-able involves a real build step and a real publishing step — each with its own decisions about format, versioning, and trust.

This is a reading lesson: building real distribution artifacts and publishing to a package index needs a real filesystem, a compiler toolchain for some packages, and network access to a real index, none of which this browser playground has. The ideas apply directly the first time you actually ship a package.

You will learn:

- wheels versus sdists
- build backends
- versioning schemes: SemVer and CalVer
- publishing to an index, and trusted publishing
- changelogs
- supply-chain security, briefly

## Wheels and sdists

```text
python -m build
# produces:
#   dist/mypackage-0.1.0.tar.gz       <- sdist (source distribution)
#   dist/mypackage-0.1.0-py3-none-any.whl   <- wheel (built distribution)
```

An **sdist** is essentially the source tree, packaged up — installing from one runs the build step on the user's own machine. A **wheel** is already built, ready to be unpacked straight into place — no build step needed at install time, which matters enormously for a package with a compiled extension that would otherwise need a compiler on every installing machine.

## Build backends

```text
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

`python -m build` is a generic front-end; the actual work of turning your source into a wheel or sdist is delegated to whichever backend `pyproject.toml` names (`setuptools`, `hatchling`, `flit_core`, and others). This keeps the build tooling itself interchangeable without changing how you invoke a build.

## Versioning: SemVer and CalVer

```text
SemVer:  2.4.1   ->  MAJOR.MINOR.PATCH
             a major bump signals a breaking change;
             minor adds functionality, backward compatible;
             patch is a bug fix, backward compatible

CalVer:  2026.09.2   -> year.month.release-in-that-month
             says WHEN it was released, nothing about compatibility
```

SemVer encodes a promise about compatibility directly in the version number, letting dependents reason about upgrade safety from the number alone. CalVer instead communicates how current a release is — common for projects (browsers, some frameworks) where "how recent" matters more to users than a formal compatibility contract.

## Publishing to an index

```text
python -m twine upload dist/*
```

Publishing pushes the built artifacts to a package index (PyPI, or a private index) so `pip install mypackage` can find and download them. This is also the point where a mistake — an accidental version overwrite, a broken build uploaded by accident — becomes visible to every user who installs after that.

## Trusted publishing

```text
# a GitHub Actions workflow authenticates to PyPI directly,
# with no long-lived API token stored as a secret at all
```

Instead of storing a long-lived PyPI API token in CI secrets (which, if leaked, works indefinitely until manually revoked), trusted publishing issues a short-lived credential automatically, scoped to one specific CI workflow run — removing an entire category of "a leaked secret can be used forever" risk.

## Changelogs

A changelog is the human-readable record of what actually changed release to release — the difference between a user reading "bumped from 2.3.0 to 2.4.0" (which tells them nothing) and reading "2.4.0: `parse()` now raises `ValueError` instead of silently returning `None` for invalid input" (which tells them exactly what to check before upgrading).

## Security of the supply chain

A published package is code that potentially thousands of downstream projects will pull in and run automatically. Compromised publishing credentials, or a malicious dependency slipped into your own dependency tree, can propagate to every one of those downstream users — which is exactly why practices like trusted publishing, pinned dependencies, and reviewing what a new dependency actually does exist.

## Watch out: publishing by hand, from a personal machine

Publishing manually from a laptop (rather than through a reviewed CI pipeline) means the release depends on whatever happens to be in that person's local environment at that moment — no guaranteed clean build, no audit trail of exactly what was tested before it shipped. A CI-driven release process is what makes "what got published" and "what was reviewed and tested" the same thing, verifiably.

## Common mistakes

- Publishing only an sdist, forcing every installer to build from source (and need a compiler) unnecessarily.
- Choosing SemVer but not actually following it, breaking the compatibility promise the version number implies.
- Storing a long-lived publishing token in CI secrets when trusted publishing is available.
- Skipping the changelog, leaving users to diff two versions' source just to find out what changed.
