import { v4 as uuid } from 'uuid'
import { Task } from '../types'
import { useBottomSheet } from './useBottomSheet'
import { useTaskForm } from './useTaskForm'
import { useTasks } from './useTasks'

const initialTaskState: Task = {
  id: '',
  title: '',
  completed: false,
  isTask: true,
}

export const useTaskFormManager = () => {
  const { currentTask, updateCurrentTask, resetCurrentTask } = useTaskForm()
  const { showBottomSheet, hideBottomSheet } = useBottomSheet()
  const { addTask } = useTasks()

  const handleSubmit = () => {
    if (currentTask.title?.trim()) {
      const taskToCreate = {
        ...initialTaskState,
        id: uuid(),
        title: currentTask.title.trim(),
        completed: false,
        scheduledAt: currentTask.scheduledAt,
        tags: currentTask.tags,
      }
      addTask(taskToCreate)
      hideBottomSheet()
      resetCurrentTask() // Reset form after submission
    }
  }

  const openCalendarSheet = () => {
    showBottomSheet('calendar')
  }

  const openTagSuggestionsSheet = () => {
    showBottomSheet('tagSuggestions')
  }

  return {
    currentTask,
    updateCurrentTask,
    handleSubmit,
    openCalendarSheet,
    openTagSuggestionsSheet,
  }
}
