import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { format } from 'date-fns'
import {
  CalendarRange,
  Ellipsis,
  ListTodo,
  Search,
  SquareChartGantt,
} from 'lucide-react-native'
import React from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlobalFAB } from '../components/GlobalFAB'
import { SearchModal } from '../components/SearchModal'
import { useFilter } from '../hooks/useFilterContent'
import { useHabits } from '../hooks/useHabits'
import { useSearch } from '../hooks/useSearch'
import { useTasks } from '../hooks/useTasks'
import { useTheme } from '../hooks/useTheme'
import { AgendaScreen } from '../screens/Agenda'
import { HabitsScreen } from '../screens/Habits'
import { HomeScreen } from '../screens/Home'
import { SettingsScreen } from '../screens/Settings'
import { TagsScreen } from '../screens/Tags'
import { TasksScreen } from '../screens/Tasks'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Create a proper component for the Search screen
// This prevents recreation on each render
const EmptySearchScreen = () => <View />

export const TabNavigation = ({ navigation, onRouteChange }: any) => {
  const { theme } = useTheme()
  const { tasks } = useTasks()
  const { habits } = useHabits()
  const { isFilterVisible } = useFilter()
  const { showSearch, isSearchVisible } = useSearch()
  const insets = useSafeAreaInsets()
  const [currentRoute, setCurrentRoute] = React.useState('Home')

  // Pass currentRoute to parent via a ref
  const currentRouteRef = React.useRef(currentRoute)
  React.useEffect(() => {
    currentRouteRef.current = currentRoute
  }, [currentRoute])

  // Update the parent component when route changes
  React.useEffect(() => {
    if (onRouteChange) {
      onRouteChange(currentRoute)
    }
  }, [currentRoute, onRouteChange])

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            display: isSearchVisible || isFilterVisible ? 'none' : 'flex',
            backgroundColor: 'transparent',
            borderTopColor: theme.colors.outline,
            height: '10%',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: theme.colors.background,
            position: 'absolute',
            bottom: 0,
            zIndex: 1,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarButton: (props) => {
            if (route.name === 'Search') {
              return (
                <Pressable
                  {...props}
                  onPress={() => {
                    showSearch()
                  }}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                  android_ripple={{
                    color: theme.colors.primary + '8',
                    borderless: false,
                    radius: 24,
                  }}
                >
                  {props.children}
                </Pressable>
              )
            }
            return (
              <TabButton
                {...props}
                theme={theme}
              />
            )
          },
          tabBarIcon: ({ focused, color }) => {
            // Handle Search tab
            if (route.name === 'Search') {
              return (
                <Search
                  size={24}
                  color={color}
                />
              )
            }

            // Existing tab icons logic
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

              // Get past due tasks
              const pastDueTasks = tasks.filter((task) => {
                if (!task.scheduledAt || task.completed) return false
                const scheduledDate = new Date(task.scheduledAt)
                return (
                  scheduledDate < today &&
                  !task.scheduledAt.startsWith(todayStr)
                )
              })
              const todayHabits = habits.filter((habit) => {
                if (
                  !habit.scheduledAt ||
                  !Array.isArray(habit.scheduledAt) ||
                  habit.scheduledAt.length === 0
                ) {
                  return true
                }

                const weekdayName = format(today, 'EEEE')
                return habit.scheduledAt.some((day) => day === weekdayName)
              })

              const totalCount =
                todayTasks.length + pastDueTasks.length + todayHabits.length

              return (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2.4,
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
              case 'Agenda':
                iconComponent = ({ size, color }: any) => (
                  <CalendarRange
                    size={size}
                    color={color}
                  />
                )
                break
              case 'Tasks':
                iconComponent = ({ size, color }: any) => (
                  <ListTodo
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
          focus: () => {
            setCurrentRoute(route.name)
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Agenda"
          component={AgendaScreen}
        />
        {/* Fix: Use a named component instead of inline function */}
        <Tab.Screen
          name="Search"
          component={EmptySearchScreen}
          options={{
            tabBarButton: (props) => (
              <Pressable
                {...props}
                onPress={() => showSearch()}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}
                android_ripple={{
                  color: theme.colors.primary + '8',
                  borderless: false,
                  radius: 24,
                }}
              >
                {props.children}
              </Pressable>
            ),
          }}
        />
        <Tab.Screen
          name="Tasks"
          component={TasksScreen}
        />
        <Tab.Screen
          name="Habits"
          component={HabitsScreen}
        />
      </Tab.Navigator>

      <SearchModal />

      {currentRoute === 'Home' && <GlobalFAB />}
    </View>
  )
}

export const Navigation = () => {
  const { theme } = useTheme()
  // Reference to know which tab is active
  const currentRouteRef = React.useRef('Home')

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
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          // Only show header when the current tab is 'Home'
          headerShown: currentRouteRef.current === 'Home',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            height: 2,
          },
          headerRight: () => (
            <IconButton
              icon={() => (
                <Ellipsis
                  size={24}
                  color={theme.colors.onBackground}
                />
              )}
              onPress={() => navigation.navigate('Settings')}
            />
          ),
          headerTitle: () => null,
          headerLeft: () => null,
        })}
      >
        <Stack.Screen
          name="MainTabs"
          component={({ navigation, ...props }: any) => {
            // Pass the ref to TabNavigation using this approach
            const routeNameRef = React.useRef()

            return (
              <TabNavigation
                {...props}
                navigation={navigation}
                routeNameRef={routeNameRef}
                onRouteChange={(routeName: any) => {
                  currentRouteRef.current = routeName
                  navigation.setOptions({ headerShown: routeName === 'Home' })
                }}
              />
            )
          }}
        />
        <Stack.Screen
          name="Tags"
          component={TagsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
          }}
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
