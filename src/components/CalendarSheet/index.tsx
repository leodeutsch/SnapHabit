import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Picker } from '@react-native-picker/picker'
import { useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { FlatList } from 'react-native-gesture-handler'
import { TimePickerModal } from 'react-native-paper-dates'
import { v4 as uuid } from 'uuid'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useTheme } from '../../hooks/useTheme'
import { Reminder, ReminderOption } from '../../types/reminder.type'
import { calendarSheetStyles, calendarTheme } from './styles'

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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Reminder>)

export const CalendarSheet: React.FC = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => calendarSheetStyles(theme), [theme])
  const { currentTask, updateCurrentTask } = useTaskForm()
  const { hideBottomSheet, showBottomSheet } = useBottomSheet()
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(
    currentTask.scheduledAt || null,
  )
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showCustomReminderModal, setShowCustomReminderModal] = useState(false)
  const [customReminderValue, setCustomReminderValue] = useState(0)
  const [customReminderUnit, setCustomReminderUnit] = useState<
    'minutes' | 'hours' | 'days'
  >('minutes')
  const [selectedReminders, setSelectedReminders] = useState<Reminder[]>(
    currentTask.reminders || [],
  )

  const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date()

  const handleDateSelect = (date: DateData) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date()
    newDate.setFullYear(date.year)
    newDate.setMonth(date.month - 1)
    newDate.setDate(date.day)

    setSelectedDate(newDate.toISOString())
  }

  const onConfirmTime = ({
    hours,
    minutes,
  }: {
    hours: number
    minutes: number
  }) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date()
    newDate.setHours(hours)
    newDate.setMinutes(minutes)

    setSelectedDate(newDate.toISOString())
    setShowTimePicker(false)
  }

  const toMarkedDates = () => {
    if (!selectedDate) return {}

    const date = new Date(selectedDate)
    const dateString = date.toISOString().split('T')[0] // YYYY-MM-DD

    return {
      [dateString]: {
        selected: true,
        marked: false,
        selectedColor: theme.colors.primary,
      },
    }
  }

  const openReminderModal = () => {
    if (selectedDate) {
      // Initialize with current reminders
      setSelectedReminders([...reminders])
      setShowReminderModal(true)
    }
  }

  const handleAddReminder = (option: ReminderOption, id: string) => {
    if (option === 'custom') {
      setShowCustomReminderModal(true)
    } else {
      setSelectedReminders((prev) => {
        const existingIndex = prev.findIndex((reminder) => reminder.id === id)
        if (existingIndex !== -1) {
          return prev.filter((_, index) => index !== existingIndex)
        } else {
          return [...prev, { id, type: option }]
        }
      })
    }
  }

  const handleAddCustomReminder = () => {
    if (validateCustomReminder(customReminderValue, customReminderUnit)) {
      setReminders([
        ...reminders,
        {
          id: uuid(),
          type: 'custom',
          customValue: customReminderValue,
          customUnit: customReminderUnit,
        },
      ])
      setShowCustomReminderModal(false)
    } else {
      // Show an error message
      Alert.alert(
        'Invalid Reminder',
        'The reminder time is not valid for the scheduled task time.',
      )
    }
  }

  const validateCustomReminder = (
    value: number,
    unit: 'minutes' | 'hours' | 'days',
  ) => {
    if (!selectedDate) return false

    const scheduledDate = new Date(selectedDate)
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

  const flatListRef = useRef<FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const renderReminderOption = ({ item }: { item: Reminder }) => {
    // Check if this item is in selectedReminders, not reminders
    const isSelected = selectedReminders.some((r) => r.id === item.id)

    return (
      <TouchableOpacity
        style={[
          styles.reminderOption,
          isSelected && {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primaryContainer,
          },
        ]}
        onPress={() => handleAddReminder(item.type, item.id)}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && {
              color: theme.colors.primary,
              fontWeight: 'bold',
            },
          ]}
        >
          {item.type}
        </Text>
      </TouchableOpacity>
    )
  }

  const handleSave = () => {
    updateCurrentTask({
      ...currentTask,
      scheduledAt: selectedDate ?? undefined,
      reminders: reminders,
    })

    // Go back to the task form
    showBottomSheet('addTask')
  }

  return (
    <View style={styles.container}>
      <View style={styles.sheetHeader}>
        <TouchableOpacity
          onPress={hideBottomSheet}
          style={styles.headerButton}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
        >
          <MaterialIcons
            name="check"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <Calendar
        disableAllTouchEventsForDisabledDays={true}
        current={new Date().toISOString().split('T')[0]}
        onDayPress={handleDateSelect}
        markedDates={toMarkedDates()}
        renderArrow={(direction: any) => (
          <MaterialIcons
            name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
            size={24}
            color={theme.colors.primary}
          />
        )}
        theme={calendarTheme(theme)}
        style={styles.calendar}
      />

      <View style={styles.timePickerContainer}>
        <Text style={styles.timePickerLabel}>When?</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.timePickerButton}
        >
          <Text style={styles.timePickerButtonText}>
            {selectedDate
              ? selectedDateObj.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Set Time'}
          </Text>
          <MaterialIcons
            name="access-time"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.timePickerContainer}>
        <Text style={styles.timePickerLabel}>Reminder</Text>
        <TouchableOpacity
          onPress={openReminderModal}
          style={[
            styles.timePickerButton,
            !selectedDate && styles.disabledButton,
          ]}
        >
          <Text
            style={[
              styles.timePickerButtonText,
              !selectedDate && { color: theme.colors.outline },
            ]}
          >
            {reminders.length > 0
              ? `${reminders.length} reminder${reminders.length > 1 ? 's' : ''}`
              : 'Set Reminder'}
          </Text>
          <MaterialIcons
            name="notifications"
            size={24}
            color={selectedDate ? theme.colors.primary : theme.colors.outline}
          />
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <TimePickerModal
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          onConfirm={onConfirmTime}
          hours={selectedDateObj.getHours()}
          minutes={selectedDateObj.getMinutes()}
          use24HourClock={false}
        />
      )}

      {showReminderModal && (
        <Modal
          visible={showReminderModal}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose when to be reminded</Text>
              <AnimatedFlatList
                ref={flatListRef}
                data={REMINDER_OPTIONS.map((option) => ({
                  id: uuid(),
                  type: option,
                }))}
                renderItem={renderReminderOption}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.reminderOptionsContainer}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true },
                )}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowReminderModal(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => {
                    // Save selected reminders to the reminders list
                    setReminders(selectedReminders)
                    setShowReminderModal(false)
                  }}
                >
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showCustomReminderModal && (
        <Modal
          visible={showCustomReminderModal}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Custom Reminder</Text>
              <Picker
                selectedValue={customReminderValue}
                onValueChange={(itemValue) => setCustomReminderValue(itemValue)}
              >
                {[...Array(60)].map((_, i) => (
                  <Picker.Item
                    key={i}
                    label={i.toString()}
                    value={i}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={customReminderUnit}
                onValueChange={(itemValue) => setCustomReminderUnit(itemValue)}
              >
                <Picker.Item
                  label="Minutes"
                  value="minutes"
                />
                <Picker.Item
                  label="Hours"
                  value="hours"
                />
                <Picker.Item
                  label="Days"
                  value="days"
                />
              </Picker>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCustomReminder}
              >
                <Text>Add Custom Reminder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCustomReminderModal(false)}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}
