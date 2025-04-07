import React, { useMemo, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { List, Text } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useHabits } from '../../hooks/useHabits'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { Habit, Task } from '../../types'
import { dueDateRender } from '../../utils/dueDateRender'
import { formatHabitSchedule } from '../../utils/formatHabitSchedule'
import { CustomCheckbox } from '../CustomCheckbox'
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
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  itemType,
  onToggleComplete,
}) => {
  const { loadTasks, deleteTask } = useTasks()
  const { loadHabits, deleteHabit } = useHabits()
  const { showBottomSheet } = useBottomSheet()
  const { theme } = useTheme()
  const styles = useMemo(() => listItemStyles(theme), [theme])
  const [isCompleted, setIsCompleted] = useState(item.completed)
  const [isCompletedPending, setIsCompletedPending] = useState(false)
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Handle long press (delete)
  const handleLongPress = async () => {
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

  // Render tags if present
  const renderTags = () => {
    if (!item.tags || item.tags.length === 0) return null
    return (
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => {
          if (index < 3) {
            return (
              <Text
                style={[
                  styles.tagText,
                  { marginRight: 8, fontStyle: 'italic' },
                ]}
                key={tag.id}
              >
                {`${tag.name}`}
              </Text>
            )
          }
          return null
        })}
      </View>
    )
  }

  // Render the right side content (schedule info + checkbox)
  const renderRightContent = () => (
    <View style={styles.rightContent}>
      {isTask && dueDateRender(item as Task, styles)}
      {!isTask && item.scheduledAt && (
        <Text style={styles.reminderText}>
          {formatHabitSchedule(
            Array.isArray(item.scheduledAt)
              ? item.scheduledAt
              : [item.scheduledAt],
          )}
        </Text>
      )}
      {/* <Checkbox
        status={isCompleted ? 'checked' : 'unchecked'}
        onPress={handleToggleComplete}
        color={theme.colors.primary}
        uncheckedColor={theme.colors.outline}
      /> */}
      <CustomCheckbox
        status={isCompleted ? 'checked' : 'unchecked'}
        onPress={handleToggleComplete}
      />
    </View>
  )

  // Render the icon based on item type
  // const renderLeftIcon = () => {
  //   const iconName = isTask
  //     ? 'checkbox-multiple-marked-outline'
  //     : 'calendar-month-outline'

  //   return (
  //     <List.Icon
  //       icon={iconName}
  //       color={theme.colors.primary}
  //     />
  //   )
  // }

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[styles.container, isCompletedPending && { opacity: 0.7 }]}
    >
      <List.Item
        title={item.title}
        titleStyle={[
          styles.title,
          (isCompleted || isCompletedPending) && styles.completedTitle,
        ]}
        description={renderTags}
        descriptionNumberOfLines={1}
        // left={renderLeftIcon}
        right={renderRightContent}
      />
    </TouchableOpacity>
  )
}
