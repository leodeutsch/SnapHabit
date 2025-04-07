import { useContext } from 'react'
import { HabitContext } from '../contexts/HabitContext'

export const useHabits = () => {
  const context = useContext(HabitContext)
  if (!context) {
    throw new Error('useTasks must be used within a HabitsProvider')
  }
  return context
}
