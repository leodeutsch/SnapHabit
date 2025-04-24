import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import MaskedView from '@react-native-masked-view/masked-view'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import {
  BellRing,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock8,
  X,
} from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Button } from 'react-native-paper'
import { TimerPicker } from 'react-native-timer-picker'
import { v4 as uuid } from 'uuid'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { Reminder, ReminderOption } from '../../types/reminder.type'
import { Task } from '../../types/task.type'
import { calendarSheetStyles, calendarTheme } from './styles'

// Constants
const REMINDER_OPTIONS: ReminderOption[] = [
  'on time',
  '5 minutes before',
  '10 minutes before',
  '30 minutes before',
  '1 hour before',
  '2 hours before',
  'day before at 9am',
  'custom',
]

// Animated component
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Reminder>)

/**
 * Types for date handling
 */
type DateMode = 'allDay' | 'timed'

interface DateState {
  mode: DateMode
  dateString: string // 'YYYY-MM-DD' for allDay, ISO string for timed
}

/**
 * Calendar sheet component for scheduling tasks
 * Handles both all-day events and timed events
 */
export const CalendarSheet: React.FC = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => calendarSheetStyles(theme), [theme])
  const { currentTask, updateCurrentTask } = useTaskForm()
  const { updateTask } = useTasks()
  const { hideBottomSheet, showBottomSheet, isVisible, content, data } =
    useBottomSheet()

  // BottomSheet refs
  const bottomSheetRef = useRef<BottomSheet>(null)
  const reminderBottomSheetRef = useRef<BottomSheetModal>(null)
  const customReminderBottomSheetRef = useRef<BottomSheetModal>(null)
  const customValueBottomSheetRef = useRef<BottomSheetModal>(null)
  const customUnitBottomSheetRef = useRef<BottomSheetModal>(null)
  const timePickerBottomSheetRef = useRef<BottomSheetModal>(null)

  // Snap points for bottom sheets
  const snapPoints = useMemo(() => ['64%'], [])
  const reminderSnapPoints = useMemo(() => ['40%'], [])
  const customReminderSnapPoints = useMemo(() => ['32%'], [])
  const customValueSnapPoints = useMemo(() => ['32%'], [])
  const customUnitSnapPoints = useMemo(() => ['36%'], [])
  const timePickerSnapPoints = useMemo(() => ['44%'], [])

  // Visibility and basic state
  const isCalendarVisible = isVisible && content === 'calendar'
  const today = new Date()
  const isEditMode = Boolean(data?.task && data?.returnTo === 'taskDetails')

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(
    isEditMode ? data?.task ?? null : null,
  )

  /**
   * Unified date state handling both all-day and timed events
   */
  const [dateState, setDateState] = useState<DateState>(() => {
    // Initialize from task or currentTask, if available
    const scheduledAt = taskToEdit?.scheduledAt || currentTask.scheduledAt

    if (scheduledAt) {
      // Check if it's an all-day event (no time portion)
      if (scheduledAt.length === 10 && !scheduledAt.includes('T')) {
        return { mode: 'allDay', dateString: scheduledAt }
      } else {
        return { mode: 'timed', dateString: scheduledAt }
      }
    }

    // Default: today as all-day
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    return { mode: 'allDay', dateString: `${y}-${m}-${d}` }
  })

  /**
   * Get a Date object from the current dateState
   * Handles both all-day and timed events, ensuring correct date for all-day
   */
  const getSelectedDate = (): Date => {
    if (dateState.dateString) {
      if (dateState.mode === 'allDay') {
        // For all-day events, parse YYYY-MM-DD explicitly to avoid timezone shifts
        const [year, month, day] = dateState.dateString.split('-').map(Number)
        return new Date(year, month - 1, day)
      }
      // For timed events, use the ISO string directly
      return new Date(dateState.dateString)
    }
    return today
  }

  /**
   * Format a date as YYYY-MM-DD string (for all-day events)
   */
  const formatDateYMD = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Time picker state
  const [pickerTime, setPickerTime] = useState<{
    hours: number
    minutes: number
  }>(() => {
    const selectedDate = getSelectedDate()
    return {
      hours: selectedDate.getHours(),
      minutes: selectedDate.getMinutes(),
    }
  })

  // Reminder states
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [customReminderValue, setCustomReminderValue] = useState(0)
  const [isCurrentMonth, setIsCurrentMonth] = useState(true)
  const [customReminderUnit, setCustomReminderUnit] = useState<
    'minutes' | 'hours' | 'days'
  >('minutes')
  const [selectedReminders, setSelectedReminders] = useState<Reminder[]>(
    taskToEdit?.reminders || currentTask.reminders || [],
  )

  // Effects
  useEffect(() => {
    if (isCalendarVisible) {
      bottomSheetRef.current?.snapToIndex(0)
    } else {
      bottomSheetRef.current?.close()
    }
  }, [isCalendarVisible])

  // Sheet event handlers
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        handleCloseSheet()
      }
    },
    [hideBottomSheet],
  )

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0}
        onPress="close"
      />
    ),
    [],
  )

  /**
   * Handle date selection from calendar
   * Sets the mode to all-day and updates the date
   */
  const handleDateSelect = (date: DateData) => {
    const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`

    setDateState({
      mode: 'allDay',
      dateString: dateString,
    })

    // Update task all-day flag based on edit mode
    if (isEditMode && taskToEdit) {
      setTaskToEdit({
        ...taskToEdit,
        isAllDay: true,
      })
    } else {
      currentTask.isAllDay = true
    }
  }

  /**
   * Handle time confirmation from time picker
   * Sets the mode to timed and updates the date with time
   */
  const onConfirmTime = ({
    hours,
    minutes,
  }: {
    hours: number
    minutes: number
  }) => {
    // Create a new date based on the selected date and time
    const selectedDate = getSelectedDate()
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes,
      0,
      0,
    )

    // Update state with timed mode and ISO string
    setDateState({
      mode: 'timed',
      dateString: newDate.toISOString(),
    })

    // Update task all-day flag based on edit mode
    if (isEditMode && taskToEdit) {
      setTaskToEdit({
        ...taskToEdit,
        isAllDay: false,
      })
    } else {
      currentTask.isAllDay = false
    }

    timePickerBottomSheetRef.current?.close()
  }

  /**
   * Convert current date state to marked dates format for calendar
   */
  const toMarkedDates = () => {
    let dateString: string

    if (!dateState.dateString) {
      dateString = formatDateYMD(today)
    } else if (dateState.mode === 'allDay') {
      dateString = dateState.dateString
    } else {
      // For timed events, extract just the date part
      dateString = dateState.dateString.split('T')[0]
    }

    return {
      [dateString]: {
        selected: true,
        marked: false,
        selectedColor: theme.colors.primary,
      },
    }
  }

  /**
   * Handle month change in calendar
   */
  const handleMonthChange = (date: DateData) => {
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()
    setIsCurrentMonth(date.month === currentMonth && date.year === currentYear)
  }

  /**
   * Render calendar arrows
   */
  const renderArrows = (direction: 'left' | 'right', month: any) => {
    const arrowColor =
      direction === 'left' && isCurrentMonth
        ? theme.colors.outline
        : theme.colors.primary

    return direction === 'left' ? (
      <ChevronLeft
        size={24}
        color={arrowColor}
      />
    ) : (
      <ChevronRight
        size={24}
        color={arrowColor}
      />
    )
  }

  /**
   * Handle adding a reminder
   */
  const handleAddReminder = (item: Reminder) => {
    if (item.type === 'custom') {
      reminderBottomSheetRef.current?.close()
      setTimeout(() => {
        customReminderBottomSheetRef.current?.present()
      }, 150)
    } else {
      setSelectedReminders((prev) => {
        const exists = prev.some((r) => r.id === item.id)
        if (exists) {
          return prev.filter((r) => r.id !== item.id)
        } else {
          return [...prev, item]
        }
      })
    }
  }

  /**
   * Handle adding a custom reminder
   */
  const handleAddCustomReminder = () => {
    if (validateCustomReminder(customReminderValue, customReminderUnit)) {
      const newCustomReminder = {
        id: uuid(),
        type: 'custom' as const,
        customValue: customReminderValue,
        customUnit: customReminderUnit,
      }
      setSelectedReminders((prev) => [...prev, newCustomReminder])
      customReminderBottomSheetRef.current?.close()
      setTimeout(() => {
        reminderBottomSheetRef.current?.present()
      }, 150)
    } else {
      Alert.alert(
        'Invalid Reminder',
        'The reminder time is not valid for the scheduled task time.',
      )
    }
  }

  /**
   * Validate a custom reminder
   */
  const validateCustomReminder = (
    value: number,
    unit: 'minutes' | 'hours' | 'days',
  ) => {
    if (!dateState.dateString) return false
    const scheduledDate = new Date(dateState.dateString)
    const now = new Date()
    const diff = scheduledDate.getTime() - now.getTime()

    switch (unit) {
      case 'minutes':
        return diff > value * 60 * 1000
      case 'hours':
        return diff > value * 60 * 60 * 1000
      case 'days':
        return diff > value * 24 * 60 * 60 * 1000
    }
  }

  /**
   * Render a reminder option
   */
  const renderReminderOption = ({ item }: { item: Reminder }) => {
    const isSelected = selectedReminders.some((r) => r.id === item.id)
    return (
      <TouchableOpacity
        style={[
          styles.reminderOption,
          isSelected && { backgroundColor: theme.colors.primaryContainer },
        ]}
        onPress={() => handleAddReminder(item)}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && { color: theme.colors.primary, fontWeight: 'bold' },
          ]}
        >
          {item.type}
        </Text>
      </TouchableOpacity>
    )
  }

  /**
   * Handle closing the sheet
   */
  const handleCloseSheet = () => {
    if (isEditMode && taskToEdit) {
      setTimeout(() => {
        showBottomSheet('taskDetails', { task: taskToEdit })
      }, 100)
    } else {
      currentTask.scheduledAt = undefined
      currentTask.reminders = undefined
      setDateState({ mode: 'allDay', dateString: formatDateYMD(today) })
      setReminders([])
      setSelectedReminders([])
      setPickerTime({ hours: 0, minutes: 0 })
      setCustomReminderValue(0)
      hideBottomSheet()
    }
  }

  /**
   * Set a date as an all-day event
   * Uses the current dateState to maintain consistency
   */
  const handleSetAllDay = () => {
    // Get the current selected date without time
    const selectedDate = getSelectedDate()
    const allDayDateString = formatDateYMD(selectedDate)

    // Update state to all-day mode with YYYY-MM-DD format
    setDateState({
      mode: 'allDay',
      dateString: allDayDateString,
    })

    // Update task all-day flag based on edit mode
    if (isEditMode && taskToEdit) {
      setTaskToEdit({ ...taskToEdit, isAllDay: true })
    } else {
      currentTask.isAllDay = true
    }

    timePickerBottomSheetRef.current?.close()
  }

  /**
   * Save the task with current date settings
   */
  const handleSave = () => {
    const isAllDay = dateState.mode === 'allDay'

    if (isEditMode && taskToEdit) {
      const updatedTask = {
        ...taskToEdit,
        scheduledAt: dateState.dateString,
        reminders: selectedReminders.length > 0 ? selectedReminders : undefined,
        isAllDay,
      }
      updateTask(updatedTask)
      showBottomSheet('taskDetails', { task: updatedTask })
    } else {
      updateCurrentTask({
        ...currentTask,
        scheduledAt: dateState.dateString,
        reminders: selectedReminders.length > 0 ? selectedReminders : undefined,
        isAllDay,
      })
      showBottomSheet('addTask')
    }
  }

  /**
   * Open the time picker
   */
  const handleOpenTimePicker = () => {
    const selectedDate = getSelectedDate()
    setPickerTime({
      hours: selectedDate.getHours(),
      minutes: selectedDate.getMinutes(),
    })
    timePickerBottomSheetRef.current?.present()
  }

  /**
   * Format time for display
   */
  const getDisplayTime = (): string => {
    if (!dateState.dateString) return 'When?'

    if (dateState.mode === 'allDay') {
      return 'All day'
    }

    const date = new Date(dateState.dateString)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isCalendarVisible) return null

  return (
    <Portal>
      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          animateOnMount
          enableDynamicSizing={false}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.outlineVariant,
          }}
          backgroundStyle={{ backgroundColor: theme.colors.surface }}
        >
          <BottomSheetView style={styles.container}>
            <Calendar
              disableAllTouchEventsForDisabledDays
              current={today.toISOString().split('T')[0]}
              disableLeftArrow={isCurrentMonth}
              onDayPress={handleDateSelect}
              onMonthChange={handleMonthChange}
              markedDates={toMarkedDates()}
              outsideMonthChanges={false}
              minDate={today.toISOString().split('T')[0]}
              hideExtraDays
              monthFormat="MMMM"
              renderArrow={renderArrows}
              theme={calendarTheme(theme)}
              style={styles.calendar}
            />
            <View style={styles.timePickerContainer}>
              <Button
                mode="contained-tonal"
                buttonColor={theme.colors.surfaceVariant}
                rippleColor={theme.colors.inversePrimary}
                textColor={theme.colors.onSurface}
                onPress={handleOpenTimePicker}
                icon={() => (
                  <Clock8
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              >
                {getDisplayTime()}
              </Button>
              <Button
                mode="contained-tonal"
                disabled={!dateState.dateString}
                buttonColor={theme.colors.surfaceVariant}
                rippleColor={theme.colors.inversePrimary}
                textColor={
                  dateState.dateString
                    ? theme.colors.onSurface
                    : theme.colors.outline
                }
                onPress={() => reminderBottomSheetRef.current?.present()}
                contentStyle={{ flexDirection: 'row-reverse' }}
                icon={() => (
                  <BellRing
                    size={22}
                    color={
                      dateState.dateString
                        ? theme.colors.primary
                        : theme.colors.surface
                    }
                  />
                )}
              >
                {reminders.length > 0
                  ? `${reminders.length} reminder${reminders.length > 1 ? 's' : ''}`
                  : 'Reminder'}
              </Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                mode="elevated"
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
                style={{ width: '100%' }}
                onPress={handleSave}
              >
                Confirm
              </Button>
            </View>

            {/* TimePicker Sheet */}
            <BottomSheetModal
              ref={timePickerBottomSheetRef}
              index={0}
              snapPoints={timePickerSnapPoints}
              enablePanDownToClose={true}
              enableContentPanningGesture={false}
              animateOnMount
              enableOverDrag={false}
              onDismiss={() => timePickerBottomSheetRef.current?.close()}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  opacity={0.4}
                  enableTouchThrough={false}
                  pressBehavior="close"
                />
              )}
              handleIndicatorStyle={{
                backgroundColor: theme.colors.outlineVariant,
              }}
              backgroundStyle={{ backgroundColor: theme.colors.surface }}
            >
              <BottomSheetView style={styles.bottomSheetContent}>
                <View style={styles.sheetHeader}>
                  <TouchableOpacity
                    onPress={() => timePickerBottomSheetRef.current?.close()}
                    style={styles.headerButton}
                  >
                    <X
                      size={24}
                      color={theme.colors.onSurface}
                    />
                  </TouchableOpacity>
                  <Button
                    compact
                    buttonColor={theme.colors.primaryContainer}
                    textColor={theme.colors.onPrimaryContainer}
                    onPress={handleSetAllDay}
                    style={{ height: 40, width: 80 }}
                  >
                    All day
                  </Button>
                  <TouchableOpacity
                    onPress={() => onConfirmTime(pickerTime)}
                    style={styles.headerButton}
                  >
                    <Check
                      size={24}
                      color={theme.colors.primary}
                      strokeWidth={3}
                    />
                  </TouchableOpacity>
                </View>
                <LinearGradient
                  colors={[theme.colors.surface, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <TimerPicker
                    padWithNItems={2}
                    hourLabel=":"
                    minuteLabel=""
                    hideSeconds
                    padHoursWithZero
                    initialValue={{
                      hours: pickerTime.hours,
                      minutes: pickerTime.minutes,
                    }}
                    onDurationChange={(duration) => setPickerTime(duration)}
                    LinearGradient={LinearGradient}
                    Haptics={Haptics}
                    MaskedView={MaskedView}
                    styles={{
                      theme: theme.dark ? 'dark' : 'light',
                      backgroundColor: 'transparent',
                      pickerItem: { fontSize: 32, color: theme.colors.primary },
                      pickerLabel: { fontSize: 24, marginTop: 0 },
                      pickerContainer: { marginRight: 6 },
                      pickerLabelContainer: {
                        right: -16,
                        width: 40,
                        alignItems: 'center',
                      },
                    }}
                  />
                </LinearGradient>
              </BottomSheetView>
            </BottomSheetModal>

            {/* Reminders modals - keeping original structure */}
            <BottomSheetModal
              ref={reminderBottomSheetRef}
              index={0}
              snapPoints={reminderSnapPoints}
              enablePanDownToClose={true}
              enableContentPanningGesture={false}
              animateOnMount
              enableOverDrag={false}
              onDismiss={() => {
                setReminders((prev) => [...prev])
                reminderBottomSheetRef.current?.close()
              }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  opacity={0.4}
                  enableTouchThrough={false}
                  pressBehavior="close"
                />
              )}
              handleIndicatorStyle={{
                backgroundColor: theme.colors.outlineVariant,
              }}
              backgroundStyle={{ backgroundColor: theme.colors.surface }}
            >
              <BottomSheetView style={styles.bottomSheetContent}>
                <View style={styles.sheetHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      setReminders((prev) => [...prev])
                      reminderBottomSheetRef.current?.close()
                    }}
                    style={styles.headerButton}
                  >
                    <X
                      size={24}
                      color={theme.colors.onSurface}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAddReminder}
                    style={styles.headerButton}
                  >
                    <Check
                      size={24}
                      color={theme.colors.primary}
                      strokeWidth={3}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalTitle}>
                  Choose when to be reminded
                </Text>
                <AnimatedFlatList
                  data={REMINDER_OPTIONS.map((option) => ({
                    id: option,
                    type: option,
                  }))}
                  renderItem={renderReminderOption}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  style={styles.reminderOptionsList}
                  contentContainerStyle={styles.reminderOptionsContainer}
                />
              </BottomSheetView>
            </BottomSheetModal>

            {/* Custom reminder modals - keeping original structure */}
            <BottomSheetModal
              ref={customReminderBottomSheetRef}
              index={0}
              snapPoints={customReminderSnapPoints}
              enablePanDownToClose={true}
              enableContentPanningGesture={false}
              animateOnMount
              enableOverDrag={false}
              onDismiss={() => {
                customReminderBottomSheetRef.current?.close()
                setTimeout(() => reminderBottomSheetRef.current?.present(), 150)
              }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  opacity={0.4}
                  enableTouchThrough={false}
                  pressBehavior="close"
                />
              )}
              handleIndicatorStyle={{
                backgroundColor: theme.colors.outlineVariant,
              }}
              backgroundStyle={{ backgroundColor: theme.colors.surface }}
            >
              <BottomSheetView style={styles.bottomSheetContent}>
                <View style={styles.sheetHeader}>
                  <TouchableOpacity
                    onPress={() =>
                      customReminderBottomSheetRef.current?.close()
                    }
                    style={styles.headerButton}
                  >
                    <X
                      size={24}
                      color={theme.colors.onSurface}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddCustomReminder}
                    style={styles.headerButton}
                  >
                    <Check
                      size={24}
                      color={theme.colors.primary}
                      strokeWidth={3}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalTitle}>Set Custom Reminder</Text>
                <View style={styles.customReminderContainer}>
                  <View style={styles.dropdownContainer}>
                    <Button
                      mode="outlined"
                      onPress={() =>
                        customValueBottomSheetRef.current?.present()
                      }
                      style={styles.valueButton}
                    >
                      {customReminderValue.toString()}
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() =>
                        customUnitBottomSheetRef.current?.present()
                      }
                      style={styles.unitButton}
                    >
                      {customReminderUnit === 'minutes'
                        ? 'Minutes before'
                        : customReminderUnit === 'hours'
                          ? 'Hours before'
                          : 'Days before'}
                    </Button>
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>

            {/* Value picker modal - keeping original structure */}
            <BottomSheetModal
              ref={customValueBottomSheetRef}
              index={0}
              snapPoints={customValueSnapPoints}
              enablePanDownToClose={true}
              enableContentPanningGesture={false}
              enableDynamicSizing={false}
              animateOnMount
              enableOverDrag={false}
              onDismiss={() => {
                customValueBottomSheetRef.current?.close()
                setTimeout(
                  () => customReminderBottomSheetRef.current?.present(),
                  150,
                )
              }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  opacity={0.4}
                  enableTouchThrough={false}
                  pressBehavior="close"
                />
              )}
              handleIndicatorStyle={{
                backgroundColor: theme.colors.outlineVariant,
              }}
              backgroundStyle={{ backgroundColor: theme.colors.surface }}
            >
              <BottomSheetView style={styles.bottomSheetContent}>
                <View style={styles.pickerModal}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Select Value</Text>
                  </View>
                  <FlatList
                    data={[...Array(60)].map((_, i) => i)}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.pickerItem,
                          customReminderValue === item &&
                            styles.pickerItemSelected,
                        ]}
                        onPress={() => {
                          setCustomReminderValue(item)
                          customValueBottomSheetRef.current?.close()
                          customReminderBottomSheetRef.current?.present()
                        }}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            customReminderValue === item &&
                              styles.pickerItemTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    numColumns={5}
                    contentContainerStyle={styles.pickerContent}
                  />
                </View>
              </BottomSheetView>
            </BottomSheetModal>

            {/* Unit picker modal - keeping original structure */}
            <BottomSheetModal
              ref={customUnitBottomSheetRef}
              index={0}
              snapPoints={customUnitSnapPoints}
              enablePanDownToClose={true}
              enableContentPanningGesture={false}
              enableDynamicSizing={false}
              animateOnMount
              enableOverDrag={false}
              onDismiss={() => {
                customUnitBottomSheetRef.current?.close()
                setTimeout(
                  () => customReminderBottomSheetRef.current?.present(),
                  150,
                )
              }}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  {...props}
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  opacity={0.4}
                  enableTouchThrough={false}
                  pressBehavior="close"
                />
              )}
              handleIndicatorStyle={{
                backgroundColor: theme.colors.outlineVariant,
              }}
              backgroundStyle={{ backgroundColor: theme.colors.surface }}
            >
              <BottomSheetView style={styles.bottomSheetContent}>
                <View style={styles.pickerModal}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Select Unit</Text>
                  </View>
                  {['minutes', 'hours', 'days'].map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.pickerItem,
                        styles.unitPickerItem,
                        customReminderUnit === unit &&
                          styles.pickerItemSelected,
                      ]}
                      onPress={() => {
                        setCustomReminderUnit(
                          unit as 'minutes' | 'hours' | 'days',
                        )
                        customUnitBottomSheetRef.current?.close()
                        customReminderBottomSheetRef.current?.present()
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          customReminderUnit === unit &&
                            styles.pickerItemTextSelected,
                        ]}
                      >
                        {unit === 'minutes'
                          ? 'Minutes before'
                          : unit === 'hours'
                            ? 'Hours before'
                            : 'Days before'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </Portal>
  )
}
