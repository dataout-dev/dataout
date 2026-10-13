import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'
import { parseCsv } from '../src/lib/csv.js'

// Builds the SQLite files for the Exploratory Data Analysis path's 8 project
// datasets. These are deliberately NOT cleaned — messy columns are kept TEXT
// so sentinel values ("?", "$1,200", "40.00K") survive exactly as scraped.
// See public/datasets/manifest.json for what each one's real messiness is.

const dir = process.argv[2]
if (!dir) {
  console.error('Usage: node scripts/build-eda-datasets.mjs "<folder with the downloaded/prepared files>"')
  process.exit(1)
}

const outDir = path.resolve(import.meta.dirname, '..', 'public', 'datasets')
const SQL = await initSqlJs()

const readCsv = (name, delimiter = ',') => {
  const [header, ...rows] = parseCsv(fs.readFileSync(path.join(dir, name), 'utf8'), delimiter)
  return { header, rows: rows.filter((r) => r.length === header.length) }
}

const cell = (value, type) => {
  if (value === 'NA' || value === '') return null
  if (type === 'TEXT') return value
  const n = Number(value)
  if (!Number.isFinite(n)) throw new Error(`"${value}" is not a number`)
  return n
}

function tableFromCsv(db, name, csv, columns, { extra = [], keep = () => true, prepend } = {}) {
  const index = Object.fromEntries(csv.header.map((h, i) => [h, i]))
  const defs = columns.map(([col, type]) => `${col} ${type}`)
  if (prepend) defs.unshift(prepend.def)
  for (const [col, type] of extra) defs.push(`${col} ${type}`)
  db.run(`CREATE TABLE ${name} (${defs.join(', ')});`)

  const width = defs.length
  const insert = db.prepare(`INSERT INTO ${name} VALUES (${Array(width).fill('?').join(',')})`)
  let count = 0
  db.run('BEGIN')
  csv.rows.forEach((row, i) => {
    if (!keep(row, i, index)) return
    const values = columns.map(([col, type]) => cell(row[index[col]], type))
    if (prepend) values.unshift(prepend.value(count))
    for (const [, , compute] of extra) values.push(compute(row, index))
    insert.run(values)
    count++
  })
  db.run('COMMIT')
  insert.free()
  return count
}

function save(db, file) {
  db.run('VACUUM')
  const bytes = db.export()
  fs.writeFileSync(path.join(outDir, file), Buffer.from(bytes))
  console.log(`${file}: ${(bytes.length / 1024).toFixed(0)} KB`)
  db.close()
}

{
  const db = new SQL.Database()
  const titanic = readCsv('titanic.csv')
  console.log('titanic:', tableFromCsv(db, 'titanic', titanic, [
    ['PassengerId', 'INTEGER'], ['Survived', 'INTEGER'], ['Pclass', 'INTEGER'], ['Name', 'TEXT'],
    ['Sex', 'TEXT'], ['Age', 'REAL'], ['SibSp', 'INTEGER'], ['Parch', 'INTEGER'], ['Ticket', 'TEXT'],
    ['Fare', 'REAL'], ['Cabin', 'TEXT'], ['Embarked', 'TEXT'],
  ]))
  save(db, 'titanic.sqlite')
}

{
  const db = new SQL.Database()
  const retail = readCsv('online_retail.csv')
  console.log('online_retail:', tableFromCsv(db, 'online_retail', retail, [
    ['InvoiceNo', 'TEXT'], ['StockCode', 'TEXT'], ['Description', 'TEXT'], ['Quantity', 'INTEGER'],
    ['InvoiceDate', 'TEXT'], ['UnitPrice', 'REAL'], ['CustomerID', 'TEXT'], ['Country', 'TEXT'],
  ]))
  save(db, 'online-retail.sqlite')
}

{
  const db = new SQL.Database()
  const adult = readCsv('adult.csv')
  console.log('adult:', tableFromCsv(db, 'adult', adult, [
    ['age', 'INTEGER'], ['workclass', 'TEXT'], ['fnlwgt', 'INTEGER'], ['education', 'TEXT'],
    ['education_num', 'INTEGER'], ['marital_status', 'TEXT'], ['occupation', 'TEXT'],
    ['relationship', 'TEXT'], ['race', 'TEXT'], ['sex', 'TEXT'], ['capital_gain', 'INTEGER'],
    ['capital_loss', 'INTEGER'], ['hours_per_week', 'INTEGER'], ['native_country', 'TEXT'], ['income', 'TEXT'],
  ]))
  save(db, 'adult-census.sqlite')
}

