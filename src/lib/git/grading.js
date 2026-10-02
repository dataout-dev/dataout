// Grading primitives shared between the browser worker and the Node checker script.
// A lesson's hidden check is a small JS boolean expression (a string, exactly like a SQL
// query or a Python expression elsewhere in this app) evaluated with these helpers in
// scope, against whatever the current (fs, dir) repo state is.
import * as eng from './engine.js'

export function makeHelpers(fs, dir) {
  return {
    log: (ref = 'HEAD') => eng.repoLog(fs, dir, ref),
    branch: () => eng.currentBranchName(fs, dir),
    branches: () => eng.listBranchNames(fs, dir),
    head: () => eng.headOid(fs, dir),
    fileAt: (ref, filepath) => eng.fileAtRef(fs, dir, ref, filepath),
    file: (filepath) => eng.readWorkingFile(fs, dir, filepath),
    filesAt: (ref) => eng.listFilesAtRef(fs, dir, ref),
    status: () => eng.statusRows(fs, dir),
    fileStatus: (filepath) => eng.fileStatus(fs, dir, filepath),
    clean: () => eng.isClean(fs, dir),
    tags: () => eng.listTagNames(fs, dir),
    tagTarget: (name) => eng.tagTarget(fs, dir, name),
    commitCount: async (ref = 'HEAD') => (await eng.repoLog(fs, dir, ref)).length,
    isMergedInto: (branch, intoRef = 'HEAD') => eng.isMergedInto(fs, dir, branch, intoRef),
    mergeInProgress: () => eng.mergeInProgress(fs, dir),
    conflicted: (filepath) => eng.hasConflictMarkers(fs, dir, filepath),
  }
}

export async function evalAssertion(fs, dir, expr) {
  const helpers = makeHelpers(fs, dir)
  const names = Object.keys(helpers)
  const values = Object.values(helpers)
  // eslint-disable-next-line no-new-func
  const fn = new Function(...names, `return (async () => (${expr}))()`)
  return fn(...values)
}

// Runs every { label, check } assertion against the current repo state, catching errors
// so a broken assertion (or a learner's repo left in a broken state) shows as a normal
// failure rather than throwing.
export async function runChecks(fs, dir, cases) {
  const results = []
  for (const { label, check } of cases) {
    try {
      const passed = Boolean(await evalAssertion(fs, dir, check))
      results.push({ label, passed })
    } catch {
      results.push({ label, passed: false })
    }
  }
  return results
}
