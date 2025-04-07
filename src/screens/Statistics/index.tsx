import { MaterialIcons } from '@expo/vector-icons'
import React, { useMemo, useRef } from 'react'
import {
  Alert,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useHabits } from '../../hooks/useHabits'
import { useTheme } from '../../hooks/useTheme'
import { Habit } from '../../types'
import { logStyles } from './styles'

export const StatisticsScreen = () => {
  const { habits, loadHabits, deleteHabit } = useHabits()
  const { theme } = useTheme()
  const styles = useMemo(() => logStyles(theme), [theme])

  const completedHabits = habits.filter((t) => t.completed)

  const rotateAnimation = useRef(new Animated.Value(0)).current

  // Configure animation rotation interpolation
  const iconRotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  })

  // Add this function to handle both animation and data refresh
  const handleRefresh = () => {
    // Reset animation to 0
    rotateAnimation.setValue(0)

    // Start the rotation animation
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 800, // Animation duration in ms
      useNativeDriver: true, // Uses native driver for better performance
    }).start()

    // Load habits data
    loadHabits()
  }

  const handleLongPress = async (habit: Habit) => {
    try {
      await deleteHabit(habit.id)
      loadHabits()
    } catch (error) {
      Alert.alert('Error deleting habit', 'Failed to delete habit')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const renderItem = ({ item }: { item: Habit }) => (
    <TouchableOpacity
      style={styles.habitItem}
      onLongPress={() => handleLongPress(item)}
    >
      <Text style={styles.habitTitle}>{item.title}</Text>
      <Text style={styles.habitDate}>
        {`Completed on: ${formatDate(item.completedAt)}` || 'Completed'}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Log</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
            <MaterialIcons
              name="loop"
              size={24}
              color={theme.colors.primary}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      {completedHabits.length === 0 ? (
        <Text style={styles.emptyText}>No completed habits</Text>
      ) : (
        <FlatList
          data={completedHabits}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}
