import { addDays, format, isValid, parseISO } from 'date-fns'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CalendarProvider, WeekCalendar } from 'react-native-calendars'

// Hooks
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useFormType } from '../../hooks/useFormType'
import { useHabits } from '../../hooks/useHabits'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'

// Types
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronDown } from 'lucide-react-native'
import { Habit } from '../../types/habit.type'
import { Task } from '../../types/task.type'
import { agendaStyles } from './styles'

// Types
export type EventType = 'task' | 'habit'

export interface AgendaItem {
  id: string
  type: EventType
  title: string
  scheduledAt?: string
  description?: string
  originalData?: any
  isAllDay?: boolean
}

interface TimeBlock {
  label: string
  startHour: number
  endHour: number
  items: AgendaItem[]
}

/**
 * AgendaScreen - A daily agenda view showing tasks and habits
 */
export const AgendaScreen = () => {
  // Add these hooks
  const { setFormType } = useFormType()
  const { updateCurrentTask } = useTaskForm()

  // ===== Hooks =====
  const { showBottomSheet } = useBottomSheet()
  const { tasks } = useTasks()
  const { habits } = useHabits()
  const { theme } = useTheme()
  const styles = useMemo(() => agendaStyles(theme), [theme])

  // ===== State =====
  const [items, setItems] = useState<Record<string, AgendaItem[]>>({})
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  )
  const [expandedAllDay, setExpandedAllDay] = useState(false)
  const allDayRotationAnim = useRef(new Animated.Value(0)).current
  const allDayHeightAnim = useRef(new Animated.Value(0)).current
  const MAX_VISIBLE_ITEMS = 2
  const ITEM_HEIGHT = 40

  // ===== Refs =====
  const scrollViewRef = useRef<ScrollView>(null)

  // ===== Memoized Values =====
  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])

  // Get current items for selected date
  const currentItems = useMemo(() => {
    return items[selectedDate] || []
  }, [items, selectedDate])

  // Create time blocks for the day
  const timeBlocks = useMemo(() => {
    // All-day events (no specific time)
    const allDayItems: AgendaItem[] = []

    // Create time blocks (every 2 hours)
    const blocks: TimeBlock[] = Array.from({ length: 12 }, (_, i) => {
      const startHour = i * 2
      const endHour = startHour + 2
      return {
        label: `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00`,
        startHour,
        endHour,
        items: [],
      }
    })

    // Distribute items into blocks
    currentItems.forEach((item) => {
      // More explicit all-day detection
      if (
        // Explicit all-day flag
        item.isAllDay === true ||
        item.originalData?.isAllDay === true ||
        // No scheduled time
        !item.scheduledAt ||
        // Date without time component
        (item.scheduledAt && !item.scheduledAt.includes('T')) ||
        // Midnight time formats (legacy data)
        (item.scheduledAt &&
          (item.scheduledAt.includes('T00:00:00') ||
            item.scheduledAt.includes('T00:00.000Z') ||
            item.scheduledAt.includes('T00:00:00.000')))
      ) {
        // It's an all-day event
        allDayItems.push(item)
      } else {
        // Has specific time - assign to correct time block
        const date = parseISO(item.scheduledAt || '')
        if (isValid(date)) {
          const hour = date.getHours()
          const blockIndex = Math.floor(hour / 2)
          if (blockIndex >= 0 && blockIndex < blocks.length) {
            blocks[blockIndex].items.push(item)
          }
        } else {
          // Invalid scheduledAt, treat as all-day
          console.warn(
            `Invalid scheduledAt for item ${item.id}: ${item.scheduledAt}`,
          )
          allDayItems.push(item)
        }
      }
    })

    return { allDayItems, timeBlocks: blocks }
  }, [currentItems])

  // Prepare all-day items with visibility logic
  const visibleAllDayItems = useMemo(() => {
    if (timeBlocks.allDayItems.length <= MAX_VISIBLE_ITEMS || expandedAllDay) {
      return timeBlocks.allDayItems
    }
    return timeBlocks.allDayItems.slice(0, MAX_VISIBLE_ITEMS)
  }, [timeBlocks.allDayItems, expandedAllDay])

  // Calculate rotation for chevron icon
  const allDayChevronRotation = allDayRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  })

  // ===== Data Loading =====
  const loadItems = useCallback(() => {
    const newItems: Record<string, AgendaItem[]> = {}
    // Define the period – today and the next 365 days
    const startDate = new Date()
    const daysCount = 365

    for (let i = 0; i < daysCount; i++) {
      const day = addDays(startDate, i)
      const dateKey = format(day, 'yyyy-MM-dd')
      newItems[dateKey] = []
    }

    // Process tasks that have a scheduled date
    tasks.forEach((task: Task) => {
      if (task.scheduledAt) {
        const taskDate = parseISO(task.scheduledAt)
        if (isValid(taskDate)) {
          const dateKey = format(taskDate, 'yyyy-MM-dd')
          if (newItems[dateKey]) {
            newItems[dateKey].push({
              id: task.id,
              type: 'task',
              title: task.title,
              scheduledAt: task.scheduledAt,
              description: task.description,
              originalData: task,
              isAllDay: task.isAllDay || false,
            })
          }
        } else {
          console.warn(
            `Skipping task with invalid scheduledAt: ${task.id}, ${task.scheduledAt}`,
          )
        }
      }
    })

    // Process habits
    for (let i = 0; i < daysCount; i++) {
      const day = addDays(startDate, i)
      const dateKey = format(day, 'yyyy-MM-dd')
      const weekday: any = format(day, 'EEEE')

      habits.forEach((habit: Habit) => {
        if (!habit.scheduledAt || habit.scheduledAt.length === 0) {
          newItems[dateKey].push({
            id: habit.id,
            type: 'habit',
            title: habit.title,
            description: habit.description,
            originalData: habit,
          })
        } else if (habit.scheduledAt.includes(weekday)) {
          newItems[dateKey].push({
            id: habit.id,
            type: 'habit',
            title: habit.title,
            description: habit.description,
            originalData: habit,
          })
        }
      })
    }

    setItems(newItems)
  }, [tasks, habits])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  // First, add a constant for the timeline height
  const TIME_SLOT_HEIGHT = 60 // Height in pixels for each hour slot

  // Fix the useEffect for initial scroll
  useEffect(() => {
    if (selectedDate === today) {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Calculate position in pixels, not percentage
      const hourFraction = currentHour + currentMinute / 60
      const scrollPosition = hourFraction * TIME_SLOT_HEIGHT

      // Add a small delay to ensure the timeline has rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: scrollPosition - 100, // Offset to show a bit of context above current time
          animated: false,
        })
      }, 100)
    }
  }, [selectedDate, today])

  // ===== Event Handlers =====
  // Handle day press
  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString)
  }

  // Handle long press on a time slot
  const handleTimeSlotLongPress = (hour: number) => {
    // Create a date at the selected hour for today
    const [year, month, day] = selectedDate.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    dateObj.setHours(hour)

    // Set the form type to task
    setFormType('task')

    // Pre-populate the task form with the selected time and isAllDay = false
    updateCurrentTask({
      scheduledAt: dateObj.toISOString(),
      isAllDay: false,
    })

    // Show the task form
    showBottomSheet('addTask')
  }

  // Toggle expansion of all-day events
  const toggleAllDayExpansion = () => {
    const isExpanding = !expandedAllDay
    setExpandedAllDay(isExpanding)

    Animated.parallel([
      // Rotate chevron with spring for natural motion
      Animated.spring(allDayRotationAnim, {
        toValue: isExpanding ? 1 : 0,
        friction: 10, // Higher friction = less bounce
        tension: 50, // Controls speed and bounce
        useNativeDriver: true,
      }),

      // Expand/collapse container with spring
      Animated.spring(allDayHeightAnim, {
        toValue: isExpanding ? 1 : 0,
        friction: 10,
        tension: 50,
        useNativeDriver: false,
      }),
    ]).start()
  }

  // Fix the scrollToToday function
  const scrollToToday = () => {
    setSelectedDate(today)

    // Add a small delay to allow state update
    setTimeout(() => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Calculate position in pixels
      const hourFraction = currentHour + currentMinute / 60
      const scrollPosition = hourFraction * TIME_SLOT_HEIGHT

      scrollViewRef.current?.scrollTo({
        y: scrollPosition - 100, // Show context above current time
        animated: true,
      })
    }, 50)
  }

  // ===== Rendering Functions =====
  // Render a date header
  const renderHeaderDate = useCallback(() => {
    // Create a date that preserves the day
    const [year, month, day] = selectedDate.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)

    return {
      day: format(dateObj, 'd'),
      month: format(dateObj, 'MMM'),
    }
  }, [selectedDate])

  // Generate marked dates for calendar
  const generateMarkedDates = () => {
    const markedDates: any = {}

    // Get all keys (dates) from items and mark them
    Object.keys(items).forEach((dateString) => {
      if (items[dateString] && items[dateString].length > 0) {
        markedDates[dateString] = {
          marked: true,
          dotColor: theme.colors.primary,
        }
      }
    })

    // Mark selected date
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: theme.colors.primary,
      dotColor: theme.colors.onPrimary,
      marked: markedDates[selectedDate]?.marked || false,
    }

    return markedDates
  }

  // Render an individual item
  const renderItem = (item: AgendaItem) => {
    const isHabit = item.type === 'habit'
    const itemColor = isHabit
      ? theme.colors.onSecondaryContainer + '88'
      : theme.colors.onTertiaryContainer + '88'

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          showBottomSheet(isHabit ? 'habitDetails' : 'taskDetails', {
            [item.type]: item.originalData || item,
          })
        }}
        style={[styles.itemContainer]}
      >
        <Text style={[styles.itemTitle]}>{item.title}</Text>
        <Text style={[styles.itemType, { color: itemColor }]}>
          {isHabit ? 'Habit' : 'Task'}
        </Text>
        {item.scheduledAt && item.scheduledAt.includes('T') && (
          <Text style={[styles.itemTime, { color: theme.colors.outline }]}>
            {format(new Date(item.scheduledAt), 'hh:mm a')}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  // Modify the renderTimeBlocks function to look like Google Calendar
  const renderTimeBlocks = () => {
    // Create an array of hours (0-23) for the left time column
    const timeSlots = Array.from({ length: 24 }, (_, i) => i)

    return (
      <View style={styles.timelineContainer}>
        {/* Time column on the left */}
        <View style={styles.timeColumn}>
          {timeSlots.map((hour) => (
            <View
              key={`time-${hour}`}
              style={styles.timeSlot}
            >
              <Text style={[styles.timeLabel, { color: theme.colors.outline }]}>
                {hour === 0
                  ? '12 AM'
                  : hour === 12
                    ? '12 PM'
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
              </Text>
            </View>
          ))}
        </View>

        {/* Content column with events */}
        <View style={styles.eventsColumn}>
          {/* Current time indicator */}
          {selectedDate === today && (
            <View
              style={[
                styles.currentTimeIndicator,
                {
                  top: `${((new Date().getHours() * 60 + new Date().getMinutes()) / (24 * 60)) * 100}%`,
                  backgroundColor: theme.colors.error,
                },
              ]}
            />
          )}

          {/* Time slot grid lines with long press handlers */}
          {timeSlots.map((hour) => (
            <TouchableOpacity
              key={`grid-${hour}`}
              style={[
                styles.timeSlotGrid,
                {
                  top: `${(hour / 24) * 100}%`,
                  borderTopColor:
                    hour % 2 === 0
                      ? theme.colors.outline + '60'
                      : theme.colors.outline + '30',
                  height: `${(1 / 24) * 100}%`,
                },
              ]}
              onLongPress={() => handleTimeSlotLongPress(hour)}
              delayLongPress={500}
            />
          ))}

          {/* Render events positioned at their time */}
          {currentItems
            .filter(
              (item) =>
                item.scheduledAt &&
                item.scheduledAt.includes('T') &&
                !item.isAllDay &&
                !item.originalData?.isAllDay &&
                !item.scheduledAt.includes('T00:00:00') &&
                !item.scheduledAt.includes('T00:00.000'),
            )
            .map((item) => {
              // Calculate position based on time
              const date = parseISO(item.scheduledAt!)
              const hour = date.getHours()
              const minute = date.getMinutes()
              const topPosition = ((hour * 60 + minute) / (24 * 60)) * 100

              // Default duration: 1 hour
              const heightPercentage = 100 / 24

              return (
                <View
                  key={item.id}
                  style={[
                    styles.timePositionedEvent,
                    {
                      top: `${topPosition}%`,
                      height: `${heightPercentage}%`,
                      backgroundColor:
                        item.type === 'habit'
                          ? theme.colors.primaryContainer
                          : theme.colors.secondaryContainer,
                      borderLeftColor:
                        item.type === 'habit'
                          ? theme.colors.primary
                          : theme.colors.secondary,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.eventContent}
                    onPress={() => {
                      showBottomSheet(
                        item.type === 'habit' ? 'habitDetails' : 'taskDetails',
                        { [item.type]: item.originalData || item },
                      )
                    }}
                  >
                    <Text
                      style={styles.eventTitle}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.eventTime}>
                      {format(date, 'h:mm a')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            })}
        </View>
      </View>
    )
  }

  // ===== Render Component =====
  return (
    <View style={styles.container}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
      >
        <WeekCalendar
          current={today}
          onDayPress={onDayPress}
          markedDates={generateMarkedDates()}
          allowShadow={true}
          theme={{
            calendarBackground: theme.colors.background,
            textSectionTitleColor: theme.colors.onSurface,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.onPrimary,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.onSurface,
            textDisabledColor: theme.colors.outline,
            dotColor: theme.colors.primary,
            selectedDotColor: theme.colors.onPrimary,
            arrowColor: theme.colors.primary,
            monthTextColor: theme.colors.onSurface,
            indicatorColor: theme.colors.primary,
            textDayFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outline + '30',
            paddingBottom: 10,
          }}
        />

        {/* Fixed All-Day Section Header */}
        <View style={styles.allDaySection}>
          <View style={styles.allDayLabelContainer}>
            <Text
              style={[
                styles.allDayLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {renderHeaderDate().day}
            </Text>
            <Text
              style={[
                styles.allDayLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {renderHeaderDate().month}
            </Text>

            {/* Move expand button here */}
            {timeBlocks.allDayItems.length > MAX_VISIBLE_ITEMS && (
              <TouchableOpacity
                onPress={toggleAllDayExpansion}
                activeOpacity={0.7}
                style={{ marginTop: 16 }}
              >
                <Animated.View
                  style={{ transform: [{ rotate: allDayChevronRotation }] }}
                >
                  <ChevronDown
                    size={24}
                    color={theme.colors.primary}
                  />
                </Animated.View>
              </TouchableOpacity>
            )}
          </View>
          {/* <View style={styles.allDayEventsContainer}> */}
          <Animated.View
            style={[
              styles.allDayEventsContainer,
              {
                // Interpolate height from collapsed to expanded state
                height: allDayHeightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    // From minimum height (showing MAX_VISIBLE_ITEMS)
                    Math.min(timeBlocks.allDayItems.length, MAX_VISIBLE_ITEMS) *
                      ITEM_HEIGHT,
                    // To full height (showing all items)
                    Math.max(
                      timeBlocks.allDayItems.length * ITEM_HEIGHT,
                      ITEM_HEIGHT,
                    ),
                  ],
                  // Make sure we don't go below 0
                  extrapolate: 'clamp',
                }),
                overflow: 'hidden',
              },
            ]}
          >
            {/* Visible all-day items */}
            {timeBlocks.allDayItems.length > 0 ? (
              timeBlocks.allDayItems.map((item, index) => (
                <Animated.View
                  key={item.id}
                  style={{
                    // Fade in additional items beyond MAX_VISIBLE_ITEMS
                    opacity: index >= MAX_VISIBLE_ITEMS ? allDayHeightAnim : 1,
                  }}
                >
                  {renderItem(item)}
                </Animated.View>
              ))
            ) : (
              <Text
                style={[
                  styles.emptyAllDayText,
                  { color: theme.colors.outline },
                ]}
              >
                No all-day events
              </Text>
            )}
          </Animated.View>
        </View>

        {/* Scrollable Timeline */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={styles.itemsContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Time-specific events in a Google Calendar style view */}
          {renderTimeBlocks()}
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

        {/* Floating Button to Scroll Back to Today */}
        {selectedDate !== today && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={scrollToToday}
          >
            <Text style={styles.floatingButtonText}>Today</Text>
          </TouchableOpacity>
        )}
      </CalendarProvider>
    </View>
  )
}
