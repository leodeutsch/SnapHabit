import React from 'react'
import { Text, View } from 'react-native'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { themedStyles } from './styles'

export const TasksScreen = () => {
  const { theme } = useTheme()
  const styles = themedStyles(theme)
  const { tasks } = useTasks()

  return (
    <>
      {/* <Appbar.Header>
        <Appbar.Content title="Tasks" />
      </Appbar.Header> */}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
        </View>
        <View></View>
      </View>
    </>
  )
}
