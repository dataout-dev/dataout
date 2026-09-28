import ast
import builtins
import contextlib
import io
import linecache
import math
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


def _same(a, b):
    if a is b:
        return True
    if isinstance(a, bool) or isinstance(b, bool):
        return isinstance(a, bool) and isinstance(b, bool) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if a != a and b != b:
            return True
        return math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(_same(a[k], b[k]) for k in a)
    if type(a) is not type(b):
        return False
    if isinstance(a, (list, tuple)):
        return len(a) == len(b) and all(_same(x, y) for x, y in zip(a, b))
    return a == b


def _same_unordered(a, b):
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)) and type(a) is type(b):
        if len(a) != len(b):
            return False
        rest = list(b)
        for item in a:
            for i, other in enumerate(rest):
                if _same(item, other):
                    del rest[i]
                    break
            else:
                return False
        return True
    return _same(a, b)


def _fresh_namespace():
    ns = {"__name__": "__main__", "__builtins__": builtins}
    exec("from dataout import rows, sql, tables", ns)
    return ns


def _eval_snippet(ns, source, filename):
    tree = ast.parse(source, filename, "exec")
    last = None
    if tree.body and isinstance(tree.body[-1], ast.Expr):
        last = ast.Expression(tree.body.pop().value)
    exec(compile(tree, filename, "exec"), ns)
    if last is not None:
        return eval(compile(last, filename, "eval"), ns)
    return None


def _register(filename, source):
    linecache.cache[filename] = (len(source), None, source.splitlines(True), filename)


def _attempt(code, expr):
    ns = _fresh_namespace()
    out = io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
        try:
            exec(compile(code, "<your code>", "exec"), ns)
            value = _eval_snippet(ns, expr, "<test>")
            return {"ok": True, "value": value, "stdout": out.getvalue()}
        except BaseException as exc:
            return {"ok": False, "error": type(exc).__name__, "message": str(exc), "stdout": out.getvalue()}


def _matches(got, exp, check_output):
    if not exp["ok"]:
        return not got["ok"] and got["error"] == exp["error"]
    if not got["ok"]:
        return False
    if not _same(got["value"], exp["value"]):
        return False
    return not check_output or got["stdout"] == exp["stdout"]


def _grade(code, solution, cases, check_output=False):
    _register("<your code>", code)
    results = []
    for label, expr in cases:
        exp = _attempt(solution, expr)
        got = _attempt(code, expr)
        results.append({"label": label, "passed": _matches(got, exp, check_output)})
    return results


def _describe(result):
    if not result["ok"]:
        return f"raises {result['error']}" + (f": {result['message']}" if result["message"] else "")
    text = _show(result["value"])
    if result["stdout"]:
        text = f"prints {result['stdout']!r}" + ("" if result["value"] is None else f" and returns {text}")
    return text


def _samples(code, solution, exprs, check_output=False):
    _register("<your code>", code)
    results = []
    for expr in exprs:
        exp = _attempt(solution, expr)
        got = _attempt(code, expr)
        results.append(
            {
                "expr": expr,
                "expected": _describe(exp),
                "got": _describe(got),
                "passed": _matches(got, exp, check_output),
            }
        )
    return results


def _challenge_run(given, code, ns=None):
    ns = ns if ns is not None else _fresh_namespace()
    out = io.StringIO()
    error = None
    _register("<your code>", code)
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
        try:
            if given:
                exec(compile(given, "<given>", "exec"), ns)
            exec(compile(code, "<your code>", "exec"), ns)
        except BaseException as exc:
            error = _format_error(exc, "<your code>")
    stdout = out.getvalue()
    if len(stdout) > _MAX_OUTPUT:
        stdout = stdout[:_MAX_OUTPUT] + "\n... output shortened"
    return ns, stdout, error


def _challenge(given, code, reference=None, unordered=False):
    ns, stdout, error = _challenge_run(given, code)
    defined = error is None and "answer" in ns
    answer = _show(ns["answer"]) if defined else None
    result = {"stdout": stdout, "error": error, "defined": defined, "answer": answer, "graded": False, "passed": False, "reason": None}
    if reference is None:
        return result

    result["graded"] = True
    if error is not None:
        result["reason"] = "error"
        return result
    if not defined:
        result["reason"] = "missing"
        return result

    ref_ns, _, ref_error = _challenge_run(given, reference)
    if ref_error is not None or "answer" not in ref_ns:
        raise RuntimeError("The reference solution failed: " + (ref_error or "it did not define answer"))

    compare = _same_unordered if unordered else _same
    if compare(ns["answer"], ref_ns["answer"]):
        result["passed"] = True
    else:
        expected, got = ref_ns["answer"], ns["answer"]
        if type(expected) is not type(got) and not (
            isinstance(expected, (int, float)) and isinstance(got, (int, float)) and not isinstance(got, bool)
        ):
            result["reason"] = "type"
            result["expected_type"] = type(expected).__name__
        elif isinstance(expected, (list, tuple, dict, set, str)) and len(expected) != len(got):
            result["reason"] = "size"
        elif compare is _same_unordered or not isinstance(expected, (list, tuple)):
            result["reason"] = "value"
        elif _same_unordered(got, expected):
            result["reason"] = "order"
        else:
            result["reason"] = "value"
    return result


def _run_case(setup, code):
    ns = _fresh_namespace()
    out = io.StringIO()
    error = None
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
        try:
            if setup:
                exec(compile(setup, "<given>", "exec"), ns)
            exec(compile(code, "<your code>", "exec"), ns)
        except BaseException as exc:
            error = type(exc).__name__
    return ns, out.getvalue(), error


def _vars_match(got, exp, names, check_output):
    got_ns, got_out, got_err = got
    exp_ns, exp_out, exp_err = exp
    if exp_err is not None:
        return got_err == exp_err
    if got_err is not None:
        return False
    for name in names:
        if name not in got_ns or not _same(got_ns[name], exp_ns[name]):
            return False
    return not check_output or got_out == exp_out


def _grade_vars(code, solution, cases):
    _register("<your code>", code)
    results = []
    for case in cases:
        names = list(case.get("names") or [])
        check_output = bool(case.get("output"))
        exp = _run_case(case.get("setup", ""), solution)
        got = _run_case(case.get("setup", ""), code)
        results.append({"label": case["label"], "passed": _vars_match(got, exp, names, check_output)})
    return results


def _describe_vars(result, names, check_output):
    ns, out, error = result
    if error is not None:
        return f"raises {error}"
    parts = [f"{name} = {_show(ns[name])}" if name in ns else f"{name} is not defined" for name in names]
    if check_output:
        parts.append(f"prints {out!r}")
    return "\n".join(parts)


def _samples_vars(code, solution, samples):
    _register("<your code>", code)
    results = []
    for sample in samples:
        names = list(sample.get("names") or [])
        check_output = bool(sample.get("output"))
        setup = sample.get("setup", "")
        exp = _run_case(setup, solution)
        got = _run_case(setup, code)
        results.append(
            {
                "expr": setup,
                "expected": _describe_vars(exp, names, check_output),
                "got": _describe_vars(got, names, check_output),
                "passed": _vars_match(got, exp, names, check_output),
            }
        )
    return results
