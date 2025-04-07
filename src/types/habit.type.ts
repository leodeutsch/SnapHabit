import { Reminder } from './reminder.type'
import { Tag } from './tag.type'

export type WeekDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export interface Habit {
  id: string
  // icon: string
  title: string
  description?: string
  reminders?: Reminder[]
  scheduledAt?: WeekDays[]
  concluded?: boolean
  concludedAt?: string
  completed: boolean
  completedAt?: string
  tags?: Tag[]
}
