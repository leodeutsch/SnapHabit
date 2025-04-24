import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInYears,
  format,
} from 'date-fns'
import { Text } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { Task } from '../types'

export function dueDateRender(
  task?: Task,
  styles?: any,
  theme?: MD3Theme,
): JSX.Element | null {
  if (!task || !task.scheduledAt) return null

  // When a task is marked as all-day, scheduledAt will be a date-only string (YYYY-MM-DD)
  const scheduledDate =
    task.isAllDay && !task.scheduledAt.includes('T')
      ? new Date(
          parseInt(task.scheduledAt.slice(0, 4), 10),
          parseInt(task.scheduledAt.slice(5, 7), 10) - 1,
          parseInt(task.scheduledAt.slice(8, 10), 10),
        )
      : new Date(task.scheduledAt)

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const scheduledDay = new Date(
    scheduledDate.getFullYear(),
    scheduledDate.getMonth(),
    scheduledDate.getDate(),
  )
  const diffMinutes = differenceInMinutes(scheduledDate, now) // Compare with current time for timed tasks
  const diffDays = differenceInDays(scheduledDay, today)

  // Handle all-day tasks
  if (task.isAllDay) {
    if (diffDays < 0)
      return (
        <Text
          style={[
            styles.reminderText,
            theme && {
              backgroundColor: theme.colors.errorContainer,
              color: theme.colors.onErrorContainer,
            },
          ]}
        >
          Past Due
        </Text>
      )
    if (diffDays === 0) return <Text style={styles.reminderText}>Today</Text>
    if (diffDays === 1) return <Text style={styles.reminderText}>Tomorrow</Text>
    return (
      <Text style={styles.reminderText}>
        {format(scheduledDate, 'MMM d, yyyy')}
      </Text>
    )
  }

  // Handle non-all-day (timed) tasks
  if (diffMinutes < 0) {
    return (
      <Text
        style={[
          styles.reminderText,
          theme && {
            backgroundColor: theme.colors.errorContainer,
            color: theme.colors.onErrorContainer,
          },
        ]}
      >
        Past due
      </Text>
    )
  }

  // Check if the task is scheduled for today
  if (scheduledDay.getTime() === today.getTime()) {
    const timeStr = format(scheduledDate, 'h:mm a')
    return <Text style={styles.reminderText}>Today at {timeStr}</Text>
  }

  if (diffMinutes < 60) {
    return (
      <Text style={styles.reminderText}>
        {`In ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`}
      </Text>
    )
  }

  if (differenceInHours(scheduledDate, now) < 24) {
    const diffHours = differenceInHours(scheduledDate, now)
    const remainingMinutes = diffMinutes % 60
    return (
      <Text style={styles.reminderText}>
        {`In ${diffHours}h ${remainingMinutes}m`}
      </Text>
    )
  }

  if (diffDays < 7) {
    if (diffDays === 1) return <Text style={styles.reminderText}>Tomorrow</Text>
    return <Text style={styles.reminderText}>{`In ${diffDays} days`}</Text>
  }

  if (differenceInYears(scheduledDate, now) < 1) {
    return (
      <Text style={styles.reminderText}>{format(scheduledDate, 'MMM d')}</Text>
    )
  }

  return (
    <Text style={styles.reminderText}>
      {format(scheduledDate, 'MMM d, yyyy')}
    </Text>
  )
}
