// What's free (0) vs. subscribers-only (1), by tier and by SQL capstone project.
// Edit and deploy (git push) to change what's gated — there's no admin page or
// database table for this; this file IS the source of truth.
export const premiumContent = {
  'sql:tier:beginner': 0,
  'sql:tier:intermediate': 0,
  'sql:tier:advanced': 0,
  'sql:tier:expert': 1,

  'sql:project:project-flights-report': 1,
  'sql:project:project-customer-dashboard': 1,
  'sql:project:project-airline-strategy': 1,
  'sql:project:project-chinook-investigation': 1,

  'python:tier:foundations': 0,
  'python:tier:core': 0,
  'python:tier:oop': 0,
  'python:tier:data': 0,
  'python:tier:pro': 1,
  'python:tier:algo': 0,

  'git:tier:foundations': 0,
  'git:tier:branching': 1,
  'git:tier:remotes': 0,
  'git:tier:advanced': 0,
}
