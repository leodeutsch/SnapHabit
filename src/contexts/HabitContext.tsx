import React, { createContext, useEffect, useState } from 'react'
import {
  addHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from '../services/habitService'
import { Habit } from '../types'

interface HabitContextType {
  habits: Habit[]
  loadHabits: () => void
  addHabit: (habit: Habit) => void
  updateHabit: (habit: Habit) => void
  deleteHabit: (id: string) => void
}

export const HabitContext = createContext<HabitContextType>({
  habits: [],
  loadHabits: () => {},
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
})

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    handleLoadHabits()
  }, [])

  const handleLoadHabits = async () => {
    const storedHabits = await getHabits()
    setHabits(storedHabits)
  }

  const handleAddHabit = async (habit: Habit) => {
    const newHabits = await addHabit(habit)
    setHabits(newHabits)
  }

  const handleUpdateHabit = async (habit: Habit) => {
    const newHabits = await updateHabit(habit)
    setHabits(newHabits)
  }

  const handleDeleteHabit = async (id: string) => {
    const newHabits = await deleteHabit(id)
    setHabits(newHabits)
  }

  return (
    <HabitContext.Provider
      value={{
        habits,
        loadHabits: handleLoadHabits,
        addHabit: handleAddHabit,
        updateHabit: handleUpdateHabit,
        deleteHabit: handleDeleteHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  )
}
