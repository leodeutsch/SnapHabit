import { useContext } from 'react'
import { HabitFormContext } from '../contexts/HabitFormContext'

export const useHabitForm = () => {
  const context = useContext(HabitFormContext)
  if (context === undefined) {
    throw new Error('useHabitForm must be used within a HabitFormProvider')
  }
  return context
}
