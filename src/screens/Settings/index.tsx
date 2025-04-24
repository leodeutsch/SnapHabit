import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import {
  ChevronDown,
  Moon,
  MoonStar,
  RotateCcw,
  Sun,
  SunMoon,
} from 'lucide-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native'
import { Card, ProgressBar, SegmentedButtons } from 'react-native-paper'
import { Easing } from 'react-native-reanimated'
import { ColorSwatch } from '../../components/ColorSwatch'
import { MySwitch } from '../../components/MySwitch'
import { useTheme } from '../../hooks/useTheme'
import {
  getStatistics,
  resetStatistics,
} from '../../services/statisticsService'
import { Statistics } from '../../types'
import { profileStyles } from './styles'

type ThemeMode = 'light' | 'dark' | 'system'

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

// Predefined color options
const COLOR_OPTIONS = [
  '#4750c8', // Default blue
  '#6366F1', // Indigo
  '#74c7ec', // Saphire
  '#94e2d5', // Teal
  '#b4befe', // Lavender
  '#cba6f7', // Mauve
  '#f5c2e7', // Pink
  '#EF4444', // Red
  '#fab387', // Peach
  '#a6e3a1', // Green
  '#10B981', // Emerald
]

const ACCENT_COLOR_KEY = '@accent_color'

