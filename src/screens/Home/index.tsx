import { format } from 'date-fns'
import React, { useCallback, useEffect, useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { ListItem } from '../../components/ListItem'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useHabits } from '../../hooks/useHabits'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { Habit, Task } from '../../types'
import { homeStyles } from './styles'

export const HomeScreen = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => homeStyles(theme), [theme])

  // Hooks
  const { tasks, updateTask, loadTasks } = useTasks()
  const { habits, loadHabits } = useHabits()
  const { showBottomSheet } = useBottomSheet()

  const today = new Date()

  const handleToggleComplete = useCallback(
    (
      itemId: string,
      completed: boolean,
      completedAt: string,
      isTask: boolean,
    ) => {
      if (isTask) {
        const task = tasks.find((t: Task) => t.id === itemId)
        if (task) {
          const updatedTask = {
            ...task,
            completed,
            completedAt: completed ? completedAt : undefined,
          }
          updateTask(updatedTask)
        }
      } else {
        // Handle habit completion similarly
        const habit = habits.find((h: Habit) => h.id === itemId)
        if (habit) {
          // Update habit completion status
          // ...
        }
      }
    },
    [tasks, habits, updateTask],
  )

  useEffect(() => {
    loadTasks()
    loadHabits()
  }, [])

  // Filter active (non-completed) tasks && habits
  const activeTasks = tasks.filter(
    (t) => !t.completed || t.scheduledAt === today.toISOString().split('T')[0],
  )
  const habitsOnToday = habits.filter((h) =>
    h.scheduledAt?.some((day) => day === format(today, 'EEEE')),
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <View style={styles.headerDateContainer}>
          <Text style={styles.headerDate}>{format(today, 'dd')}</Text>
          <Text style={styles.headerMonth}>{format(today, 'MMM')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: '10%' }}>
        {/* Tasks Section */}
        {activeTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Tasks</Text>
            {activeTasks.map((task) => (
              <ListItem
                key={task.id}
                item={task}
                itemType="task"
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </View>
        )}

        {/* Habits Section */}
        {habitsOnToday.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Habits</Text>
            {habits.map((habit) => (
              <ListItem
                key={habit.id}
                item={habit}
                itemType="habit"
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </View>
        )}

        {/* Empty state */}
        {habits.length === 0 && activeTasks.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits or tasks for today</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
