export function isLessonUnlocked(subjectLessons, index, completedIds) {
  if (completedIds.has(subjectLessons[index].id)) return true
  return subjectLessons.slice(0, index).every((l) => completedIds.has(l.id))
}
