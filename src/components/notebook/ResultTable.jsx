function formatValue(value) {
  if (value === null) return <span className="italic text-placeholder">NULL</span>
  if (value instanceof Uint8Array) return <span className="italic text-caption">[{value.length} bytes]</span>
  return String(value)
}

function ResultTable({ columns, rows, totalRows, truncated }) {
  return (
    <div>
      <div className="max-h-96 overflow-auto rounded-xl border border-heading/10 bg-surface">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap bg-cream px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-caption"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((value, c) => (
                  <td
                    key={c}
                    className={`whitespace-nowrap border-t border-heading/5 px-3 py-2 text-body-text ${
                      typeof value === 'number' ? 'text-right tabular-nums' : ''
                    }`}
                  >
                    {formatValue(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-1.5 text-xs text-body-text">
        {truncated
          ? `Showing the first ${rows.length.toLocaleString()} of ${totalRows.toLocaleString()} rows`
          : `${totalRows.toLocaleString()} row${totalRows === 1 ? '' : 's'}`}
      </p>
    </div>
  )
}

export default ResultTable
