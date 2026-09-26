export class SqlStopped extends Error {
  constructor() {
    super('Stopped.')
    this.name = 'SqlStopped'
  }
}

export class SqlTimeout extends Error {
  constructor(ms) {
    super(`That query ran for more than ${Math.round(ms / 1000)} seconds, so it was stopped.`)
    this.name = 'SqlTimeout'
  }
}

export const NO_SESSION = 'NO_SESSION'

const DEFAULT_TIMEOUT_MS = 15000

export function createSqlClient({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  let worker = null
  let active = null
  let chain = Promise.resolve()
  let generation = 0
  let nextId = 0
  let disposed = false
  const replay = new Map()

  const post = (message) => worker.postMessage(message)

  function spawn() {
    worker = new Worker(new URL('../workers/sqlWorker.js', import.meta.url), { type: 'module' })
    const mine = worker

    mine.onmessage = ({ data }) => {
      if (mine !== worker || !active || active.id !== data.id) return
      const current = active
      active = null
      clearTimeout(current.timer)
      if (data.error) {
        const err = new Error(data.error.message)
        err.code = data.error.code
        current.reject(err)
      } else {
        current.resolve(data.result)
      }
    }

    mine.onerror = (event) => {
      event.preventDefault?.()
      if (mine !== worker) return
      killWorker(new Error('The SQL engine stopped unexpectedly. Try again.'))
    }

    for (const [key, { op, payload }] of replay) post({ id: `replay:${key}`, op, payload })
  }

  function killWorker(reason) {
    worker?.terminate()
    worker = null
    if (active) {
      const current = active
      active = null
      clearTimeout(current.timer)
      current.reject(reason)
    }
  }

  function dispatch(op, payload, timeout) {
    return new Promise((resolve, reject) => {
      if (disposed) {
        reject(new SqlStopped())
        return
      }
      if (!worker) spawn()
      const id = ++nextId
      const timer = setTimeout(() => killWorker(new SqlTimeout(timeout)), timeout)
      active = { id, resolve, reject, timer }
      post({ id, op, payload })
    })
  }

  function call(op, payload = {}, { timeout = timeoutMs, remember } = {}) {
    const queuedIn = generation
    const run = chain.then(async () => {
      if (queuedIn !== generation) throw new SqlStopped()
      const result = await dispatch(op, payload, timeout)
      if (remember) replay.set(remember, { op, payload })
      return result
    })
    chain = run.catch(() => {})
    return run
  }

  return {
    call,

    forget(key) {
      replay.delete(key)
    },

    stop() {
      generation += 1
      killWorker(new SqlStopped())
    },

    dispose() {
      disposed = true
      replay.clear()
      generation += 1
      killWorker(new SqlStopped())
    },
  }
}

let shared
export const sharedSql = () => (shared ??= createSqlClient())

export const isStopped = (err) => err instanceof SqlStopped
