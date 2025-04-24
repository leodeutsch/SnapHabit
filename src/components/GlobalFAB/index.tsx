import { CalendarPlus, ListPlus, Minus, Plus } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useFormType } from '../../hooks/useFormType'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useTheme } from '../../hooks/useTheme'
import { fabStyles } from './styles'

export const GlobalFAB: React.FC = () => {
  // Hooks
  const { theme } = useTheme()
  const { showBottomSheet, isVisible } = useBottomSheet()
  const { keyboardVisible } = useKeyboard()
  const { setFormType } = useFormType()

  // States
  const [hideFab, setHideFab] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const styles = fabStyles(theme)

  // Handle Fab when keyboard is open
  useEffect(() => {
    if (keyboardVisible) {
      setHideFab(true)
    } else {
      setHideFab(false)
    }
  }, [keyboardVisible])

  // Handle task creation
  const handleCreateTask = () => {
    setFormType('task')
    showBottomSheet('addTask')
    setIsOpen(false)
  }

  // Handle habit creation
  const handleCreateHabit = () => {
    setFormType('habit')
    showBottomSheet('addHabit')
    setIsOpen(false)
  }

  // Helper function to render Lucide icons
  const renderIcon = (iconName: string, color: string) => {
    const iconSize = 24

    switch (iconName) {
      case 'calendar-plus':
        return (
          <CalendarPlus
            size={iconSize}
            color={color}
          />
        )
      case 'list-checks':
        return (
          <ListPlus
            size={iconSize}
            color={color}
          />
        )
      default:
        return 'plus'
    }
  }

  return (
    <FAB.Group
      visible={!hideFab && !isVisible}
      open={isOpen}
      icon={({ color }) =>
        isOpen ? (
          <Minus
            color={color}
            size={24}
          />
        ) : (
          <Plus
            color={color}
            size={24}
          />
        )
      }
      color={theme.colors.onPrimary}
      style={{
        bottom: 88,
      }}
      fabStyle={[styles.fab]}
      actions={[
        {
          icon: ({ color }) => renderIcon('calendar-plus', color),
          label: 'Create Habit',
          onPress: handleCreateHabit,
          color: theme.colors.onPrimary,
          style: styles.fab,
        },
        {
          icon: ({ color }) => renderIcon('list-checks', color),
          label: 'Create Task',
          onPress: handleCreateTask,
          color: theme.colors.onPrimary,
          style: styles.fab,
        },
      ]}
      onStateChange={({ open }) => setIsOpen(open)}
    />
  )
}
