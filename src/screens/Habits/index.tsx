import { LinearGradient } from 'expo-linear-gradient'
import { ListFilterPlus } from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { IconButton } from 'react-native-paper'
import { HabitFilterBottomSheet } from '../../components/HabitFilterBottomSheet'
import { ListItem } from '../../components/ListItem'
import { useFilter } from '../../hooks/useFilterContent'
import { useHabits } from '../../hooks/useHabits'
import { useTheme } from '../../hooks/useTheme'
import { Habit } from '../../types'
import { themedStyles } from './styles'

export const HabitsScreen = () => {
  const { theme } = useTheme()
  const styles = themedStyles(theme)
  const { habits, updateHabit } = useHabits()
  const { isFilterVisible, setFilterVisible } = useFilter()

  // Filter state
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedRepeat, setSelectedRepeat] = useState<string | null>(null)
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  // Toggle filter visibility
  const toggleFilterVisible = useCallback(() => {
    setFilterVisible(!isFilterVisible)
  }, [isFilterVisible])

  // Handle habit completion toggle
  const handleToggleComplete = useCallback(
    (
      itemId: string,
      completed: boolean,
      completedAt: string,
      isTask: boolean,
    ) => {
      if (isTask) {
        const habit = habits.find((h: Habit) => h.id === itemId)

        if (habit) {
          const updatedTask = {
            ...habit,
            completed,
            completedAt: completed ? completedAt : undefined,
          }
          updateHabit(updatedTask)
        }
      }
    },
    [habits, updateHabit],
  )

  // Filter habits based on selected filters
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      // Filter by tags
      if (selectedTags.length > 0) {
        const habitTags = habit.tags || []
        if (!selectedTags.some((tagId: any) => habitTags.includes(tagId))) {
          return false
        }
      }

      // Filter by repetition
      if (selectedRepeat) {
        const isDaily = habit.scheduledAt?.length === 7
        const isWeekly =
          habit.scheduledAt &&
          habit.scheduledAt.length > 0 &&
          habit.scheduledAt.length < 7
        const isNone = !habit.scheduledAt || habit.scheduledAt.length === 0

        if (
          (selectedRepeat === 'Daily' && !isDaily) ||
          (selectedRepeat === 'Weekly' && !isWeekly) ||
          (selectedRepeat === 'None' && !isNone)
        ) {
          return false
        }
      }

      // Filter by days
      if (selectedDays.length > 0) {
        const habitDays = habit.scheduledAt || []
        if (!selectedDays.some((day: any) => habitDays.includes(day))) {
          return false
        }
      }

      return true
    })
  }, [habits, selectedTags, selectedRepeat, selectedDays])

  // Are any filters active?
  const hasActiveFilters =
    selectedTags.length > 0 ||
    selectedRepeat !== null ||
    selectedDays.length > 0

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Habits</Text>
        <IconButton
          icon={() => (
            <ListFilterPlus
              size={20}
              color={
                hasActiveFilters
                  ? theme.colors.primary
                  : theme.colors.onBackground
              }
            />
          )}
          onPress={toggleFilterVisible}
          style={{ margin: 0, padding: 0 }}
        />
      </View>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Filters applied: {filteredHabits.length} of {habits.length} habits
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: '10%' }}>
        <View style={styles.section}>
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <ListItem
                key={habit.id}
                item={habit}
                itemType="habit"
                onToggleComplete={handleToggleComplete}
                isLast={
                  habit.id === filteredHabits[filteredHabits.length - 1].id
                }
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {hasActiveFilters
                  ? 'No habits match the active filters.'
                  : "No habits yet... Let's create a goal!"}
              </Text>
            </View>
          )}
        </View>
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

      {/* Filter Bottom Sheet */}
      <HabitFilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedRepeat={selectedRepeat}
        setSelectedRepeat={setSelectedRepeat}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />
    </View>
  )
}
