import './gitPolyfills.js'
import LightningFS from '@isomorphic-git/lightning-fs'
import * as eng from '../lib/git/engine.js'
import { runCommand } from '../lib/git/terminal.js'
import { runChecks } from '../lib/git/grading.js'

let fsReady

function ensureFs() {
  return (fsReady ??= (() => {
    const instance = new LightningFS('dataout-git', { wipe: true })
    return instance
  })())
}

const dirFor = (session) => `/s/${session}`

const handlers = {
  async 'git.seed'({ session, spec }) {
    const fs = ensureFs()
    const dir = dirFor(session)
    await eng.seedRepo(fs, dir, spec ?? {})
  },

  async 'git.exec'({ session, line }) {
    const fs = ensureFs()
    const dir = dirFor(session)
    return runCommand(fs, dir, line)
  },

  async 'git.check'({ session, cases }) {
    const fs = ensureFs()
    const dir = dirFor(session)
    return runChecks(fs, dir, cases ?? [])
  },

  async 'git.file.read'({ session, path }) {
    const fs = ensureFs()
    return eng.readWorkingFile(fs, dirFor(session), path)
  },

  async 'git.file.write'({ session, path, content }) {
    const fs = ensureFs()
    await eng.writeWorkingFile(fs, dirFor(session), path, content)
  },

  async 'git.file.remove'({ session, path }) {
    const fs = ensureFs()
    await eng.removeWorkingFile(fs, dirFor(session), path)
  },

  async 'git.file.list'({ session }) {
    const fs = ensureFs()
    return eng.listWorkingFiles(fs, dirFor(session))
  },

  async 'git.state'({ session }) {
    const fs = ensureFs()
    const dir = dirFor(session)
    const [branch, rows, log, files] = await Promise.all([
      eng.currentBranchName(fs, dir),
      eng.statusRows(fs, dir),
      eng.repoLog(fs, dir),
      eng.listWorkingFiles(fs, dir),
    ])
    return { branch, status: rows, log, files }
  },
}

self.onmessage = async ({ data: { id, op, payload } }) => {
  try {
    const handler = handlers[op]
    if (!handler) throw new Error(`Unknown operation "${op}".`)
    const result = await handler(payload ?? {})
    self.postMessage({ id, result })
  } catch (err) {
    self.postMessage({ id, error: { message: err?.message ?? String(err), code: err?.code } })
  }
}
