import AsyncStorage from '@react-native-async-storage/async-storage'
import { Statistics } from '../types/statistics.type'

const STATISTICS_KEY = 'APP_STATISTICS'

export const getStatistics = async (): Promise<Statistics> => {
  const statisticsString = await AsyncStorage.getItem(STATISTICS_KEY)
  if (statisticsString) {
    return JSON.parse(statisticsString)
  }
  return {
    habitsCreated: 0,
    habitsCompleted: 0,
    habitsDeleted: 0,
    completionRate: 0,
  }
}

export const updateStatistics = async (
  updater: (stats: Statistics) => Statistics,
): Promise<Statistics> => {
  const currentStats = await getStatistics()
  const newStats = updater(currentStats)
  await AsyncStorage.setItem(STATISTICS_KEY, JSON.stringify(newStats))
  return newStats
}

export const incrementHabitsCreated = () =>
  updateStatistics((stats) => ({
    ...stats,
    habitsCreated: stats.habitsCreated + 1,
    completionRate:
      stats.habitsCreated > 0
        ? (stats.habitsCompleted / stats.habitsCreated) * 100
        : 0,
  }))

export const incrementHabitsCompleted = () =>
  updateStatistics((stats) => ({
    ...stats,
    habitsCompleted: stats.habitsCompleted + 1,
    completionRate: ((stats.habitsCompleted + 1) / stats.habitsCreated) * 100,
  }))

export const incrementHabitsDeleted = () =>
  updateStatistics((stats) => ({
    ...stats,
    habitsDeleted: stats.habitsDeleted + 1,
  }))

export const resetStatistics = async () => {
  await AsyncStorage.removeItem(STATISTICS_KEY)
  await AsyncStorage.setItem(
    STATISTICS_KEY,
    JSON.stringify({
      habitsCreated: 0,
      habitsCompleted: 0,
      habitsDeleted: 0,
      completionRate: 0,
    }),
  )
}
