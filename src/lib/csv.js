export function decodeBytes(bytes) {
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return { text: text.replace(/^﻿/, ''), encoding: 'UTF-8' }
  } catch {
    return { text: new TextDecoder('windows-1252').decode(bytes), encoding: 'Windows-1252' }
  }
}

function countOutsideQuotes(line, char) {
  let inQuotes = false
  let count = 0
  for (const c of line) {
    if (c === '"') inQuotes = !inQuotes
    else if (c === char && !inQuotes) count++
  }
  return count
}

export function detectDelimiter(text) {
  const lines = text.split(/\r\n|\n|\r/).filter((line) => line.trim() !== '').slice(0, 6)
  if (lines.length === 0) return ','

  let best = ','
  let bestScore = 0
  for (const candidate of [',', ';', '\t', '|']) {
    const counts = lines.map((line) => countOutsideQuotes(line, candidate))
    const headerCount = counts[0]
    if (headerCount === 0) continue
    const consistent = counts.filter((n) => n === headerCount).length
    const score = consistent * 1000 + headerCount
    if (score > bestScore) {
      best = candidate
      bestScore = score
    }
  }
  return best
}

export function parseCsv(text, delimiter = ',') {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  const endRow = () => {
    row.push(field)
    field = ''
    if (!(row.length === 1 && row[0].trim() === '')) rows.push(row)
    row = []
  }

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += c
    } else if (c === '"' && field === '') inQuotes = true // only a quote at the start of a field opens quotes
    else if (c === delimiter) {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      endRow()
    } else field += c
  }

  if (field !== '' || row.length) endRow()
  return rows
}
