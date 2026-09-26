import ast
import builtins
import contextlib
import io
import linecache
import pprint
import sqlite3
import sys
import time
import traceback
import types

_MAX_OUTPUT = 20000


def _connect(name):
    return sqlite3.connect(f"file:/data/{name}.sqlite?mode=ro", uri=True)


def _table_names(con):
    found = con.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).fetchall()
    return [row[0] for row in found]


def _tables(name):
    """Names of the tables in a built-in dataset."""
    with contextlib.closing(_connect(name)) as con:
        return _table_names(con)


def _sql(name, query, params=()):
    """Run a SQL query on a built-in dataset and return the rows as dicts."""
    with contextlib.closing(_connect(name)) as con:
        con.row_factory = sqlite3.Row
        return [dict(row) for row in con.execute(query, params).fetchall()]


def _rows(name, table=None):
    """Return every row of a table in a built-in dataset as a list of dicts."""
    if table is None:
        names = _tables(name)
        if len(names) != 1:
            raise ValueError(f"{name!r} has several tables ({', '.join(names)}). Pass one: rows({name!r}, 'table')")
        table = names[0]
    quoted = '"' + table.replace('"', '""') + '"'
    return _sql(name, f"SELECT * FROM {quoted}")


dataout = types.ModuleType("dataout")
dataout.__doc__ = "Helpers for the datasets built into the DataOut playground."
dataout.rows = _rows
dataout.sql = _sql
dataout.tables = _tables
sys.modules["dataout"] = dataout


def _no_input(prompt=""):
    raise RuntimeError(
        "input() is not available in the playground yet. Put the value in a variable instead, for example: name = 'Ada'"
    )


builtins.input = _no_input

_sessions = {}


def _session(name):
    ns = _sessions.get(name)
    if ns is None:
        ns = {"__name__": "__main__", "__builtins__": builtins}
        exec("from dataout import rows, sql, tables", ns)
        _sessions[name] = ns
    return ns


def _uses_packages(source):
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return False
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names = [alias.name for alias in node.names]
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            names = [node.module]
        else:
            continue
        if any(name.split(".")[0] not in sys.stdlib_module_names and name.split(".")[0] != "dataout" for name in names):
            return True
    return False


def _reset(name):
    _sessions.pop(name, None)


def _show(value):
    if isinstance(value, (list, tuple, dict, set, frozenset)):
        text = pprint.pformat(value, width=100, sort_dicts=False)
    else:
        text = repr(value)
    if len(text) > _MAX_OUTPUT:
        text = text[:_MAX_OUTPUT] + "\n... output shortened"
    return text


def _format_error(exc, filename):
    tb = exc.__traceback__
    while tb is not None and tb.tb_frame.f_code.co_filename != filename:
        tb = tb.tb_next
    return "".join(traceback.format_exception(type(exc), exc, tb)).rstrip()


def _run(session, source, filename):
    ns = _session(session)
    lines = source.splitlines(True)
    linecache.cache[filename] = (len(source), None, lines, filename)

    out = io.StringIO()
    err = io.StringIO()
    result = None
    error = None
    started = time.perf_counter()

    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        try:
            tree = ast.parse(source, filename, "exec")
            last = None
            if tree.body and isinstance(tree.body[-1], ast.Expr):
                last = ast.Expression(tree.body.pop().value)
            exec(compile(tree, filename, "exec"), ns)
            if last is not None:
                value = eval(compile(last, filename, "eval"), ns)
                if value is not None:
                    result = _show(value)
        except BaseException as exc:
            error = _format_error(exc, filename)

    stdout = out.getvalue()
    stderr = err.getvalue()
    if len(stdout) > _MAX_OUTPUT:
        stdout = stdout[:_MAX_OUTPUT] + "\n... output shortened"
    if len(stderr) > _MAX_OUTPUT:
        stderr = stderr[:_MAX_OUTPUT] + "\n... output shortened"

    return {
        "stdout": stdout,
        "stderr": stderr,
        "result": result,
        "error": error,
        "ms": (time.perf_counter() - started) * 1000,
    }
