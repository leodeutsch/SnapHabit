import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronDown } from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ListItem } from '../../components/ListItem'
import { useHabits } from '../../hooks/useHabits'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { Habit, Task } from '../../types'
import { homeStyles } from './styles'

export const HomeScreen = () => {
  // Hooks
  const { theme } = useTheme()
  const styles = useMemo(() => homeStyles(theme), [theme])
  const { tasks, updateTask, loadTasks } = useTasks()
  const { habits, loadHabits } = useHabits()

  // States
  const [tasksExpanded, setTasksExpanded] = useState(true)
  const [habitsExpanded, setHabitsExpanded] = useState(true)

  // Refs
  const taskRotationAnim = useRef(new Animated.Value(1)).current
  const habitRotationAnim = useRef(new Animated.Value(1)).current
  const taskHeightAnim = useRef(new Animated.Value(1)).current
  const habitHeightAnim = useRef(new Animated.Value(1)).current
  const scrollViewRef = useRef<ScrollView>(null)

  // Other Consts
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
        const habit = habits.find((h: Habit) => h.id === itemId)
        if (habit) {
          // Update habit completion status
          // ...
        }
      }
    },
    [tasks, habits, updateTask],
  )

  // Toggle section expansion
  const toggleSection = (section: 'tasks' | 'habits') => {
    if (section === 'tasks') {
      const isExpanding = !tasksExpanded

      if (isExpanding) {
        setTasksExpanded(true)
      }

      Animated.parallel([
        Animated.timing(taskRotationAnim, {
          toValue: isExpanding ? 1 : 0,
          duration: 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(taskHeightAnim, {
          toValue: isExpanding ? 1 : 0,
          duration: 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished && !isExpanding) {
          setTasksExpanded(false)
        }
      })
    } else {
      const isExpanding = !habitsExpanded

      if (isExpanding) {
        setHabitsExpanded(true)
      }

      Animated.parallel([
        Animated.timing(habitRotationAnim, {
          toValue: isExpanding ? 1 : 0,
          duration: 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(habitHeightAnim, {
          toValue: isExpanding ? 1 : 0,
          duration: 300,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished && !isExpanding) {
          setHabitsExpanded(false)
        }
      })
    }
  }

  useEffect(() => {
    loadTasks()
    loadHabits()
  }, [])

  // Modify the activeTasks filter to match what's displayed in the tab bar
  const activeTasks = tasks.filter((task) => {
    // Today's date as string YYYY-MM-DD
    const todayStr = today.toISOString().split('T')[0]

    // Include uncompleted tasks that are for today or have no schedule
    if (
      !task.completed &&
      (task.scheduledAt?.startsWith(todayStr) || !task.scheduledAt)
    ) {
      return true
    }

    // Include past due tasks (scheduled for before today and not completed)
    if (!task.completed && task.scheduledAt) {
      const scheduledDate = new Date(task.scheduledAt)
      if (scheduledDate < today && !task.scheduledAt.startsWith(todayStr)) {
        return true
      }
    }

    return false
  })

  // Habits filter looks correct but let's make it clearer
  const habitsOnToday = habits.filter((habit) => {
    // Include habits with no schedule or empty schedule
    if (!habit.scheduledAt || habit.scheduledAt.length === 0) {
      return true
    }

    // Include habits scheduled for today's weekday
    const weekdayName = format(today, 'EEEE')
    return habit.scheduledAt.some((day) => day === weekdayName)
  })

  const taskChevronRotation = taskRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const habitChevronRotation = habitRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Today</Text>
      <View style={styles.headerDateContainer}>
        <Text style={styles.headerDate}>{format(today, 'dd')}</Text>
        <Text style={styles.headerMonth}>{format(today, 'MMM')}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        bounces={true}
        contentContainerStyle={{ paddingBottom: '10%' }}
      >
        {renderHeader()}

        {/* Tasks Section */}
        {activeTasks.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeaderContainer}
              onPress={() => toggleSection('tasks')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionHeader}>Tasks</Text>
              <Animated.View
                style={{ transform: [{ rotate: taskChevronRotation }] }}
              >
                <ChevronDown
                  size={20}
                  color={theme.colors.primary}
                />
              </Animated.View>
            </TouchableOpacity>

            <Animated.ScrollView
              style={{
                maxHeight: taskHeightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000],
                }),
                overflow: 'hidden',
                transform: [
                  {
                    translateY: taskHeightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
                transformOrigin: 'top',
              }}
            >
              {tasksExpanded &&
                activeTasks.map((task, index) => (
                  <ListItem
                    key={task.id}
                    item={task}
                    itemType="task"
                    onToggleComplete={handleToggleComplete}
                    isLast={index === activeTasks.length - 1}
                  />
                ))}
            </Animated.ScrollView>
          </View>
        )}

        {/* Habits Section */}
        {habitsOnToday.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeaderContainer}
              onPress={() => toggleSection('habits')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionHeader}>Habits</Text>
              <Animated.View
                style={{ transform: [{ rotate: habitChevronRotation }] }}
              >
                <ChevronDown
                  size={20}
                  color={theme.colors.primary}
                />
              </Animated.View>
            </TouchableOpacity>

            <Animated.View
              style={{
                maxHeight: habitHeightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000],
                }),
                overflow: 'hidden',
                transform: [
                  {
                    translateY: habitHeightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
                transformOrigin: 'top',
              }}
            >
              {habitsExpanded &&
                habitsOnToday.map((habit, index) => (
                  <ListItem
                    key={habit.id}
                    item={habit}
                    itemType="habit"
                    onToggleComplete={handleToggleComplete}
                    isLast={index === habitsOnToday.length - 1}
                  />
                ))}
            </Animated.View>
          </View>
        )}

        {/* Empty state */}
        {habits.length === 0 && activeTasks.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits or tasks for today</Text>
          </View>
        )}
      </ScrollView>
      <LinearGradient
        colors={['transparent', theme.colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.3 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          zIndex: 5,
        }}
        pointerEvents="none"
      />
    </View>
  )
}
