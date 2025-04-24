import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Animated as RNAnimated,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { Calendar, ListTree, Plus, Tag, Trash2 } from 'lucide-react-native'
import { Button, Checkbox } from 'react-native-paper'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { v4 as uuid } from 'uuid'

// Internal hooks imports
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useFormType } from '../../hooks/useFormType'
import { useHabits } from '../../hooks/useHabits'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'

// Internal types and utilities
import { Habit, Task } from '../../types'
import { SubTask } from '../../types/task.type'
import { dueDateRender } from '../../utils/dueDateRender'
import { formatHabitSchedule } from '../../utils/formatHabitSchedule'

// Styles import
import { detailsStyles, habitDetailsStyles, subtaskStyles } from './styles'

/**
 * TaskItem subcomponent - Renders individual subtask items
 */
interface TaskItemProps {
  task: SubTask
  onToggleComplete: (id: string) => void
  onTextChange: (id: string, text: string) => void
  onKeyPress: (e: any, id: string) => void
  onDelete: (id: string) => void
  inputRef: (id: string, ref: TextInput | null) => void
  panResponder: any
  anim: RNAnimated.Value
  theme: any
  styles: any
}

const TaskItem = memo(
  ({
    task,
    onToggleComplete,
    onTextChange,
    onKeyPress,
    onDelete,
    inputRef,
    panResponder,
    anim,
    theme,
    styles,
  }: TaskItemProps) => {
    // State to control mount animations
    const [isItemMounted, setIsItemMounted] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => setIsItemMounted(true), 200)
      return () => clearTimeout(timer)
    }, [])

    return (
      <View style={styles.taskContainer}>
        {isItemMounted && (
          <View style={[styles.deleteBackground]}>
            <Trash2
              size={20}
              color={theme.colors.onError}
            />
          </View>
        )}
        <RNAnimated.View
          style={[styles.foreground, { transform: [{ translateX: anim }] }]}
          {...panResponder?.panHandlers}
        >
          <View
            style={[styles.taskRow, task.completed && styles.completedTaskRow]}
          >
            <Checkbox
              status={task.completed ? 'checked' : 'unchecked'}
              onPress={() => onToggleComplete(task.id)}
              color={theme.colors.primary}
              uncheckedColor={theme.colors.outlineVariant}
            />
            <TextInput
              ref={(ref) => inputRef(task.id, ref)}
              style={[styles.taskInput, task.completed && styles.completedTask]}
              value={task.text}
              onChangeText={(text) => onTextChange(task.id, text)}
              onKeyPress={(e) => onKeyPress(e, task.id)}
              placeholder="Task item..."
              placeholderTextColor={theme.colors.outline}
              editable={!task.completed}
            />
          </View>
        </RNAnimated.View>
      </View>
    )
  },
  (prevProps, nextProps) => {
    // Optimization: only re-render when these props change
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.text === nextProps.task.text &&
      prevProps.task.completed === nextProps.task.completed &&
      prevProps.anim === nextProps.anim
    )
  },
)

/**
 * DetailsSheet - Shows details for a task or habit
 */
