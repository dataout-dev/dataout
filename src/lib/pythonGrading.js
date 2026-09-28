import { fetchDatasetBytes, fetchManifest } from './datasets'
import { PYTHON_STARTUP_TIMEOUT_MS, sharedPython } from './pythonClient'

const PACKAGE_TIMEOUT_MS = 180000
const LIBRARY_RUN_TIMEOUT_MS = 120000
const GRADE_TIMEOUT_MS = 20000

export function warmUpPython() {
  sharedPython()
    .call('py.init', {}, { timeout: PYTHON_STARTUP_TIMEOUT_MS })
    .catch(() => {})
}

export async function mountDataset(datasetId) {
  const datasets = await fetchManifest()
  const meta = datasets.find((d) => d.id === datasetId)
  if (!meta) throw new Error(`The dataset "${datasetId}" isn't available.`)
  const bytes = await fetchDatasetBytes(meta)
  await sharedPython().call('py.mount', { id: datasetId, bytes }, { remember: `mount:${datasetId}`, timeout: PYTHON_STARTUP_TIMEOUT_MS })
  return meta
}

export async function runSnippet(session, source, filename = '<example>') {
  const client = sharedPython()
  const { heavy } = await client.call('py.prepare', { source }, { timeout: PACKAGE_TIMEOUT_MS })
  return client.call('py.run', { session, source, filename }, heavy ? { timeout: LIBRARY_RUN_TIMEOUT_MS } : {})
}

export const resetSession = (session) => sharedPython().call('py.reset', { session })

export async function gradePractice(practice, code) {
  const client = sharedPython()
  await client.call('py.prepare', { source: code }, { timeout: PACKAGE_TIMEOUT_MS })
  return client.call(
    'py.grade',
    { mode: practice.mode, code, solution: practice.solution, cases: practice.cases, checkOutput: practice.checkOutput },
    { timeout: GRADE_TIMEOUT_MS }
  )
}

export async function runSamples(practice, code) {
  const client = sharedPython()
  await client.call('py.prepare', { source: code }, { timeout: PACKAGE_TIMEOUT_MS })
  return client.call(
    'py.samples',
    { mode: practice.mode, code, solution: practice.solution, exprs: practice.samples, checkOutput: practice.checkOutput },
    { timeout: GRADE_TIMEOUT_MS }
  )
}

export async function runChallenge({ given, code, reference, unordered }) {
  const client = sharedPython()
  await client.call('py.prepare', { source: `${given ?? ''}\n${code}` }, { timeout: PACKAGE_TIMEOUT_MS })
  return client.call('py.challenge', { given, code, reference, unordered }, { timeout: GRADE_TIMEOUT_MS })
}

export const failureMessages = {
  error: () => 'Your code raised an error before it finished. Read the error below, fix it and try again.',
  missing: () => 'Your code ran, but it did not store its result in a variable named answer.',
  type: (r) => `answer has the wrong kind of value. The task expects a ${r.expected_type}.`,
  size: () => 'The kind of value is right, but it has the wrong number of items. Check your conditions and your loop.',
  order: () => 'Right values, wrong order. Re-read how the task wants them ordered.',
  value: () => 'Right shape, but some values are off. Check your conditions, calculations and rounding.',
}
