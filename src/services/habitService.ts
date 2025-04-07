import AsyncStorage from '@react-native-async-storage/async-storage'
import { Habit } from '../types'
import {
  incrementHabitsCompleted,
  incrementHabitsCreated,
  incrementHabitsDeleted,
} from './statisticsService'

const HABITS_KEY = '@habits'

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const habitsJson = await AsyncStorage.getItem(HABITS_KEY)
    return habitsJson ? JSON.parse(habitsJson) : []
  } catch (e) {
    console.error('Error fetching habits:', e)
    return []
  }
}

export const addHabit = async (habit: Habit): Promise<Habit[]> => {
  const habits = await getHabits()
  const newHabits = [...habits, habit]
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(newHabits))
  await incrementHabitsCreated()
  return newHabits
}

export const updateHabit = async (updatedHabit: Habit): Promise<Habit[]> => {
  const habits = await getHabits()
  const newHabits = habits.map((habit) => {
    if (habit.id === updatedHabit.id) {
      if (!habit.completed && updatedHabit.completed) {
        incrementHabitsCompleted()
      }
      return updatedHabit
    }
    return habit
  })
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(newHabits))
  return newHabits
}

export const deleteHabit = async (id: string): Promise<Habit[]> => {
  const habits = await getHabits()
  const newHabits = habits.filter((habit) => habit.id !== id)
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(newHabits))
  await incrementHabitsDeleted()
  return newHabits
}
