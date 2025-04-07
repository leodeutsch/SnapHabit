import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { format } from 'date-fns'
import {
  Bolt,
  CalendarClock,
  CopyCheck,
  SquareChartGantt,
} from 'lucide-react-native'
import React from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlobalFAB } from '../components/GlobalFAB'
import { useHabits } from '../hooks/useHabits'
import { useTasks } from '../hooks/useTasks'
import { useTheme } from '../hooks/useTheme'
import { HabitsScreen } from '../screens/Habits'
import { HomeScreen } from '../screens/Home'
import { SettingsScreen } from '../screens/Settings'
import { StatisticsScreen } from '../screens/Statistics'
import { TagsScreen } from '../screens/Tags'
import { TasksScreen } from '../screens/Tasks'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

export const TabNavigation = () => {
  const { theme } = useTheme()
  const { tasks } = useTasks()
  const { habits } = useHabits()
  const insets = useSafeAreaInsets()
  const [currentRoute, setCurrentRoute] = React.useState('Home')

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
            height: '10%',
            borderTopWidth: 0,
            position: 'absolute',
            bottom: 0,
            zIndex: 1,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarButton: (props) => (
            <TabButton
              {...props}
              theme={theme}
            />
          ),
          tabBarIcon: ({ focused, color }) => {
            if (route.name === 'Home') {
              const today = new Date()

              // Format today's date for comparison with task dates
              const todayStr = today.toISOString().split('T')[0]

              // Count tasks scheduled for today
              const todayTasks = tasks.filter((task) => {
                return (
                  (task.scheduledAt?.startsWith(todayStr) ||
                    !task.scheduledAt) &&
                  !task.completed
                )
              })

              // Count habits scheduled for today's weekday
              const todayHabits = habits.filter((habit) => {
                if (!habit.scheduledAt || !Array.isArray(habit.scheduledAt))
                  return false

                // Get weekday name based on the screens/Home/index.tsx pattern
                const weekdayName = format(today, 'EEEE')
                // @ts-ignore
                return habit.scheduledAt.includes(weekdayName)
              })

              const totalCount = todayTasks.length + todayHabits.length

              return (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    // backgroundColor: focused ? color : theme.colors.surface,
                    // borderWidth: focused ? 0 : 1.6,
                    borderWidth: 2.4,
                    // borderColor: theme.colors.outline,
                    borderColor: focused
                      ? theme.colors.primary
                      : theme.colors.outline,
                    borderRadius: (24 * 2) / 9,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: focused
                        ? theme.colors.primary
                        : theme.colors.outline,
                      fontSize: 12,
                      fontWeight: '800',
                    }}
                  >
                    {totalCount}
                  </Text>
                </View>
              )
            }

            let iconComponent
            switch (route.name) {
              case 'Tasks':
                iconComponent = ({ size, color }: any) => (
                  <CopyCheck
                    size={size}
                    color={color}
                  />
                )
                break
              case 'Habits':
                iconComponent = ({ size, color }: any) => (
                  <SquareChartGantt
                    size={size}
                    color={color}
                  />
                )
                break
              case 'Log':
                iconComponent = ({ size, color }: any) => (
                  <CalendarClock
                    size={size}
                    color={color}
                  />
                )
                break
              case 'Settings':
                iconComponent = ({ size, color }: any) => (
                  <Bolt
                    size={size}
                    color={color}
                  />
                )
                break
              default:
                iconComponent = 'circle'
            }

            return (
              <IconButton
                icon={iconComponent}
                iconColor={color}
                size={24}
                style={{ margin: 0 }}
              />
            )
          },
        })}
        screenListeners={({ route }) => ({
          focus: () => setCurrentRoute(route.name),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Tasks"
          component={TasksScreen}
        />
        <Tab.Screen
          name="Habits"
          component={HabitsScreen}
        />
        <Tab.Screen
          name="Log"
          component={StatisticsScreen}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>

      {/* Global FAB - will only show on non-Settings screens */}
      {currentRoute !== 'Settings' && <GlobalFAB />}
    </View>
  )
}

export const Navigation = () => {
  const { theme } = useTheme()

  return (
    <NavigationContainer
      theme={{
        dark: theme.dark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.onSurface,
          border: theme.colors.outline,
          notification: theme.colors.error,
        },
        fonts: {
          regular: { fontFamily: 'Inter', fontWeight: '300' },
          medium: { fontFamily: 'Inter', fontWeight: '400' },
          bold: { fontFamily: 'Inter', fontWeight: '600' },
          heavy: { fontFamily: 'Inter', fontWeight: '800' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigation}
        />
        <Stack.Screen
          name="Tags"
          component={TagsScreen}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const TabButton = ({ accessibilityState, onPress, children, theme }: any) => {
  // Animation value for the scale effect
  const scaleValue = React.useRef(new Animated.Value(1)).current

  const focused = accessibilityState.selected

  const handlePress = () => {
    // Scale down slightly when pressed
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()

    // Call the original onPress
    onPress()
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      }}
      android_ripple={{
        color: theme.colors.primary + '8', // Add transparency to primary color
        borderless: false,
        radius: 24,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  )
}
