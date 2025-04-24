import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Task } from '../types'

interface TaskContextType {
  tasks: Task[]
  loadTasks: () => Promise<void>
  addTask: (task: Partial<Task>) => Promise<Task>
  updateTask: (task: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([])

  const loadTasks = useCallback(async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@snaphabit_tasks')
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }, [])

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(
        '@snaphabit_tasks',
        JSON.stringify(updatedTasks),
      )
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }

  const addTask = useCallback(
    async (taskData: Partial<Task>) => {
      const newTask: Task = {
        id: uuid(),
        title: taskData.title || 'New Task',
        description: taskData.description,
        reminders: taskData.reminders || [],
        scheduledAt: taskData.scheduledAt,
        completed: false,
        tags: taskData.tags || [],
        isTask: true,
        isAllDay: true,
      }

      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
      await saveTasks(updatedTasks)
      return newTask
    },
    [tasks],
  )

  const updateTask = useCallback(
    async (updatedTask: Task) => {
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      )
      setTasks(updatedTasks)
      await saveTasks(updatedTasks)
    },
    [tasks],
  )

  const deleteTask = useCallback(
    async (id: string) => {
      const updatedTasks = tasks.filter((task) => task.id !== id)
      setTasks(updatedTasks)
      await saveTasks(updatedTasks)
    },
    [tasks],
  )

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
