export type WeekDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export type RepeatPattern = 'daily' | 'weekly' | 'monthly' | 'none'

export type ReminderOption =
  | 'on time'
  | '5 minutes before'
  | '10 minutes before'
  | '30 minutes before'
  | '1 hour before'
  | '2 hours before'
  | 'day before at 9am'
  | 'custom'

export interface Reminder {
  id: string
  type: ReminderOption
  customValue?: number
  customUnit?: 'minutes' | 'hours' | 'days'
}
