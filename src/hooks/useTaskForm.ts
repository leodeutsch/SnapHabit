import { useContext } from 'react'
import { TaskFormContext } from '../contexts/TaskFormContext'

export const useTaskForm = () => {
  const context = useContext(TaskFormContext)
  if (context === undefined) {
    throw new Error('useTaskForm must be used within a TaskFormProvider')
  }
  return context
}
