import React, { createContext, useState } from 'react'
import { Habit } from '../types'

interface HabitFormContextType {
  currentHabit: Partial<Habit>
  updateCurrentHabit: (updates: Partial<Habit>) => void
  resetCurrentHabit: () => void
  isFormExpanded: boolean
  setFormExpanded: (expanded: boolean) => void
}

export const HabitFormContext = createContext<HabitFormContextType | undefined>(
  undefined,
)

export const HabitFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentHabit, setCurrentHabit] = useState<Partial<Habit>>({})
  const [isFormExpanded, setIsFormExpanded] = useState(false)

  const updateCurrentHabit = (updates: Partial<Habit>) => {
    setCurrentHabit((prev) => ({ ...prev, ...updates }))
  }

  const resetCurrentHabit = () => {
    setCurrentHabit({})
    setIsFormExpanded(false)
  }

  const setFormExpanded = (expanded: boolean) => {
    setIsFormExpanded(expanded)
  }

  return (
    <HabitFormContext.Provider
      value={{
        currentHabit,
        updateCurrentHabit,
        resetCurrentHabit,
        isFormExpanded,
        setFormExpanded,
      }}
    >
      {children}
    </HabitFormContext.Provider>
  )
}
