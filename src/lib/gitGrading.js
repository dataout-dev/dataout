import { sharedGit } from './gitWorkerClient'

export const seedSession = (session, seed) => sharedGit().call('git.seed', { session, spec: seed })
export const execCommand = (session, line) => sharedGit().call('git.exec', { session, line })
export const checkCases = (session, cases) => sharedGit().call('git.check', { session, cases })
export const readWorkingFile = (session, path) => sharedGit().call('git.file.read', { session, path })
export const writeWorkingFile = (session, path, content) => sharedGit().call('git.file.write', { session, path, content })
export const removeWorkingFile = (session, path) => sharedGit().call('git.file.remove', { session, path })
export const listWorkingFiles = (session) => sharedGit().call('git.file.list', { session })
export const repoState = (session) => sharedGit().call('git.state', { session })
