import React, { createContext, useCallback, useState } from 'react'
import { Task } from '../types'

interface TaskFormContextType {
  currentTask: Partial<Task>
  updateCurrentTask: (changes: Partial<Task>) => void
  resetCurrentTask: () => void
}

export const TaskFormContext = createContext<TaskFormContextType | undefined>(
  undefined,
)

export const TaskFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    tags: [],
    reminders: [],
  })

  const updateCurrentTask = useCallback((changes: Partial<Task>) => {
    setCurrentTask((prev) => ({ ...prev, ...changes }))
  }, [])

  const resetCurrentTask = useCallback(() => {
    setCurrentTask({
      title: '',
      description: '',
      tags: [],
      reminders: [],
    })
  }, [])

  return (
    <TaskFormContext.Provider
      value={{
        currentTask,
        updateCurrentTask,
        resetCurrentTask,
      }}
    >
      {children}
    </TaskFormContext.Provider>
  )
}
