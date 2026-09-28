import json
import os
import re
import sqlite3
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRELUDE = os.path.join(ROOT, "src", "workers", "python", "prelude.py")
DATASETS = os.path.join(ROOT, "public", "datasets")

G = {"__name__": "prelude"}
with open(PRELUDE, encoding="utf8") as handle:
    exec(compile(handle.read(), PRELUDE, "exec"), G)

with open(os.path.join(DATASETS, "manifest.json"), encoding="utf8") as handle:
    FILES = {d["id"]: d["file"] for d in json.load(handle)["datasets"]}


def local_connect(name):
    return sqlite3.connect(f"file:{os.path.join(DATASETS, FILES[name])}?mode=ro", uri=True)


G["_connect"] = local_connect


def check_practice(item):
    problems = []
    p = item["practice"]
    mode = p.get("mode")
    solution = p["solution"]
    starter = p["starter"]
    cases = p["cases"]
    samples = p.get("samples") or []

    if not cases:
        return ["practice has no cases"]

    if mode == "variables":
        graded = G["_grade_vars"](solution, solution, cases)
        shown = G["_samples_vars"](solution, solution, samples) if samples else []
        for case in cases:
            names = case.get("names") or []
            output = bool(case.get("output"))
            if not names and not output:
                problems.append(f"case '{case['label']}' checks nothing (no names and no output)")
            ns, out, err = G["_run_case"](case.get("setup", ""), solution)
            if err is not None:
                problems.append(f"solution raises {err} in case '{case['label']}'")
            for name in names:
                if name not in ns:
                    problems.append(f"solution does not define {name} in case '{case['label']}'")
    else:
        graded = G["_grade"](solution, solution, cases, p.get("checkOutput", False))
        shown = G["_samples"](solution, solution, samples, p.get("checkOutput", False)) if samples else []
        for label, expr in cases:
            attempt = G["_attempt"](solution, expr)
            if not attempt["ok"] and not label.lower().startswith("raises"):
                problems.append(f"solution raises {attempt['error']} for '{label}': {attempt['message']}")

    if not all(r["passed"] for r in graded):
        problems.append("the solution fails its own cases")
    if shown and not all(s["passed"] for s in shown):
        problems.append("the solution fails its own samples")

    def grade(code):
        if mode == "variables":
            return G["_grade_vars"](code, solution, cases)
        return G["_grade"](code, solution, cases, p.get("checkOutput", False))

    if all(r["passed"] for r in grade(starter)):
        problems.append("the starter code already passes every case")

    for trap in p.get("traps") or []:
        try:
            compile(trap, "<trap>", "exec")
        except SyntaxError as exc:
            problems.append(f"a trap is not valid Python ({exc.msg}): {trap[:60]!r}")
            continue
        if all(r["passed"] for r in grade(trap)):
            problems.append(f"a wrong solution passes every case: {trap[:70]!r}")

    if not p.get("traps"):
        problems.append("no traps: add wrong solutions that the hidden cases must reject")
    return problems


def check_challenge(item):
    problems = []
    given = (item.get("hidden") or "") + "\n" + (item.get("given") or "")
    reference = item["reference"]
    starter = item.get("starter") or "answer = "

    ref = G["_challenge"](given, reference)
    if ref["error"]:
        return [f"the reference raises an error: {ref['error'].splitlines()[-1]}"]
    if not ref["defined"]:
        return ["the reference does not define answer"]
    if ref["answer"] is not None and len(ref["answer"]) > 4000:
        problems.append("the answer is very long; ask for something smaller")
    if ref["answer"] in ("None",):
        problems.append("the reference answer is None")

    graded = G["_challenge"](given, reference, reference, bool(item.get("unordered")))
    if not graded["passed"]:
        problems.append("the reference fails against itself")

    starter_result = G["_challenge"](given, starter, reference, bool(item.get("unordered")))
    if starter_result["passed"]:
        problems.append("the starter already passes")

    for trap in item.get("traps") or []:
        result = G["_challenge"](given, trap, reference, bool(item.get("unordered")))
        if result["passed"]:
            problems.append(f"a wrong solution passes: {trap[:70]!r}")

    if not item.get("walkthrough"):
        problems.append("no walkthrough")
    if not item.get("brief") and not item.get("task"):
        problems.append("no brief")
    return problems


FENCE = re.compile(r"(<!-- expect-error -->\n)?```python\n(.*?)\n```", re.S)


def check_doc(item):
    problems = []
    text = item["text"]
    ns_name = "doc-check"
    G["_reset"](ns_name)
    for index, match in enumerate(FENCE.finditer(text), 1):
        expect_error = match.group(1) is not None
        code = match.group(2)
        result = G["_run"](ns_name, code, f"<doc {index}>")
        failed = result["error"] is not None
        if failed and not expect_error:
            problems.append(f"example {index} fails: {result['error'].splitlines()[-1]}  ({code[:50]!r})")
        if expect_error and not failed:
            problems.append(f"example {index} is marked expect-error but runs fine ({code[:50]!r})")
    return problems


def main():
    payload = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    task = payload["task"]
    if task == "practice":
        problems = check_practice(payload)
    elif task == "challenge":
        problems = check_challenge(payload)
    elif task == "doc":
        problems = check_doc(payload)
    else:
        problems = [f"unknown task {task}"]
    json.dump(problems, sys.stdout)


main()
