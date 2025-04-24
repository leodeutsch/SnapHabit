import { Habit } from './habit.type'
import { Tag } from './tag.type'
import { Task } from './task.type'

export type BottomSheetContent =
  | 'addTask'
  | 'calendar'
  | 'tag'
  | 'tagSuggestions'
  | 'taskDetails'
  | 'addHabit'
  | 'habitDay'
  | 'habitDetails'
  | null

export interface BottomSheetData {
  tag?: Tag
  task?: Task
  habit?: Habit
  returnTo?: BottomSheetContent
  source?: any
}

export interface BottomSheetContextType {
  isVisible: boolean
  content: BottomSheetContent
  data: BottomSheetData | null
  showBottomSheet: (content: BottomSheetContent, data?: BottomSheetData) => void
  hideBottomSheet: () => void
}
