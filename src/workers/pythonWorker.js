import prelude from './python/prelude.py?raw'

const PYODIDE_VERSION = 'v314.0.7'
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`

let pyodideReady

function boot() {
  return (async () => {
    const { loadPyodide } = await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`)
    const py = await loadPyodide({ indexURL: INDEX_URL })
    py.runPython(prelude)
    return py
  })().catch((err) => {
    pyodideReady = undefined
    throw new Error(`Python couldn't be downloaded. Check your connection and try again. (${err?.message ?? err})`)
  })
}

const ensure = () => (pyodideReady ??= boot())

function callPython(py, name, args) {
  const fn = py.globals.get(name)
  const converted = args.map((arg) => (arg === null ? undefined : typeof arg === 'object' ? py.toPy(arg) : arg))
  const proxy = fn(...converted)
  try {
    return proxy?.toJs ? proxy.toJs({ dict_converter: Object.fromEntries }) : proxy
  } finally {
    proxy?.destroy?.()
    for (const arg of converted) arg?.destroy?.()
    fn.destroy()
  }
}

const handlers = {
  async 'py.init'() {
    const py = await ensure()
    return { version: py.version }
  },

  async 'py.mount'({ id, bytes }) {
    const py = await ensure()
    py.FS.mkdirTree('/data')
    py.FS.writeFile(`/data/${id}.sqlite`, bytes)
  },

  async 'py.prepare'({ source }) {
    const py = await ensure()
    try {
      await py.loadPackagesFromImports(source)
    } catch (err) {
      throw new Error(`Couldn't load a package this code imports: ${err?.message ?? err}`)
    }
    return { heavy: py.globals.get('_uses_packages')(source) }
  },

  async 'py.reset'({ session }) {
    const py = await ensure()
    py.globals.get('_reset')(session)
  },

  async 'py.grade'({ mode, code, solution, cases, checkOutput }) {
    const py = await ensure()
    if (mode === 'variables') return callPython(py, '_grade_vars', [code, solution, cases])
    return callPython(py, '_grade', [code, solution, cases, checkOutput ?? false])
  },

  async 'py.samples'({ mode, code, solution, exprs, checkOutput }) {
    const py = await ensure()
    if (mode === 'variables') return callPython(py, '_samples_vars', [code, solution, exprs])
    return callPython(py, '_samples', [code, solution, exprs, checkOutput ?? false])
  },

  async 'py.challenge'({ given, code, reference, unordered }) {
    const py = await ensure()
    return callPython(py, '_challenge', [given ?? '', code, reference ?? null, unordered ?? false])
  },

  async 'py.run'({ session, source, filename }) {
    const py = await ensure()
    const run = py.globals.get('_run')
    const proxy = run(session, source, filename)
    try {
      return proxy.toJs({ dict_converter: Object.fromEntries })
    } finally {
      proxy.destroy()
      run.destroy()
    }
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
