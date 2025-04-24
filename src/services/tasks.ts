import AsyncStorage from '@react-native-async-storage/async-storage'
import { Task } from '../types/task.type'

export const updateTaskSchedule = async (taskId: string, newDate: string) => {
  try {
    // Get tasks from AsyncStorage
    const storedTasks = await AsyncStorage.getItem('@snaphabit_tasks')
    if (!storedTasks) {
      throw new Error('No tasks found')
    }

    const tasks: Task[] = JSON.parse(storedTasks)

    // Find and update the task
    const taskIndex = tasks.findIndex((task) => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    // Update scheduledAt field
    tasks[taskIndex].scheduledAt = newDate

    // Save back to AsyncStorage
    await AsyncStorage.setItem('@snaphabit_tasks', JSON.stringify(tasks))
    return true
  } catch (error) {
    console.error('Error updating task schedule:', error)
    throw error
  }
}
