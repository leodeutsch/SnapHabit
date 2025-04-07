import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ChevronUp } from 'lucide-react-native'
import React, { useEffect, useMemo, useRef } from 'react'
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import 'react-native-get-random-values'
import { Easing } from 'react-native-reanimated'
import { v4 as uuid } from 'uuid'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useExpandAnimation } from '../../hooks/useExpandAnimation'
import { useFormType } from '../../hooks/useFormType'
import { useHabitForm } from '../../hooks/useHabitForm'
import { useHabits } from '../../hooks/useHabits'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { formatRelativeDate } from '../../utils/dateUtils'
import { formStyles } from './styles'

export const Form: React.FC = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => formStyles(theme), [theme])
  const rotateAnimation = useRef(new Animated.Value(0)).current

  // Form specific hooks
  const { formType } = useFormType()
  const { currentTask, updateCurrentTask, resetCurrentTask } = useTaskForm()
  const { currentHabit, updateCurrentHabit, resetCurrentHabit } = useHabitForm()

  // Common hooks
  const { showBottomSheet, hideBottomSheet, isVisible, content } =
    useBottomSheet()
  const { addTask } = useTasks()
  const { addHabit } = useHabits()

  // Animation hooks
  const { isExpanded, toggleExpand, interpolateHeight } = useExpandAnimation(
    formType === 'task' ? 450 : 300,
  )
  const iconRotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  })

  // Refs
  const titleInputRef = useRef<TextInput>(null)
  const descriptionInputRef = useRef<TextInput>(null)

  // Focus title input when component mounts
  useEffect(() => {
    // Request focus immediately
    if (isVisible && (content === 'addTask' || content === 'addHabit')) {
      titleInputRef.current?.focus()
    }

    // This is a backup in case the first focus fails
    const focusTimer = setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }
    }, 50)

    return () => clearTimeout(focusTimer)
  }, [])

  const handleToggleExpand = () => {
    const wasExpanded = toggleExpand()

    Animated.timing(rotateAnimation, {
      toValue: !isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start()

    setTimeout(() => {
      if (!wasExpanded) {
        descriptionInputRef.current?.focus()
      } else {
        titleInputRef.current?.focus()
      }
    }, 300)
  }

  const handleTitleChange = (text: string) => {
    if (formType === 'task') {
      updateCurrentTask({ ...currentTask, title: text })
    } else {
      updateCurrentHabit({ ...currentHabit, title: text })
    }
  }

  const handleDescriptionChange = (text: string) => {
    if (formType === 'task') {
      updateCurrentTask({ ...currentTask, description: text })
    } else {
      updateCurrentHabit({ ...currentHabit, description: text })
    }
  }

  const openCalendar = () => {
    Keyboard.dismiss()
    setTimeout(() => {
      showBottomSheet(formType === 'task' ? 'calendar' : 'habitDay')
    }, 100)
  }

  const openTagSuggestions = () => {
    Keyboard.dismiss()
    setTimeout(() => {
      showBottomSheet('tagSuggestions')
    }, 100)
  }

  const handleSave = () => {
    if (formType === 'task') {
      if (currentTask.title?.trim()) {
        const taskToCreate = {
          id: uuid(),
          title: currentTask.title.trim(),
          completed: false,
          scheduledAt: currentTask.scheduledAt,
          tags: currentTask.tags,
          description: currentTask.description,
          // Only include non-empty subtasks
          subTasks:
            currentTask.subTasks?.filter((task) => task.trim() !== '') || [],
        }
        addTask(taskToCreate)
        resetCurrentTask()
        hideBottomSheet()
      }
    } else {
      if (currentHabit.title?.trim()) {
        const habitToCreate = {
          id: uuid(),
          title: currentHabit.title.trim(),
          completed: false,
          scheduledAt: currentHabit.scheduledAt,
          tags: currentHabit.tags,
          description: currentHabit.description,
        }
        addHabit(habitToCreate)
        resetCurrentHabit()
        hideBottomSheet()
      }
    }
  }

  // Get current form values
  const currentTitle =
    formType === 'task' ? currentTask.title : currentHabit.title
  const currentDescription =
    formType === 'task' ? currentTask.description : currentHabit.description
  const currentSchedule =
    formType === 'task' ? currentTask.scheduledAt : currentHabit.scheduledAt
  const currentTags = formType === 'task' ? currentTask.tags : currentHabit.tags

  // Get placeholder text based on form type
  const titlePlaceholder =
    formType === 'task'
      ? 'What do you want to do?'
      : 'What habit do you want to build?'

  const descriptionPlaceholder = 'Add a description (optional)'

  const scheduleText =
    formType === 'task'
      ? currentSchedule && typeof currentSchedule === 'string'
        ? formatRelativeDate(currentSchedule)
        : 'Add due date'
      : currentSchedule && typeof currentSchedule === 'string'
        ? formatRelativeDate(currentSchedule)
        : 'When'

  const scheduleIcon =
    formType === 'task' ? 'insert-invitation' : 'calendar-month'

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      enabled={false}
    >
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={styles.formContainer}
        >
          <TextInput
            ref={titleInputRef}
            style={styles.input}
            placeholder={titlePlaceholder}
            placeholderTextColor={theme.colors.outline}
            value={currentTitle}
            onChangeText={handleTitleChange}
            returnKeyType={isExpanded ? 'next' : 'done'}
            cursorColor={theme.colors.primary}
            onSubmitEditing={() => {
              if (isExpanded) {
                descriptionInputRef.current?.focus()
              } else {
                handleSave()
              }
            }}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
          />

          <Animated.View
            style={[
              styles.expandedView,
              { height: interpolateHeight(0, 80), overflow: 'hidden' },
            ]}
          >
            <TextInput
              ref={descriptionInputRef}
              style={styles.descriptionInput}
              placeholder={descriptionPlaceholder}
              placeholderTextColor={theme.colors.outline}
              value={currentDescription || ''}
              onChangeText={handleDescriptionChange}
              multiline
              returnKeyType="done"
              onSubmitEditing={handleSave}
              submitBehavior="blurAndSubmit"
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
            />

            {/* Only show checklist for tasks, not habits */}
            {/* {formType === 'task' && (
              <SubTaskList
                subTasks={
                  currentTask.subTasks?.map((text) => ({
                    id: Date.now() + Math.random().toString(),
                    text,
                    completed: false,
                  })) || []
                }
                onSubTasksChange={(subTasks) => {
                  updateCurrentTask({
                    ...currentTask,
                    subTasks: subTasks.map((item) => item.text),
                  })
                }}
              />
            )} */}
          </Animated.View>

          <View style={styles.bottomContainer}>
            <View style={styles.bottomContainerLeftSide}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={openCalendar}
              >
                <MaterialIcons
                  name={scheduleIcon}
                  size={20}
                  color={
                    currentSchedule
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    styles.bottomContentText,
                    currentSchedule && {
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  {scheduleText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={openTagSuggestions}
              >
                <MaterialIcons
                  name={
                    (currentTags?.length || 0) > 0
                      ? 'label-outline'
                      : 'new-label'
                  }
                  size={20}
                  color={
                    (currentTags?.length || 0) > 0
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
              </TouchableOpacity>
            </View>
            {/* {!isExpanded && (
              <Text style={styles.expandPromptText}>Expand for more...</Text>
            )} */}
            <TouchableOpacity
              style={[styles.iconButton, { marginRight: 0 }]}
              onPress={handleToggleExpand}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: iconRotation }],
                }}
              >
                <ChevronUp
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
