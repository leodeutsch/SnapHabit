import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import 'react-native-get-random-values'
import { Button, Chip, Switch } from 'react-native-paper'
import { TimePickerModal } from 'react-native-paper-dates'
import { v4 as uuid } from 'uuid'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useHabitForm } from '../../hooks/useHabitForm'
import { useTheme } from '../../hooks/useTheme'
import { Reminder, RepeatPattern, WeekDays } from '../../types'
import { calendarSheetStyles } from './styles'

const WEEK_DAYS: WeekDays[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const HabitDaysSheet: React.FC = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => calendarSheetStyles(theme), [theme])
  const { currentHabit, updateCurrentHabit } = useHabitForm()
  const { showBottomSheet } = useBottomSheet()

  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [hours, setHours] = useState(12)
  const [minutes, setMinutes] = useState(0)

  // Days and pattern states
  const [selectedDays, setSelectedDays] = useState<WeekDays[]>(
    currentHabit.scheduledAt || [],
  )
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>('weekly')
  const [isWeekly, setIsWeekly] = useState(repeatPattern === 'weekly')
  const [reminders, setReminders] = useState<Reminder[]>(
    currentHabit.reminders || [],
  )

  // Modal states
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showRepeatPatternModal, setShowRepeatPatternModal] = useState(false)

  // Load existing data when component mounts
  useEffect(() => {
    if (currentHabit.scheduledAt) {
      setSelectedDays(currentHabit.scheduledAt)
    }

    if (currentHabit.reminders) {
      setReminders(currentHabit.reminders)
    }
  }, [currentHabit])

  const openReminderModal = () => {
    if (selectedDays && selectedDays.length > 0) {
      setShowTimePicker(true)
    } else {
      Alert.alert(
        'Select Days First',
        'Please select at least one day of the week before setting reminders.',
        [{ text: 'OK' }],
      )
    }
  }

  const onChangeRepeatPattern = () => {
    setIsWeekly(!isWeekly)
    setRepeatPattern(isWeekly ? 'weekly' : 'none')
  }

  const handleTimeConfirm = ({
    hours,
    minutes,
  }: {
    hours: number
    minutes: number
  }) => {
    setHours(hours)
    setMinutes(minutes)
    setShowTimePicker(false)
    setShowRepeatPatternModal(true)
  }

  const addReminder = () => {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    const newReminder: Reminder = {
      id: uuid(),
      // @ts-ignore
      time: timeString,
      repeatPattern,
      days: repeatPattern === 'weekly' ? selectedDays : undefined,
    }

    setReminders((prev) => [...prev, newReminder])
    setShowRepeatPatternModal(false)
  }

  const removeReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }

  const handleSave = () => {
    updateCurrentHabit({
      ...currentHabit,
      scheduledAt: selectedDays.length > 0 ? selectedDays : undefined,
      reminders: reminders.length > 0 ? reminders : undefined,
    })

    // Navigate back to the AddHabit form
    showBottomSheet('addHabit')
  }

  // const formatReminderTime = (reminder: Reminder) => {
  //   return `${reminder.time} - ${reminder.repeatPattern}`
  // }

  return (
    <View style={styles.container}>
      <View style={styles.sheetHeader}>
        <TouchableOpacity
          onPress={() => showBottomSheet('addHabit')}
          style={styles.headerButton}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
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

      {/* Weekday Selection */}
      <View>
        <Text style={styles.sectionTitle}>On which days?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekDaysContainer}
        >
          {WEEK_DAYS.map((day, index) => (
            <Chip
              key={index}
              compact
              selected={selectedDays?.includes(day)}
              selectedColor={theme.colors.primary}
              rippleColor={theme.colors.inversePrimary}
              showSelectedCheck={false}
              style={[
                styles.weekDayChip,
                selectedDays?.includes(day) && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              textStyle={[
                styles.weekDayChipText,
                !selectedDays?.includes(day)
                  ? { color: theme.colors.onSurface }
                  : { color: theme.colors.onPrimary },
              ]}
              onPress={() =>
                setSelectedDays((prev) => {
                  return prev.includes(day)
                    ? prev.filter((d) => d !== day)
                    : [...prev, day]
                })
              }
            >
              {day}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Reminders Section */}
      <View style={styles.remindersSection}>
        <View style={styles.reminderHeader}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[
                styles.noRemindersText,
                selectedDays.length !== 0 && { color: theme.colors.onSurface },
              ]}
            >
              Weekly?
            </Text>
            <Switch
              value={isWeekly}
              onValueChange={onChangeRepeatPattern}
              disabled={selectedDays.length === 0}
            />
          </View>
        </View>

        {/* {reminders.length > 0 ? (
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.time}
                description={`${item.repeatPattern === 'weekly' ? 'Weekly on selected days' : selectedDays.length === 7 ? 'Daily' : ''}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="bell-outline"
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <TouchableOpacity onPress={() => removeReminder(item.id)}>
                    <List.Icon
                      {...props}
                      icon="delete"
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                )}
                style={styles.reminderItem}
              />
            )}
          />
        ) : (
          <Text style={styles.noRemindersText}>No reminders set</Text>
        )} */}

        <Button
          mode="contained"
          icon="bell-plus"
          style={styles.addReminderButton}
          onPress={openReminderModal}
        >
          Add Reminder
        </Button>
      </View>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        hours={hours}
        minutes={minutes}
        label="Select reminder time"
        cancelLabel="Cancel"
        confirmLabel="Set Time"
        use24HourClock={false}
      />
    </View>
  )
}
