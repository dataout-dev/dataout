import { createWorkerClient } from './workerClient'

export { NO_SESSION, SqlStopped, SqlTimeout, isStopped } from './workerClient'

export const createSqlClient = (options) =>
  createWorkerClient(() => new Worker(new URL('../workers/sqlWorker.js', import.meta.url), { type: 'module' }), options)

let shared
export const sharedSql = () => (shared ??= createSqlClient())
