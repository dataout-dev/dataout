import { createWorkerClient } from './workerClient'

export { NO_SESSION, SqlStopped, SqlTimeout, isStopped } from './workerClient'

export const createGitClient = (options) =>
  createWorkerClient(() => new Worker(new URL('../workers/gitWorker.js', import.meta.url), { type: 'module' }), options)

let shared
export const sharedGit = () => (shared ??= createGitClient({ subject: 'command', timeoutMs: 10000 }))
