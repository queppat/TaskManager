export function formatTaskTitle(title) {
  if (!title) return 'Untitled'
  return title.trim()
}

export function isTaskCompleted(task) {
  return task?.status === 'completed'
}