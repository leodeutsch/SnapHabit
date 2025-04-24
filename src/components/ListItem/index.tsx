import { ListTree } from 'lucide-react-native'
import React, { useMemo, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Checkbox, List, Text } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useHabits } from '../../hooks/useHabits'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { updateTaskSchedule } from '../../services/tasks'
import { Habit, Task } from '../../types'
import { dueDateRender } from '../../utils/dueDateRender'
import { formatHabitSchedule } from '../../utils/formatHabitSchedule'
import { LongPressSheet } from '../LongPressSheet'
import { listItemStyles } from './styles'

interface ListItemProps {
  item: Task | Habit
  itemType: 'task' | 'habit'
  onToggleComplete: (
    itemId: string,
    completed: boolean,
    completedAt: string,
    isTask: boolean,
  ) => void
  isLast?: boolean
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  itemType,
  onToggleComplete,
  isLast = false,
}) => {
  const { loadTasks, deleteTask } = useTasks()
  const { loadHabits, deleteHabit } = useHabits()
  const { showBottomSheet } = useBottomSheet()
  const { theme } = useTheme()
  const styles = useMemo(() => listItemStyles(theme), [theme])
  const [isCompleted, setIsCompleted] = useState(item.completed)
  const [isCompletedPending, setIsCompletedPending] = useState(false)
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [sheetVisible, setSheetVisible] = useState(false)

  const isTask = itemType === 'task'

  // Handle item press - show appropriate details sheet
  const handlePress = () => {
    showBottomSheet(isTask ? 'taskDetails' : 'habitDetails', {
      [itemType]: item,
    })
  }

  // Handle completion toggle
  const handleToggleComplete = () => {
    const newCompletedState = !isCompleted
    setIsCompleted(newCompletedState)

    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current)
      completionTimerRef.current = null
    }

    if (newCompletedState) {
      setIsCompletedPending(true)
      completionTimerRef.current = setTimeout(() => {
        setIsCompletedPending(false)
        onToggleComplete(
          item.id,
          newCompletedState,
          new Date().toISOString(),
          isTask,
        )
        completionTimerRef.current = null
      }, 3000)
    } else {
      setIsCompletedPending(false)
      onToggleComplete(
        item.id,
        newCompletedState,
        new Date().toISOString(),
        isTask,
      )
    }
  }

  // Handle long press - open the sheet instead of deleting
  const handleLongPress = () => {
    setSheetVisible(true)
  }

  const handleCloseSheet = () => {
    setSheetVisible(false)
  }

  const handleDelete = async () => {
    try {
      if (isTask) {
        await deleteTask(item.id)
        loadTasks()
      } else {
        await deleteHabit(item.id)
        loadHabits()
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error)
    }
  }

  const handlePostpone = async (
    option: 'today' | 'tomorrow' | 'nextMonday',
  ) => {
    if (!isTask) return

    try {
      const task = item as Task
      let newDate = new Date()

      // Set the new date based on option selected
      if (option === 'tomorrow') {
        newDate.setDate(newDate.getDate() + 1)
      } else if (option === 'nextMonday') {
        const day = newDate.getDay() // 0 is Sunday, 1 is Monday
        const daysUntilMonday = day === 0 ? 1 : 8 - day
        newDate.setDate(newDate.getDate() + daysUntilMonday)
      }

      // Format the date in YYYY-MM-DD format using local timezone
      const year = newDate.getFullYear()
      const month = String(newDate.getMonth() + 1).padStart(2, '0')
      const day = String(newDate.getDate()).padStart(2, '0')
      const newDateStr = `${year}-${month}-${day}`

      // If the task already has a scheduledAt value and is not an all-day task,
      // preserve the original time portion
      if (task.scheduledAt && !task.isAllDay) {
        const timePortion = task.scheduledAt.split('T')[1]
        if (timePortion) {
          // Combine new date with existing time
          await updateTaskSchedule(task.id, `${newDateStr}T${timePortion}`)
          loadTasks()
          return
        }
      }

      // For all-day tasks or tasks without time, just use the date portion
      await updateTaskSchedule(task.id, newDateStr)
      loadTasks()
    } catch (error) {
      console.error('Error postponing task:', error)
    }
  }

  // Render the left side content
  const renderLeftContent = () => {
    if (isTask) {
      return (
        <Checkbox
          status={isCompleted ? 'checked' : 'unchecked'}
          onPress={handleToggleComplete}
          color={theme.colors.primary}
          uncheckedColor={theme.colors.outlineVariant}
        />
      )
    }

    // For habits, return either nothing or a habit indicator icon
    return (
      <View style={styles.habitIndicator}>
        {/* <View style={[styles.habitDot]} /> */}
      </View>
    )
  }

  // Render Right side content
  const renderRightContent = () => (
    <>
      {isTask && (item as Task).subTasks?.length !== 0 && (
        <ListTree
          size={16}
          color={theme.colors.outline}
          style={{ marginTop: 14 }}
        />
      )}
    </>
  )

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text
        style={[
          styles.title,
          (isCompleted || isCompletedPending) && styles.completedTitle,
        ]}
      >
        {item.title}
      </Text>
      {isTask && dueDateRender(item as Task, styles, theme)}
      {!isTask && item.scheduledAt && (
        <Text style={styles.reminderText}>
          {formatHabitSchedule(
            Array.isArray(item.scheduledAt)
              ? item.scheduledAt
              : [item.scheduledAt],
          )}
        </Text>
      )}
    </View>
  )

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[styles.container, isCompletedPending && { opacity: 0.7 }]}
      >
        <List.Item
          title={renderTitle}
          titleStyle={[
            styles.title,
            (isCompleted || isCompletedPending) && styles.completedTitle,
          ]}
          left={renderLeftContent}
          right={renderRightContent}
        />
      </TouchableOpacity>

      {!isLast && <View style={styles.divider} />}

      <LongPressSheet
        itemType={isTask ? 'task' : 'habit'}
        visible={sheetVisible}
        onClose={handleCloseSheet}
        onDelete={handleDelete}
        onPostpone={isTask ? handlePostpone : undefined}
      />
    </>
  )
}