export const DetailsSheet: React.FC = () => {
  //* ===== HOOKS =====
  const { theme } = useTheme()
  const { data, hideBottomSheet, showBottomSheet } = useBottomSheet()
  const { formType, setFormType } = useFormType()
  const { resetCurrentTask, updateCurrentTask } = useTaskForm()
  const { tasks, updateTask } = useTasks()
  const { habits, updateHabit } = useHabits()
  const { keyboardVisible } = useKeyboard()

  //* ===== MEMOIZED VALUES =====
  const styles = useMemo(() => detailsStyles(theme), [theme])
  const subStyles = useMemo(() => subtaskStyles(theme), [theme])
  const snapPoints = useMemo(() => ['24%', '56%'], [])

  //* ===== DATA STATE =====
  const isTask = !!data?.task
  const isHabit = !!data?.habit
  const item = isTask ? data?.task : data?.habit
  const [localTasks, setLocalTasks] = useState<SubTask[]>([])

  //* ===== UI STATE =====
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isAddingSubTask, setIsAddingSubTask] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')
  const [showNewTaskInput, setShowNewTaskInput] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  //* ===== REFS =====
  const bottomSheetRef = useRef<BottomSheet>(null)
  const inputRef = useRef<TextInput>(null)
  const taskInputRefs = useRef<{ [key: string]: TextInput | null }>({})
  const swipeAnimMap = useRef<{ [key: string]: RNAnimated.Value }>({})
  const initialItemIdRef = useRef<string | null>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  //* ===== CONSTANTS =====
  const screenWidth = Dimensions.get('window').width
  const m3Easing = Easing.bezier(0.4, 0, 0, 1)

  //* ===== ANIMATIONS =====
  const fixedContentY = useSharedValue(20)
  const fixedContentOpacity = useSharedValue(0)
  const expandedContentY = useSharedValue(20)
  const expandedContentOpacity = useSharedValue(0)

  const fixedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fixedContentY.value }],
    opacity: fixedContentOpacity.value,
    width: '100%',
    paddingHorizontal: 16,
  }))

  const expandedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: expandedContentY.value }],
    opacity: expandedContentOpacity.value,
    width: '100%',
    height: 264,
    paddingHorizontal: 16,
    marginTop: 8,
  }))

  //* ===== EFFECTS =====

  // Enable layout animations for Android
  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }, [])

  // Load subtasks when task changes
  useEffect(() => {
    if (isTask && data?.task?.subTasks && localTasks.length === 0) {
      setLocalTasks(data.task.subTasks || [])
    }
  }, [isTask, data?.task?.id])

  // Handle adding new subtasks
  useEffect(() => {
    if (isAddingSubTask) {
      setShowNewTaskInput(true)
      const focusTimer = setTimeout(() => inputRef.current?.focus(), 200)
      setIsAddingSubTask(false)
      return () => clearTimeout(focusTimer)
    }
  }, [isAddingSubTask])

  // Handle keyboard visibility changes
  useEffect(() => {
    if (!keyboardVisible) {
      inputRef.current?.blur()
      setShowNewTaskInput(false)
      Object.values(taskInputRefs.current).forEach((input) => input?.blur())
    }
  }, [keyboardVisible])

  // Handle animation when item changes
  useEffect(() => {
    if (
      item &&
      (!initialItemIdRef.current || initialItemIdRef.current !== item.id)
    ) {
      initialItemIdRef.current = item.id
      fixedContentY.value = 20
      fixedContentOpacity.value = 0

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }

      animationTimeoutRef.current = setTimeout(() => {
        setIsVisible(true)
        fixedContentY.value = withTiming(0, { duration: 800, easing: m3Easing })
        fixedContentOpacity.value = withTiming(1, {
          duration: 800,
          easing: m3Easing,
        })
      }, 100)
    }

    setFormType('task')
    isTask && updateCurrentTask(item as Task)

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [item?.id])

  //* ===== CALLBACKS =====

  // Handle sheet index changes
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      hideBottomSheet()
    } else {
      if (index === 0) {
        setIsExpanded(false)
        saveSubTasks()
        expandedContentY.value = withTiming(20, {
          duration: 200,
          easing: m3Easing,
        })
        expandedContentOpacity.value = withTiming(0, {
          duration: 180,
          easing: m3Easing,
        })
      } else {
        setIsExpanded(true)
        expandedContentY.value = withDelay(
          50,
          withTiming(0, { duration: 250, easing: m3Easing }),
        )
        expandedContentOpacity.value = withDelay(
          50,
          withTiming(1, { duration: 250, easing: m3Easing }),
        )
      }
    }
  }

  // Save subtasks to the parent task
  const saveSubTasks = useCallback(() => {
    if (isTask && data?.task?.id) {
      const updatedTask: Task = {
        ...data.task,
        subTasks: localTasks,
      }
      updateTask(updatedTask)
    }
  }, [isTask, data?.task, localTasks, updateTask])

  // Toggle completion status for tasks and habits
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
          // Add habit completion logic here if needed
        }
      }
    },
    [tasks, habits, updateTask, updateHabit],
  )

  //* ===== SUBTASK MANAGEMENT =====

  // Add new subtask
  const addTask = () => {
    if (newTaskText.trim() === '') return

    const newSubTask: SubTask = {
      id: uuid(),
      text: newTaskText.trim(),
      completed: false,
    }

    const updatedTasks = [newSubTask, ...localTasks]
    setLocalTasks(updatedTasks)

    if (isTask && data?.task?.id) {
      const updatedTask: Task = { ...data.task, subTasks: updatedTasks }
      updateTask(updatedTask)
    }

    setNewTaskText('')
    setShowNewTaskInput(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // Toggle subtask completion
  const toggleSubTaskCompleted = useCallback(
    (id: string) => {
      const updatedTasks = localTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          }
        }
        return task
      })

      setLocalTasks(updatedTasks)

      if (isTask && data?.task?.id) {
        const updatedTask: Task = {
          ...data.task,
          subTasks: updatedTasks,
        }
        updateTask(updatedTask)
      }
    },
    [localTasks, isTask, data?.task, updateTask],
  )

  // Update subtask text
  const updateSubTaskText = useCallback(
    (id: string, text: string) => {
      const updatedTasks = localTasks.map((task) =>
        task.id === id ? { ...task, text } : task,
      )
      setLocalTasks(updatedTasks)

      if (isTask && data?.task?.id) {
        const updatedTask: Task = { ...data.task, subTasks: updatedTasks }
        updateTask(updatedTask)
      }
    },
    [localTasks, isTask, data?.task, updateTask],
  )

  // Delete subtask
  const deleteSubTask = useCallback(
    (id: string) => {
      const updatedTasks = localTasks.filter((task) => task.id !== id)
      setLocalTasks(updatedTasks)

      if (isTask && data?.task?.id) {
        const updatedTask: Task = { ...data.task, subTasks: updatedTasks }
        updateTask(updatedTask)
      }

      if (swipeAnimMap.current[id]) swipeAnimMap.current[id].setValue(0)
    },
    [localTasks, isTask, data?.task, updateTask],
  )

  // Handle drag end
  const handleDragEnd = useCallback(
    ({ data: subData }: { data: SubTask[] }) => {
      setIsDragging(false)
      setLocalTasks(subData)

      if (isTask && data?.task?.id) {
        const updatedTask: Task = { ...data.task, subTasks: subData }
        updateTask(updatedTask)
      }
    },
    [isTask, data?.task, updateTask],
  )

  // Handle backspace key
  const handleKeyPress = useCallback(
    (e: any, id: string) => {
      if (e.nativeEvent.key === 'Backspace') {
        const task = localTasks.find((t) => t.id === id)
        if (task && task.text === '') {
          deleteSubTask(id)
          e.preventDefault?.()
        }
      }
    },
    [localTasks, deleteSubTask],
  )

  // Store TextInput refs
  const setTaskInputRef = useCallback((id: string, ref: TextInput | null) => {
    taskInputRefs.current[id] = ref
  }, [])

  // Create pan responder for swipe gestures
  const createPanResponder = useCallback(
    (taskId: string) => {
      if (!swipeAnimMap.current[taskId]) {
        swipeAnimMap.current[taskId] = new RNAnimated.Value(0)
      }
      const anim = swipeAnimMap.current[taskId]

      return PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          if (isDragging) return false
          const { dx, dy } = gestureState
          return Math.abs(dx) > Math.abs(dy) * 2 && Math.abs(dx) > 20
        },
        onPanResponderGrant: () => {
          let _value = 0
          anim.addListener(({ value }) => (_value = value))
          anim.setOffset(_value)
        },
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.dx < 0) anim.setValue(gestureState.dx)
        },
        onPanResponderRelease: (evt, gestureState) => {
          anim.flattenOffset()
          if (gestureState.dx < -screenWidth * 0.35) {
            RNAnimated.timing(anim, {
              toValue: -screenWidth,
              duration: 200,
              useNativeDriver: true,
            }).start(() => deleteSubTask(taskId))
          } else {
            RNAnimated.timing(anim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start()
          }
        },
      })
    },
    [deleteSubTask, isDragging, screenWidth],
  )

  //* ===== RENDER FUNCTIONS =====

  // Render the title section
  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Checkbox
        status={item?.completed ? 'checked' : 'unchecked'}
        onPress={() => {
          if (!item) return
          handleToggleComplete(
            item.id,
            !item.completed,
            new Date().toISOString(),
            isTask,
          )
        }}
        color={theme.colors.primary}
        uncheckedColor={theme.colors.outlineVariant}
      />
      <Text style={styles.title}>{item?.title}</Text>
    </View>
  )

  if (!item) return null

  return (
    <Portal>
      <BottomSheet
        index={0}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        enableOverDrag={false}
        onChange={handleSheetChanges}
        onClose={() => {
          saveSubTasks()
        }}
        animateOnMount
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.outlineVariant }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          {/* Header */}
          <View style={[styles.header, { height: 16 }]}>
            <TouchableOpacity>
              {/* <Ellipsis
                size={24}
                color={theme.colors.secondary}
              /> */}
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            {/* Fixed content (visible in both collapsed and expanded states) */}
            <Animated.View style={fixedContentStyle}>
              {renderTitle()}
              <View style={styles.preview}>
                <View style={{ height: 56 }}>
                  <Text style={styles.description}>
                    {item.description || 'No description available'}
                  </Text>
                </View>
                <View style={styles.bottomCollapsed}>
                  {isTask
                    ? dueDateRender(data.task, styles, theme)
                    : isHabit && item.scheduledAt
                      ? formatHabitSchedule(
                          Array.isArray(item.scheduledAt)
                            ? item.scheduledAt
                            : [item.scheduledAt],
                        )
                      : 'No schedule set'}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 4,
                    }}
                  >
                    {localTasks && localTasks.length > 0 && (
                      <>
                        <ListTree
                          size={18}
                          color={
                            localTasks.filter((st) => st.completed).length ===
                            localTasks.length
                              ? theme.colors.primary
                              : theme.colors.outline
                          }
                        />
                        <Text
                          style={{
                            marginLeft: 4,
                            fontWeight: 500,
                            color:
                              localTasks.filter((st) => st.completed).length ===
                              localTasks.length
                                ? theme.colors.primary
                                : theme.colors.outline,
                          }}
                        >
                          {`${localTasks.filter((st) => st.completed).length || 0}/${
                            localTasks.length || 0
                          }`}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Expanded content */}
            {isExpanded && (
              <Animated.View style={expandedContentStyle}>
                {/* Task details view */}
                {isTask && (
                  <View style={{ marginTop: 16 }}>
                    <View style={subStyles.container}>
                      {/* New subtask input */}
                      {showNewTaskInput && (
                        <View style={{ height: 48, marginVertical: 4 }}>
                          <Animated.View style={[subStyles.taskRow]}>
                            <TextInput
                              key={item.id}
                              ref={inputRef}
                              style={subStyles.taskInput}
                              value={newTaskText}
                              onChangeText={setNewTaskText}
                              placeholder="New subtask..."
                              placeholderTextColor={theme.colors.outline}
                              returnKeyType="done"
                              onSubmitEditing={addTask}
                              autoFocus
                            />
                            <TouchableOpacity
                              onPress={addTask}
                              style={subStyles.deleteButton}
                              disabled={!newTaskText.trim()}
                            >
                              {newTaskText.trim() ? (
                                <Trash2
                                  size={16}
                                  color={theme.colors.primary}
                                />
                              ) : null}
                            </TouchableOpacity>
                          </Animated.View>
                        </View>
                      )}

                      {/* Empty state message */}
                      {localTasks.length === 0 && !showNewTaskInput && (
                        <Text style={subStyles.noTasksText}>
                          No subtasks added yet.
                        </Text>
                      )}

                      {/* Subtasks list */}
                      <FlatList
                        data={localTasks}
                        keyExtractor={(item) => item.id}
                        style={{
                          height: 180,
                          paddingBottom: keyboardVisible ? 120 : 80,
                          marginBottom: keyboardVisible ? 20 : 0,
                        }}
                        renderItem={({ item, index }) => {
                          const panResponder = createPanResponder(item.id)
                          const anim =
                            swipeAnimMap.current[item.id] ||
                            new RNAnimated.Value(0)
                          const isLastItem = index === localTasks.length - 1

                          return (
                            <>
                              <TaskItem
                                task={item}
                                onToggleComplete={toggleSubTaskCompleted}
                                onTextChange={updateSubTaskText}
                                onKeyPress={handleKeyPress}
                                onDelete={deleteSubTask}
                                inputRef={setTaskInputRef}
                                panResponder={panResponder}
                                anim={anim}
                                theme={theme}
                                styles={subStyles}
                              />
                              {!isLastItem && !item.completed && (
                                <View style={subStyles.divider} />
                              )}
                            </>
                          )
                        }}
                      />
                    </View>
                  </View>
                )}

                {/* Habit details view */}
                {isHabit && (
                  <View style={styles.additionalContent}>
                    <Text style={styles.sectionTitle}>Habit Details</Text>
                    <Text style={styles.detailText}>
                      {item.description || 'No description available'}
                    </Text>
                  </View>
                )}

                {/* Bottom actions area */}
                {isTask && (
                  <View style={styles.bottomTask}>
                    {/* Add subtask button */}
                    <Button
                      compact
                      icon={() => (
                        <Plus
                          size={18}
                          color={theme.colors.primary}
                        />
                      )}
                      onPress={() => setIsAddingSubTask(true)}
                    >
                      Add Subtask
                    </Button>

                    {/* Action icons */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '20%',
                      }}
                    >
                      {/* Calendar/Date icon */}
                      <TouchableOpacity
                        onPress={() => {
                          if (isTask && data?.task) {
                            showBottomSheet('calendar', {
                              task: data.task,
                              returnTo: 'taskDetails',
                            })
                          }
                        }}
                      >
                        <Calendar
                          size={20}
                          color={
                            item.scheduledAt
                              ? theme.colors.primary
                              : theme.colors.outline
                          }
                        />
                      </TouchableOpacity>

                      {/* Tags icon */}
                      <TouchableOpacity
                        onPress={() => {
                          if (isTask && data?.task) {
                            showBottomSheet('tagSuggestions', {
                              task: data.task,
                              returnTo: 'taskDetails',
                            })
                          }
                        }}
                      >
                        <Tag
                          size={20}
                          color={
                            item.tags && item.tags.length > 0
                              ? theme.colors.primary
                              : theme.colors.outline
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </Portal>
  )
}

/**
 * HabitDetailsSheet - Shows details for a habit
 */
export const HabitDetailsSheet: React.FC = () => {
  //* ===== HOOKS =====
  const { theme } = useTheme()
  const { data, hideBottomSheet } = useBottomSheet()
  const { setFormType } = useFormType()
  const { updateHabit } = useHabits()

  //* ===== MEMOIZED VALUES =====
  const styles = useMemo(() => habitDetailsStyles(theme), [theme])
  const snapPoints = useMemo(() => ['24%', '56%'], [])

  //* ===== DATA STATE =====
  // Only display habit details if we have a habit in data
  if (!data?.habit) {
    return null
  }

  const item = data.habit

  //* ===== REFS =====
  const bottomSheetRef = useRef<BottomSheet>(null)
  const initialItemIdRef = useRef<string | null>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  //* ===== CONSTANTS =====
  const m3Easing = Easing.bezier(0.4, 0, 0, 1)

  //* ===== ANIMATIONS =====
  const fixedContentY = useSharedValue(20)
  const fixedContentOpacity = useSharedValue(0)

  const fixedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fixedContentY.value }],
    opacity: fixedContentOpacity.value,
    width: '100%',
    paddingHorizontal: 16,
  }))

  //* ===== EFFECTS =====

  // Handle animation when item changes
  useEffect(() => {
    if (
      item &&
      (!initialItemIdRef.current || initialItemIdRef.current !== item.id)
    ) {
      initialItemIdRef.current = item.id
      fixedContentY.value = 20
      fixedContentOpacity.value = 0

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }

      animationTimeoutRef.current = setTimeout(() => {
        fixedContentY.value = withTiming(0, { duration: 800, easing: m3Easing })
        fixedContentOpacity.value = withTiming(1, {
          duration: 800,
          easing: m3Easing,
        })
      }, 100)
    }

    setFormType('habit')

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [item?.id])

  //* ===== CALLBACKS =====

  // Handle sheet index changes
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      hideBottomSheet()
    }
  }

  // Toggle completion status for habits
  const handleToggleComplete = useCallback(
    (completed: boolean) => {
      const updatedHabit = {
        ...item,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      }
      updateHabit(updatedHabit)
    },
    [item, updateHabit],
  )

  //* ===== RENDER FUNCTIONS =====

  // Render the title section
  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Checkbox
        status={item?.completed ? 'checked' : 'unchecked'}
        onPress={() => handleToggleComplete(!item.completed)}
        color={theme.colors.primary}
        uncheckedColor={theme.colors.outlineVariant}
      />
      <Text style={styles.title}>{item?.title}</Text>
    </View>
  )

  return (
    <Portal>
      <BottomSheet
        index={0}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        enableOverDrag={false}
        onChange={handleSheetChanges}
        animateOnMount
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.outlineVariant }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>
            {/* Fixed content (visible in both collapsed and expanded states) */}
            <Animated.View style={fixedContentStyle}>
              {renderTitle()}
              <View style={styles.preview}>
                <View style={{ height: 56 }}>
                  <Text style={styles.description}>
                    {item.description || 'No description available'}
                  </Text>
                </View>
                <View style={styles.bottomCollapsed}>
                  {item.scheduledAt ? (
                    <Text style={styles.scheduleText}>
                      {formatHabitSchedule(
                        Array.isArray(item.scheduledAt)
                          ? item.scheduledAt
                          : [item.scheduledAt],
                      )}
                    </Text>
                  ) : (
                    <Text style={styles.scheduleText}>No schedule set</Text>
                  )}
                  <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Calendar
                      size={20}
                      color={
                        item.scheduledAt
                          ? theme.colors.primary
                          : theme.colors.outline
                      }
                    />
                    <Tag
                      size={20}
                      color={
                        item.tags && item.tags.length > 0
                          ? theme.colors.primary
                          : theme.colors.outline
                      }
                      style={{ marginLeft: 16 }}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </Portal>
  )
}
