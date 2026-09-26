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
