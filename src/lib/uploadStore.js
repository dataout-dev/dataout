export const MAX_UPLOADS = 10
export const MAX_TOTAL_UPLOAD_BYTES = 60 * 1024 * 1024

const DB_NAME = 'dataout'
const STORE = 'uploads'

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('This browser does not allow saving files.'))
      return
    }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open browser storage.'))
  })
}

async function run(mode, makeRequest) {
  const db = await openDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, mode)
      const request = makeRequest(transaction.objectStore(STORE))
      transaction.oncomplete = () => resolve(request.result)
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error ?? new Error('Saving was cancelled.'))
    })
  } finally {
    db.close()
  }
}

export async function listUploads() {
  const all = await run('readonly', (store) => store.getAll())
  return all.sort((a, b) => a.addedAt - b.addedAt)
}

export const saveUpload = (record) => run('readwrite', (store) => store.put(record))

export const deleteUpload = (id) => run('readwrite', (store) => store.delete(id))
