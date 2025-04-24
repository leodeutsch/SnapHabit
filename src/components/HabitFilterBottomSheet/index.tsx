import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Chip } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTags } from '../../hooks/useTags'
import { useTheme } from '../../hooks/useTheme'
import { filterBottomSheetStyles } from './styles'

const REPEAT_OPTIONS = ['Daily', 'Weekly', 'None']
const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

interface HabitFilterBottomSheetProps {
  isVisible: boolean
  onClose: () => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  selectedRepeat: string | null
  setSelectedRepeat: (repeat: string | null) => void
  selectedDays: string[]
  setSelectedDays: (days: string[]) => void
}

export const HabitFilterBottomSheet: React.FC<HabitFilterBottomSheetProps> = ({
  isVisible,
  onClose,
  selectedTags,
  setSelectedTags,
  selectedRepeat,
  setSelectedRepeat,
  selectedDays,
  setSelectedDays,
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => filterBottomSheetStyles(theme), [theme])
  const { tags } = useTags()
  const { showBottomSheet } = useBottomSheet()
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['56%'], [])

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose()
      }
    },
    [onClose],
  )

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  )

  // Toggle tag selection
  const handleTagPress = useCallback(
    (tagId: string) => {
      setSelectedTags(
        selectedTags.includes(tagId)
          ? selectedTags.filter((id) => id !== tagId)
          : [...selectedTags, tagId],
      )
    },
    [selectedTags, setSelectedTags],
  )

  // Toggle repeat option
  const handleRepeatPress = useCallback(
    (repeat: string) => {
      setSelectedRepeat(selectedRepeat === repeat ? null : repeat)
    },
    [selectedRepeat, setSelectedRepeat],
  )

  // Toggle day selection
  const handleDayPress = useCallback(
    (day: string) => {
      setSelectedDays(
        selectedDays.includes(day)
          ? selectedDays.filter((d) => d !== day)
          : [...selectedDays, day],
      )
    },
    [selectedDays, setSelectedDays],
  )

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSelectedTags([])
    setSelectedRepeat(null)
    setSelectedDays([])
  }, [setSelectedTags, setSelectedRepeat, setSelectedDays])

  // Effect to control the bottom sheet visibility
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [isVisible])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: theme.colors.outlineVariant }}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Habits</Text>
          <TouchableOpacity
            onPress={handleResetFilters}
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Chip
                  key={tag.id}
                  selected={selectedTags.includes(tag.id)}
                  onPress={() => handleTagPress(tag.id)}
                  showSelectedCheck={false}
                  style={[
                    styles.tagChip,
                    selectedTags.includes(tag.id) && {
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  textStyle={{
                    color: selectedTags.includes(tag.id)
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSecondaryContainer,
                  }}
                >
                  {tag.name}
                </Chip>
              ))
            ) : (
              <Text style={styles.emptyText}>No tags available</Text>
            )}
            <Chip
              mode="outlined"
              onPress={() => showBottomSheet('tag', { source: 'habitScreen' })}
              style={styles.addTagChip}
              textStyle={styles.addTagChipText}
              compact
            >
              Add Tag
            </Chip>
          </ScrollView>
        </View>

        {/* Repeat Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repetition</Text>
          <View style={styles.optionsContainer}>
            {REPEAT_OPTIONS.map((option) => (
              <Chip
                key={option}
                selected={selectedRepeat === option}
                onPress={() => handleRepeatPress(option)}
                showSelectedCheck={false}
                style={[
                  styles.optionChip,
                  selectedRepeat === option && {
                    borderColor: theme.colors.primary,
                  },
                ]}
                textStyle={{
                  color:
                    selectedRepeat === option
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSecondaryContainer,
                }}
              >
                {option}
              </Chip>
            ))}
          </View>
        </View>

        {/* Weekdays Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Days</Text>
          <View style={styles.daysContainer}>
            {WEEK_DAYS.map((day) => (
              <Chip
                key={day}
                selected={selectedDays.includes(day)}
                onPress={() => handleDayPress(day)}
                showSelectedCheck={false}
                style={[
                  styles.dayChip,
                  selectedDays.includes(day) && {
                    borderColor: theme.colors.primary,
                  },
                ]}
                textStyle={{
                  color: selectedDays.includes(day)
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSecondaryContainer,
                }}
              >
                {day.substring(0, 3)}
              </Chip>
            ))}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}
