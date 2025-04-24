import { Reminder } from './reminder.type'
import { Tag } from './tag.type'

export interface SubTask {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  subTasks?: SubTask[]
  reminders?: Reminder[]
  scheduledAt?: string
  isAllDay?: boolean
  completed: boolean
  completedAt?: string
  tags?: Tag[]
  isTask: true

  // TODO: implement latter
  priority?: 'low' | 'medium' | 'high'
}
