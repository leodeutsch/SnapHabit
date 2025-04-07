export const formatHabitSchedule = (scheduledAt?: string[]) => {
  if (!scheduledAt || scheduledAt.length === 0) return 'Set schedule'

  return `${scheduledAt.length} ${scheduledAt.length > 1 ? 'days' : 'day'} a week`
}
