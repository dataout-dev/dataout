import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'
import { tiers, tierProjects } from '../src/data/curriculum/index.js'
import { createRealChecker } from './lib/checkReal.mjs'

const root = path.resolve(import.meta.dirname, '..')
const SQL = await initSqlJs()
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/datasets/manifest.json'), 'utf8'))

let problems = 0
let checked = 0
const fail = (where, msg) => {
  problems++
  console.log(`  FAIL ${where}: ${msg}`)
}

const { checkReal: checkRealShared, datasetBytes } = createRealChecker({ root, manifest, fail })
const checkReal = (where, real) => checkRealShared(SQL, where, real)

const ids = new Set()
for (const tier of tiers) {
  const projects = tierProjects(tier.id)
  if (projects.length === 0) continue
  console.log(`\n== ${tier.name}`)

  for (const project of projects) {
    const where = project.id
    if (ids.has(project.id)) fail(where, 'duplicate project id')
    ids.add(project.id)
    for (const key of ['id', 'kind', 'title', 'blurb', 'dataset']) {
      if (!project[key] && key !== 'dataset') fail(where, `missing ${key}`)
    }
    if (!['guided', 'unguided'].includes(project.kind)) fail(where, `kind must be 'guided' or 'unguided', got ${project.kind}`)

    if (project.kind === 'guided') {
      if (!project.intro) fail(where, 'missing intro')
      if (!Array.isArray(project.parts) || project.parts.length === 0) fail(where, 'a guided project needs at least one part')
      else {
        const partIds = new Set()
        const shapes = project.parts.map((part, i) => {
          checked += 1
          const partWhere = `${where} [part ${i + 1}: ${part.id}]`
          if (partIds.has(part.id)) fail(partWhere, 'duplicate part id')
          partIds.add(part.id)
          if (!part.title) fail(partWhere, 'missing title')
          return checkReal(partWhere, part) ?? '?'
        })
        console.log(`${project.id.padEnd(30)} guided  parts ${shapes.join(' ')}`)
      }
    } else {
      checked += 1
      if (!datasetBytes(project.dataset)) fail(where, `unknown dataset ${project.dataset}`)
      if (!project.brief) fail(where, 'missing brief')
      if (project.reference) fail(where, 'an unguided project should not have a reference (nothing to auto-grade)')
      if (!Array.isArray(project.checklist) || project.checklist.length === 0) fail(where, 'needs a non-empty checklist')
      else if (project.checklist.some((item) => typeof item !== 'string' || !item.trim())) fail(where, 'checklist items must be non-empty strings')
      console.log(`${project.id.padEnd(30)} unguided  checklist ${project.checklist?.length ?? 0} items`)
    }
  }
}

console.log(`\nChecked ${checked} items across ${ids.size} projects.`)
if (problems > 0) {
  console.log(`${problems} problem${problems === 1 ? '' : 's'} found.`)
  process.exit(1)
}
console.log('All OK')
