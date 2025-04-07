import { Reminder } from './reminder.type'
import { Tag } from './tag.type'

export interface Task {
  id: string
  // icon: string
  title: string
  description?: string
  subTasks?: string[]
  reminders?: Reminder[]
  scheduledAt?: string
  completed: boolean
  completedAt?: string
  tags?: Tag[]
}
