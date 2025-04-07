import React from 'react'
import { Text, View } from 'react-native'
import { useHabits } from '../../hooks/useHabits'
import { useTheme } from '../../hooks/useTheme'
import { themedStyles } from './styles'

export const HabitsScreen = () => {
  const { theme } = useTheme()
  const styles = themedStyles(theme)
  const { habits } = useHabits()

  return (
    <>
      {/* <Appbar.Header>
        <Appbar.Content title="Tasks" />
      </Appbar.Header> */}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Habits</Text>
        </View>
        <View></View>
      </View>
    </>
  )
}
