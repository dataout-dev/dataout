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
  'python:tier:data': 1,
  'python:tier:pro': 1,
  'python:tier:algo': 0,

  'git:tier:foundations': 0,
  'git:tier:branching': 1,
  'git:tier:remotes': 0,
  'git:tier:advanced': 0,

  'stats:tier:descriptive': 0,
  'stats:tier:probability': 0,
  'stats:tier:inferential': 1,
  'stats:tier:relationships': 1,

  'eda:project:eda-titanic': 0,
  'eda:project:eda-online-retail': 1,
  'eda:project:eda-adult-census': 1,
  'eda:project:eda-airbnb-asheville': 1,
  'eda:project:eda-openfoodfacts': 0,
  'eda:project:eda-world-dev-indicators': 1,
  'eda:project:eda-student-performance': 1,
  'eda:project:eda-storm-events': 1,

  'ml:project:ml-titanic': 0,
  'ml:project:ml-adult-census': 1,
  'ml:project:ml-airbnb-asheville': 1,
  'ml:project:ml-student-performance': 1,
  'ml:project:ml-world-dev-indicators': 0,
  'ml:project:ml-openfoodfacts': 1,
  'ml:project:ml-online-retail': 1,
  'ml:project:ml-storm-events': 1,
}