{
  const db = new SQL.Database()
  const studentCols = [
    ['school', 'TEXT'], ['sex', 'TEXT'], ['age', 'INTEGER'], ['address', 'TEXT'], ['famsize', 'TEXT'],
    ['Pstatus', 'TEXT'], ['Medu', 'INTEGER'], ['Fedu', 'INTEGER'], ['Mjob', 'TEXT'], ['Fjob', 'TEXT'],
    ['reason', 'TEXT'], ['guardian', 'TEXT'], ['traveltime', 'INTEGER'], ['studytime', 'INTEGER'],
    ['failures', 'INTEGER'], ['schoolsup', 'TEXT'], ['famsup', 'TEXT'], ['paid', 'TEXT'],
    ['activities', 'TEXT'], ['nursery', 'TEXT'], ['higher', 'TEXT'], ['internet', 'TEXT'],
    ['romantic', 'TEXT'], ['famrel', 'INTEGER'], ['freetime', 'INTEGER'], ['goout', 'INTEGER'],
    ['Dalc', 'INTEGER'], ['Walc', 'INTEGER'], ['health', 'INTEGER'], ['absences', 'INTEGER'],
    ['G1', 'INTEGER'], ['G2', 'INTEGER'], ['G3', 'INTEGER'],
  ]
  const mat = readCsv('student-mat.csv', ';')
  console.log('student_math:', tableFromCsv(db, 'student_math', mat, studentCols))
  const por = readCsv('student-por.csv', ';')
  console.log('student_portuguese:', tableFromCsv(db, 'student_portuguese', por, studentCols))
  save(db, 'student-performance.sqlite')
}

{
  const db = new SQL.Database()
  const wdi = readCsv('world_dev_indicators.csv')
  console.log('world_dev_indicators:', tableFromCsv(db, 'world_dev_indicators', wdi, [
    ['country', 'TEXT'], ['country_code', 'TEXT'], ['year', 'INTEGER'], ['gdp_per_capita_usd', 'REAL'],
    ['life_expectancy_years', 'REAL'], ['population', 'REAL'], ['co2_per_capita_tonnes', 'REAL'],
    ['poverty_rate_pct', 'REAL'],
  ]))
  save(db, 'world-dev-indicators.sqlite')
}

{
  const db = new SQL.Database()
  const storms = readCsv('storm_events_subset.csv')
  console.log('storm_events:', tableFromCsv(db, 'storm_events', storms, [
    ['STATE', 'TEXT'], ['YEAR', 'INTEGER'], ['MONTH_NAME', 'TEXT'], ['EVENT_TYPE', 'TEXT'],
    ['CZ_NAME', 'TEXT'], ['BEGIN_DATE_TIME', 'TEXT'], ['END_DATE_TIME', 'TEXT'],
    ['INJURIES_DIRECT', 'INTEGER'], ['INJURIES_INDIRECT', 'INTEGER'], ['DEATHS_DIRECT', 'INTEGER'],
    ['DEATHS_INDIRECT', 'INTEGER'], ['DAMAGE_PROPERTY', 'TEXT'], ['DAMAGE_CROPS', 'TEXT'],
    ['SOURCE', 'TEXT'], ['MAGNITUDE', 'REAL'], ['TOR_F_SCALE', 'TEXT'], ['BEGIN_LAT', 'REAL'],
    ['BEGIN_LON', 'REAL'], ['EVENT_NARRATIVE', 'TEXT'],
  ]))
  save(db, 'storm-events.sqlite')
}

{
  const db = new SQL.Database()
  const listings = readCsv('asheville_subset.csv')
  console.log('airbnb_listings:', tableFromCsv(db, 'airbnb_listings', listings, [
    ['id', 'TEXT'], ['name', 'TEXT'], ['host_id', 'TEXT'], ['host_name', 'TEXT'], ['host_location', 'TEXT'],
    ['host_is_superhost', 'TEXT'], ['neighbourhood_cleansed', 'TEXT'], ['latitude', 'REAL'],
    ['longitude', 'REAL'], ['property_type', 'TEXT'], ['room_type', 'TEXT'], ['accommodates', 'INTEGER'],
    ['bathrooms_text', 'TEXT'], ['bedrooms', 'REAL'], ['beds', 'REAL'], ['price', 'TEXT'],
    ['minimum_nights', 'INTEGER'], ['number_of_reviews', 'INTEGER'], ['first_review', 'TEXT'],
    ['last_review', 'TEXT'], ['review_scores_rating', 'REAL'], ['review_scores_cleanliness', 'REAL'],
  ]))
  save(db, 'airbnb-asheville.sqlite')
}

if (fs.existsSync(path.join(dir, 'openfoodfacts.csv'))) {
  const db = new SQL.Database()
  const off = readCsv('openfoodfacts.csv')
  console.log('openfoodfacts:', tableFromCsv(db, 'openfoodfacts', off, [
    ['code', 'TEXT'], ['product_name', 'TEXT'], ['brands', 'TEXT'], ['categories', 'TEXT'],
    ['labels', 'TEXT'], ['quantity', 'TEXT'], ['ingredients_text', 'TEXT'], ['nova_group', 'REAL'],
    ['nutriscore_grade', 'TEXT'], ['nutriscore_score', 'REAL'], ['energy_kcal_100g', 'REAL'],
    ['sugars_100g', 'REAL'], ['fat_100g', 'REAL'], ['proteins_100g', 'REAL'], ['salt_100g', 'REAL'],
    ['completeness', 'REAL'], ['last_modified_t', 'REAL'],
  ]))
  save(db, 'openfoodfacts.sqlite')
} else {
  console.log('openfoodfacts.csv not found yet, skipping (run again once it is ready)')
}
