import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInYears,
  format,
} from 'date-fns'
import { Text } from 'react-native'
import { Task } from '../types'

export const dueDateRender = (task: Task, styles: any) => {
  if (!task.scheduledAt) return null

  const now = new Date()
  const reminderDate = new Date(task.scheduledAt)
  const diffMinutes = differenceInMinutes(reminderDate, now)
  const diffHours = differenceInHours(reminderDate, now)
  const diffDays = differenceInDays(reminderDate, now)
  const diffYears = differenceInYears(reminderDate, now)

  if (diffMinutes < 0) return <Text style={styles.reminderText}>Past due</Text>

  if (diffMinutes < 60) {
    return (
      <Text
        style={styles.reminderText}
      >{`In ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`}</Text>
    )
  }

  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60
    return (
      <Text
        style={styles.reminderText}
      >{`In ${diffHours}h ${remainingMinutes}m`}</Text>
    )
  }

  if (diffDays < 7) {
    if (diffDays === 0) return <Text style={styles.reminderText}>Today</Text>
    if (diffDays === 1) return <Text style={styles.reminderText}>Tomorrow</Text>
    return <Text style={styles.reminderText}>{`In ${diffDays} days`}</Text>
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return (
      <Text
        style={styles.reminderText}
      >{`In ${weeks} week${weeks !== 1 ? 's' : ''}`}</Text>
    )
  }

  if (diffYears < 1) {
    return (
      <Text style={styles.reminderText}>{format(reminderDate, 'MMM d')}</Text>
    )
  }

  return (
    <Text style={styles.reminderText}>
      {format(reminderDate, 'MMM d, yyyy')}
    </Text>
  )
}
