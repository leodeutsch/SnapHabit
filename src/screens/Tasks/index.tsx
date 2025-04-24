import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { ListFilterPlus } from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { IconButton } from 'react-native-paper'
import { ListItem } from '../../components/ListItem'
import { TaskFilterBottomSheet } from '../../components/TaskFilterBottomSheet'
import { useFilter } from '../../hooks/useFilterContent'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { Task } from '../../types'
import { themedStyles } from './styles'

export const TasksScreen = () => {
  const navigation = useNavigation<any>()
  const { theme } = useTheme()
  const styles = themedStyles(theme)
  const { tasks, updateTask } = useTasks()
  const { isFilterVisible, setFilterVisible } = useFilter()

  // Filter state
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showCompleted, setShowCompleted] = useState<boolean>(false)
  const [showPastDue, setShowPastDue] = useState<boolean>(false)

  // Toggle filter visibility
  const toggleFilterVisible = useCallback(() => {
    setFilterVisible(!isFilterVisible)
  }, [isFilterVisible])

  // Handle task completion toggle
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
      }
    },
    [tasks, updateTask],
  )

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by completion status
      if (!showCompleted && task.completed) {
        return false
      }

      // Filter by past due
      if (showPastDue) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Only include past due tasks when this filter is on
        const isPastDue =
          task.scheduledAt &&
          new Date(task.scheduledAt) < today &&
          !task.completed
        if (!isPastDue) {
          return false
        }
      }

      // Filter by tags
      if (selectedTags.length > 0) {
        const taskTags = task.tags || []
        if (!selectedTags.some((tagId: any) => taskTags.includes(tagId))) {
          return false
        }
      }

      return true
    })
  }, [tasks, selectedTags, showCompleted, showPastDue])

  // Are any filters active?
  const hasActiveFilters =
    selectedTags.length > 0 || showCompleted || showPastDue

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <IconButton
          icon={() => (
            <ListFilterPlus
              size={20}
              color={
                hasActiveFilters
                  ? theme.colors.primary
                  : theme.colors.onBackground
              }
            />
          )}
          onPress={toggleFilterVisible}
          style={{ margin: 0, padding: 0 }}
        />
      </View>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Filters applied: {filteredTasks.length} of {tasks.length} tasks
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: '10%' }}>
        <View style={styles.section}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                item={task}
                itemType="task"
                onToggleComplete={handleToggleComplete}
                isLast={task.id === filteredTasks[filteredTasks.length - 1].id}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {hasActiveFilters
                  ? 'No tasks match the active filters.'
                  : "No tasks yet... Let's do something!"}
              </Text>
            </View>
          )}
        </View>
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

      {/* Task Filter Bottom Sheet */}
      <TaskFilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        showPastDue={showPastDue}
        setShowPastDue={setShowPastDue}
      />
    </View>
  )
}
