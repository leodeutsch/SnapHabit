import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Animated, Dimensions, Easing, Keyboard } from 'react-native'
import { CalendarSheet } from '../components/CalendarSheet'
import { Form } from '../components/Form'
import { HabitDaysSheet } from '../components/HabitDaysSheet'
import { HabitDetailsSheet } from '../components/HabitDetailsSheet'
import { TagSheet } from '../components/TagManageSheet'
import { TagSuggestionsModal } from '../components/TagSuggestionsSheet'
import { TaskDetailsSheet } from '../components/TaskDetailsSheet'
import { useHabitForm } from '../hooks/useHabitForm'
import { useTaskForm } from '../hooks/useTaskForm'
import { useTheme } from '../hooks/useTheme'
import {
  BottomSheetContent,
  BottomSheetContextType,
  BottomSheetData,
} from '../types'

const EMPHASIZED_EASING = Easing.bezier(0.2, 0, 0, 1)
const DURATION_LONG2 = 500
const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const BottomSheetContext = createContext<
  BottomSheetContextType | undefined
>(undefined)

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useTheme()
  const { resetCurrentTask } = useTaskForm()
  const { resetCurrentHabit } = useHabitForm()
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState<BottomSheetContent>(null)
  const [data, setData] = useState<BottomSheetData | null>(null)

  // Animation values for the bottom sheet
  const translateYAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  const showBottomSheet = useCallback(
    (newContent: BottomSheetContent, newData?: BottomSheetData) => {
      // Create a hidden input to prepare the keyboard
      const prepareKeyboard = async () => {
        // For task or habit forms, pre-open the keyboard
        if (newContent === 'addTask' || newContent === 'addHabit') {
          // Set content first but don't animate yet
          setContent(newContent)
          setData(newData || null)

          // Small delay to let the hidden input render
          await new Promise((resolve) => setTimeout(resolve, 50))

          // Then set visible which will trigger animations
          setIsVisible(true)
        } else {
          // For other content types, just show immediately
          setContent(newContent)
          setData(newData || null)
          setIsVisible(true)
        }
      }

      prepareKeyboard()
    },
    [],
  )

  const hideBottomSheet = () => {
    if (
      content === 'calendar' ||
      content === 'tagSuggestions' ||
      content === 'habitDay'
    ) {
      setContent(content === 'habitDay' ? 'addHabit' : 'addTask')
    } else {
      setIsVisible(false)
      setContent(null)
      setData(null)
    }
  }

  // Animation functions
  const showBottomSheetAnimated = () => {
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: DURATION_LONG2 * 0.8,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: DURATION_LONG2 * 0.6,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const hideBottomSheetAnimated = () => {
    Keyboard.dismiss()
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: SCREEN_HEIGHT,
        duration: DURATION_LONG2 * 0.8,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: DURATION_LONG2 * 0.6,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideBottomSheet()
    })
  }

  // Monitor visible state changes to trigger animations
  useEffect(() => {
    if (isVisible) {
      showBottomSheetAnimated()
    } else {
      hideBottomSheetAnimated()
    }
  }, [isVisible])

  // Reset the current task or habit when the bottom sheet is closed
  useEffect(() => {
    if (!isVisible && content === null) {
      resetCurrentTask()
      resetCurrentHabit()
    }
  }, [isVisible, content])

  // Render the appropriate content for the bottom sheet
  const renderBottomSheetContent = () => {
    switch (content) {
      case 'addTask':
      case 'addHabit':
        return <Form />
      case 'taskDetails':
        return <TaskDetailsSheet />
      case 'habitDetails':
        return <HabitDetailsSheet />
      case 'calendar':
        return <CalendarSheet />
      case 'tag':
        return <TagSheet />
      case 'tagSuggestions':
        return <TagSuggestionsModal />
      case 'habitDay':
        return <HabitDaysSheet />
      default:
        return null
    }
  }

  return (
    <BottomSheetContext.Provider
      value={{ isVisible, content, data, showBottomSheet, hideBottomSheet }}
    >
      {children}

      {isVisible && (
        <>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
              backgroundColor: theme.colors.backdrop,
            }}
            onTouchEnd={hideBottomSheetAnimated}
          />
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: 8,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              // minHeight: 150,
              maxHeight: SCREEN_HEIGHT * 0.9,
              zIndex: 3,
              transform: [{ translateY: translateYAnim }],
            }}
          >
            {renderBottomSheetContent()}
          </Animated.View>
        </>
      )}
    </BottomSheetContext.Provider>
  )
}
