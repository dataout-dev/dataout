import initSqlJs from 'sql.js'

let sqlModule
export const loadSql = () => (sqlModule ??= initSqlJs({ locateFile: () => '/sql-wasm.wasm' }))