export const SettingsScreen = () => {
  const {
    theme,
    useSystemTheme,
    setCustomTheme,
    setThemeMode,
    isOledMode,
    toggleOledMode,
    colorScheme,
  } = useTheme()
  const styles = useMemo(() => profileStyles(theme), [theme])

  const { width } = useWindowDimensions()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [accentColor, setAccentColor] = useState('#4750c8')
  const [isChangingTheme, setIsChangingTheme] = useState(false)
  const [isColorsVisible, setIsColorsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const heightAnimation = useRef(new Animated.Value(0)).current
  const rotateAnimation = useRef(new Animated.Value(0)).current
  const darkModeExpansion = useRef(new Animated.Value(0)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    progressAnim.addListener(({ value }) => setProgress(value))

    Animated.timing(progressAnim, {
      toValue: statistics?.completionRate || 0,
      duration: 2000,
      useNativeDriver: false,
    }).start()

    return () => {
      progressAnim.removeAllListeners()
    }
  }, [])

  const isDarkMode = colorScheme === 'dark'

  // Configure animation rotation interpolation
  const iconRotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  // Function to toggle colors with animation
  const toggleColorsVisible = () => {
    setIsColorsVisible(!isColorsVisible)

    Animated.parallel([
      Animated.timing(heightAnimation, {
        toValue: !isColorsVisible ? 64 : 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(rotateAnimation, {
        toValue: !isColorsVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start()
  }

  // Set initial theme mode based on current app state
  const [themeSetting, setThemeSetting] = useState<ThemeMode>(
    useSystemTheme ? 'system' : theme.dark ? 'dark' : 'light',
  )

  // Load saved accent color
  useEffect(() => {
    const loadAccentColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem(ACCENT_COLOR_KEY)
        if (savedColor) {
          setAccentColor(savedColor)
        } else {
          // If no saved color, set the current primary color
          setAccentColor(theme.colors.primary)
        }
      } catch (error) {
        console.error('Failed to load accent color:', error)
      }
    }

    loadAccentColor()
  }, [])

  const handleColorChange = (color: string) => {
    // Show loading state
    setIsChangingTheme(true)
    setAccentColor(color)

    // Apply the theme change
    setCustomTheme(color)

    // Save color preference
    AsyncStorage.setItem(ACCENT_COLOR_KEY, color)

    // Hide loading state after a brief delay
    setTimeout(() => {
      setIsChangingTheme(false)
    }, 300)
  }

  // Add a useEffect to keep themeSetting in sync with theme context
  useEffect(() => {
    setThemeSetting(useSystemTheme ? 'system' : theme.dark ? 'dark' : 'light')
  }, [useSystemTheme, theme.dark])

  const loadStatistics = async () => {
    const stats = await getStatistics()
    setStatistics(stats)
  }

  const handleThemeChange = (updatedTheme: ThemeMode) => {
    setThemeSetting(updatedTheme)
    setThemeMode(updatedTheme)
  }

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(darkModeExpansion, {
        toValue: isDarkMode ? 48 : 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }).start()
    }, 50)
  }, [isDarkMode])

  useEffect(() => {
    loadStatistics()
  }, [])

  const handleResetStatistics = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all statistics? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: async () => {
            await resetStatistics()
            loadStatistics()
          },
          style: 'destructive',
        },
      ],
    )
  }

  const renderIcon = (iconName: string, color: string) => {
    const iconSize = 24

    switch (iconName) {
      case 'system':
        return (
          <SunMoon
            size={iconSize}
            color={color}
          />
        )
      case 'light':
        return (
          <Sun
            size={iconSize}
            color={color}
          />
        )
      case 'dark':
        return (
          <Moon
            size={iconSize}
            color={color}
          />
        )
      default:
        return 'circle'
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 4, paddingBottom: 80 }}
      >
        <Card style={styles.card}>
          <Card.Title
            title="Status"
            titleStyle={styles.sectionTitle}
            rightStyle={styles.cardHeader}
            right={() => (
              <TouchableOpacity
                onPress={handleResetStatistics}
                style={styles.resetButton}
              >
                <RotateCcw
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            )}
          />
          <Card.Content>
            <Text style={styles.infoText}>
              Created tasks: {statistics?.habitsCreated}
            </Text>
            <Text style={styles.infoText}>
              Done rate: {statistics?.completionRate?.toFixed(2) || 0}%
            </Text>
            <ProgressBar
              progress={progress}
              color={theme.colors.primary}
              // style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title
            title="Theme"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            <Text style={[styles.settingText, { marginBottom: 12 }]}>Mode</Text>
            <SegmentedButtons
              value={themeSetting}
              onValueChange={(theme: any) => handleThemeChange(theme)}
              buttons={[
                {
                  icon: ({ color }) => renderIcon('system', color),
                  value: 'system',
                  label: 'System',
                  checkedColor: theme.colors.primary,
                  uncheckedColor: theme.colors.outline,
                },
                {
                  icon: ({ color }) => renderIcon('light', color),
                  value: 'light',
                  label: 'Light',
                  checkedColor: theme.colors.primary,
                  uncheckedColor: theme.colors.outline,
                },
                {
                  icon: ({ color }) => renderIcon('dark', color),
                  value: 'dark',
                  label: 'Dark',
                  checkedColor: theme.colors.primary,
                  uncheckedColor: theme.colors.outline,
                },
              ]}
            />

            <Animated.View
              style={{
                overflow: 'hidden',
                marginTop: 24,
                height: darkModeExpansion,
              }}
            >
              <View style={styles.darkModeView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <MoonStar
                    size={24}
                    color={theme.colors.onSurfaceVariant}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: theme.colors.onSurface }}>OLED</Text>
                </View>
                <MySwitch
                  value={isOledMode}
                  onValueChange={toggleOledMode}
                  activeColor={theme.colors.primary}
                />
              </View>
            </Animated.View>

            <TouchableOpacity
              style={styles.colorSettingButton}
              onPress={toggleColorsVisible}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.settingText,
                  { marginTop: 24, marginBottom: 12 },
                ]}
              >
                Accent Color
              </Text>
              <Animated.View
                style={{
                  transform: [{ rotate: iconRotation }],
                  marginTop: 16,
                }}
              >
                <ChevronDown
                  size={24}
                  color={theme.colors.primary}
                />
              </Animated.View>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.colorContainer,
                {
                  height: heightAnimation,
                  overflow: 'hidden',
                },
              ]}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingVertical: 8 }}
              >
                {COLOR_OPTIONS.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    isSelected={accentColor === color}
                    onPress={() => handleColorChange(color)}
                    disabled={isChangingTheme}
                    opacity={isChangingTheme ? 0.6 : 1}
                  />
                ))}
              </ScrollView>
            </Animated.View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title
            title="About"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            <Text style={styles.infoText}>SnapHabit</Text>
            <Text style={styles.infoText}>Version 1.0.0</Text>
          </Card.Content>
        </Card>
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
    </View>
  )
}
