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
  CalendarRange,
  Check,
  RotateCw,
  Trash,
  X,
} from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import 'react-native-get-random-values'
import { Button, Chip, List, SegmentedButtons } from 'react-native-paper'
import { TimerPicker } from 'react-native-timer-picker'
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
  const { hideBottomSheet, showBottomSheet } = useBottomSheet()

  const timePickerBottomSheetRef = useRef<BottomSheetModal>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const reminderAnimationRef = useRef(new Animated.Value(0)).current
  const timePickerSnapPoints = useMemo(() => ['44%'], [])
  const [snapPoints, setSnapPoints] = useState(['48%'])
  const [showReminders, setShowReminders] = useState(false)

  // Time picker state
  const [hours, setHours] = useState(new Date().getHours())
  const [minutes, setMinutes] = useState(new Date().getMinutes())

  // Days and pattern states
  const [selectedDays, setSelectedDays] = useState<WeekDays[]>(
    currentHabit.scheduledAt || [],
  )
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>('weekly')
  const [isWeekly, setIsWeekly] = useState(repeatPattern === 'weekly')
  const [reminders, setReminders] = useState<Reminder[]>(
    currentHabit.reminders || [],
  )
  const [pickerTime, setPickerTime] = useState<{
    hours: number
    minutes: number
  }>({
    hours: hours,
    minutes: minutes,
  })

  // Add this state to track previous selections before switching to daily
  const [previousSelectedDays, setPreviousSelectedDays] = useState<WeekDays[]>(
    [],
  )

  // Modify the repeatPattern setter to handle the daily/weekly logic
  const handleRepeatPatternChange = (value: RepeatPattern) => {
    if (value === 'daily') {
      // Save current selection before switching to daily
      if (repeatPattern === 'weekly') {
        setPreviousSelectedDays([...selectedDays])
      }
      // Select all days when daily is chosen
      setSelectedDays([...WEEK_DAYS])
      setRepeatPattern('daily')
    } else {
      // If switching from daily to weekly, restore previous selection
      // but only if there were previously selected days
      if (repeatPattern === 'daily' && previousSelectedDays.length > 0) {
        setSelectedDays([...previousSelectedDays])
      }
      // Otherwise keep all days selected
      setRepeatPattern('weekly')
    }
  }

  // Add effect to check when all days are selected and automatically switch to daily
  useEffect(() => {
    if (repeatPattern === 'weekly' && selectedDays.length === 7) {
      setRepeatPattern('daily')
    } else if (selectedDays.length < 7 && repeatPattern === 'daily') {
      setRepeatPattern('weekly')
    }
  }, [selectedDays])

  // Update the day selection handler to maintain consistency with repeat pattern
  const handleDaySelection = (day: WeekDays) => {
    setSelectedDays((prev) => {
      const newSelection = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]

      // If we're removing a day while in daily mode, switch to weekly
      if (repeatPattern === 'daily' && newSelection.length < 7) {
        setRepeatPattern('weekly')
      }

      return newSelection
    })
  }

  // Load existing data when component mounts
  useEffect(() => {
    if (currentHabit.scheduledAt) {
      setSelectedDays(currentHabit.scheduledAt)
    }

    if (currentHabit.reminders) {
      setReminders(currentHabit.reminders)
    }
  }, [currentHabit])

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        // Sheet closed
        hideBottomSheet()
      }
    },
    [hideBottomSheet],
  )

  // Handle close sheet
  const handleCloseSheet = () => {
    currentHabit.scheduledAt = undefined
    currentHabit.reminders = undefined
    setReminders([])
    bottomSheetRef.current?.close()
    hideBottomSheet()
  }

  // Render backdrop component
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

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(reminderAnimationRef, {
        toValue: showReminders ? 256 : 0,
        duration: showReminders ? 300 : 300,
        useNativeDriver: false,
        easing: showReminders
          ? Easing.inOut(Easing.ease)
          : Easing.out(Easing.poly(2)),
      }).start(({ finished }) => {
        if (finished) {
          if (!showReminders) {
            setSnapPoints(['48%'])
          }
        }
      })
    }, 100)

    // When opening, immediately expand to accommodate content
    if (showReminders) {
      setSnapPoints(['80%'])
    }
  }, [showReminders])

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
  }

  const removeReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }

  const onConfirmTime = (time: { hours: number; minutes: number }) => {
    // Create the reminder using the values directly from time parameter
    const timeString = `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`

    const newReminder: Reminder = {
      id: uuid(),
      type: 'on time', // Set a valid type
      time: timeString,
      repeat: repeatPattern, // Use this consistently
      days: repeatPattern === 'weekly' ? selectedDays : undefined,
    }

    setReminders((prev) => [...prev, newReminder])

    // Close the time picker modal
    timePickerBottomSheetRef.current?.close()
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

  const renderIcon = (type: string, color: string) => {
    switch (type) {
      case 'daily':
        return (
          <RotateCw
            size={16}
            color={color}
          />
        )
      case 'weekly':
        return (
          <CalendarRange
            size={16}
            color={color}
          />
        )
      default:
        return null
    }
  }

  // const formatReminderTime = (reminder: Reminder) => {
  //   return `${reminder.time} - ${reminder.repeatPattern}`
  // }

  return (
    <Portal>
      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          overDragResistanceFactor={4}
          animateOnMount
          enableContentPanningGesture={false}
          enableDynamicSizing={false}
          onClose={handleCloseSheet}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.outlineVariant,
          }}
          backgroundStyle={{
            backgroundColor: theme.colors.surface,
          }}
        >
          <BottomSheetView style={styles.container}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                onPress={() => showBottomSheet('addHabit')}
                style={styles.headerButton}
              >
                <X
                  size={24}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Schedule</Text>
              <TouchableOpacity
                onPress={handleSave}
                style={styles.headerButton}
              >
                <Check
                  size={24}
                  color={theme.colors.primary}
                  strokeWidth={3}
                />
              </TouchableOpacity>
            </View>

            {/* Weekday Selection */}
            <View style={styles.weekDays}>
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
                    showSelectedCheck={false}
                    style={[
                      styles.weekDayChip,
                      selectedDays?.includes(day) && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    textStyle={[
                      !selectedDays?.includes(day)
                        ? { color: theme.colors.onSecondaryContainer }
                        : { color: theme.colors.onPrimary },
                    ]}
                    onPress={() => handleDaySelection(day)}
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
                {reminders.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => setShowReminders(!showReminders)}
                  >
                    <Text
                      style={[
                        styles.noRemindersText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {reminders.length} reminder(s)
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.noRemindersText}>No reminders set</Text>
                )}
              </View>

              <SegmentedButtons
                value={repeatPattern}
                style={styles.repeatOption}
                density="small"
                onValueChange={(value: any) => handleRepeatPatternChange(value)}
                buttons={[
                  {
                    icon: ({ color }) => renderIcon('daily', color),
                    value: 'daily',
                    label: 'Daily',
                    checkedColor: theme.colors.onPrimary,
                    uncheckedColor: theme.colors.onSecondaryContainer,
                    style: repeatPattern === 'daily' && {
                      backgroundColor: theme.colors.primary,
                    },
                  },
                  {
                    icon: ({ color }) => renderIcon('weekly', color),
                    value: 'weekly',
                    label: 'Weekly',
                    checkedColor: theme.colors.onPrimary,
                    uncheckedColor: theme.colors.onSecondaryContainer,
                    style: repeatPattern === 'weekly' && {
                      backgroundColor: theme.colors.primary,
                    },
                  },
                ]}
              />

              <Animated.View
                style={{
                  height: reminderAnimationRef,
                  overflow: 'hidden',
                  paddingVertical: 16,
                  opacity: showReminders ? 1 : 0,
                  display: showReminders ? 'flex' : 'none', // Only show when showReminders is true
                }}
              >
                <FlatList
                  data={reminders.slice().sort((a, b) => {
                    // Parse time strings into comparable values
                    const [aHours, aMinutes] = (a.time || '00:00')
                      .split(':')
                      .map(Number)
                    const [bHours, bMinutes] = (b.time || '00:00')
                      .split(':')
                      .map(Number)

                    // Compare hours first
                    if (aHours !== bHours) {
                      return aHours - bHours
                    }

                    // If hours are the same, compare minutes
                    return aMinutes - bMinutes
                  })}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <List.Item
                      title={`${item.time}`}
                      description={`${item.repeat === 'weekly' ? 'Weekly on selected days' : 'Daily'}`}
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon={() => (
                            <BellRing
                              size={16}
                              color={theme.colors.onPrimary}
                            />
                          )}
                        />
                      )}
                      right={(props) => (
                        <List.Icon
                          {...props}
                          icon={() => (
                            <TouchableOpacity
                              onPress={() => removeReminder(item.id)}
                            >
                              <Trash
                                size={20}
                                color={theme.colors.onError}
                              />
                            </TouchableOpacity>
                          )}
                        />
                      )}
                      style={styles.reminderItem}
                    />
                  )}
                />
              </Animated.View>

              <Button
                mode="contained"
                icon="bell-plus"
                style={styles.addReminderButton}
                disabled={!(selectedDays && selectedDays.length > 0)}
                onPress={() => timePickerBottomSheetRef.current?.present()}
              >
                Add Reminder
              </Button>
            </View>

            {/* Time Picker Bottom Sheet */}
            <BottomSheetModal
              ref={timePickerBottomSheetRef}
              index={0}
              snapPoints={timePickerSnapPoints}
              enablePanDownToClose={true}
              enableContentPanningGesture={false}
              animateOnMount
              enableOverDrag={false}
              onDismiss={() => {
                timePickerBottomSheetRef.current?.close()
              }}
              backdropComponent={(props: any) => (
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
              backgroundStyle={{
                backgroundColor: theme.colors.surface,
              }}
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
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TimerPicker
                    padWithNItems={2}
                    hourLabel=":"
                    minuteLabel=""
                    hideSeconds
                    padHoursWithZero
                    initialValue={{ hours, minutes }}
                    onDurationChange={(duration) => {
                      setPickerTime(duration)
                    }}
                    LinearGradient={LinearGradient}
                    Haptics={Haptics}
                    MaskedView={MaskedView}
                    styles={{
                      theme: theme.dark ? 'dark' : 'light',
                      backgroundColor: 'transparent',
                      pickerItem: {
                        fontSize: 32,
                        color: theme.colors.primary,
                      },
                      pickerLabel: {
                        fontSize: 24,
                        marginTop: 0,
                      },
                      pickerContainer: {
                        marginRight: 6,
                      },
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
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </Portal>
  )
}
