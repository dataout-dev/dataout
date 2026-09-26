import { createWorkerClient } from './workerClient'

export const PYTHON_TIMEOUT_MS = 30000
export const PYTHON_STARTUP_TIMEOUT_MS = 180000

export const createPythonClient = (options) =>
  createWorkerClient(() => new Worker(new URL('../workers/pythonWorker.js', import.meta.url), { type: 'module' }), {
    timeoutMs: PYTHON_TIMEOUT_MS,
    subject: 'code',
    ...options,
  })
