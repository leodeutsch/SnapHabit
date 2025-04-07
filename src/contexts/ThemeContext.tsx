import { useMaterial3Theme } from '@pchmn/expo-material3-theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ColorSchemeName, useColorScheme } from 'react-native'
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper'
import { ColorPalette } from '../types'

interface Material3Theme {
  light: Partial<ColorPalette>
  dark: Partial<ColorPalette>
}

// Add this constant
const THEME_PREFERENCE_KEY = '@theme_preference'
// Add this missing constant
const ACCENT_COLOR_KEY = '@accent_color'
// Add this constant
const OLED_MODE_KEY = '@oled_mode'

// Context value type
interface ThemeContextValue {
  theme: MD3Theme
  colorScheme: ColorSchemeName
  useSystemTheme: boolean
  isOledMode: boolean // Add this
  setCustomTheme: (sourceColor: string) => void
  resetToSystemTheme: () => void
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  toggleOledMode: () => void // Add this
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextValue>({
  theme: MD3LightTheme,
  colorScheme: 'light',
  useSystemTheme: true,
  isOledMode: false, // Add this
  setCustomTheme: () => {},
  resetToSystemTheme: () => {},
  setThemeMode: () => {},
  toggleOledMode: () => {}, // Add this
})

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get the system color scheme
  const systemColorScheme = useColorScheme()
  // State to track which theme mode we're using
  const [useSystemTheme, setUseSystemTheme] = useState<boolean>(true)
  // The forced theme when not using system theme
  const [forcedTheme, setForcedTheme] = useState<'light' | 'dark' | null>(null)
  // State to track theme changes
  const [themeVersion, setThemeVersion] = useState<number>(0)
  // State to track OLED mode
  const [isOledMode, setIsOledMode] = useState<boolean>(false)

  // This is the effective color scheme we'll use - derived from system or forced
  const effectiveColorScheme = useSystemTheme ? systemColorScheme : forcedTheme

  // Material theme hook
  const { theme: m3Theme, updateTheme } = useMaterial3Theme({
    fallbackSourceColor: '#4750c8',
  }) as { theme: Material3Theme; updateTheme: (sourceColor: string) => void }

  // Load saved preferences on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        // Load theme mode preference
        const savedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY)
        if (savedPreference) {
          const preference = JSON.parse(savedPreference)
          if (preference.useSystemTheme) {
            setUseSystemTheme(true)
            setForcedTheme(null)
          } else {
            setUseSystemTheme(false)
            setForcedTheme(preference.theme)
          }
        }

        // Load accent color preference - add this part
        const savedColor = await AsyncStorage.getItem(ACCENT_COLOR_KEY)
        if (savedColor) {
          // Apply saved accent color
          updateTheme(savedColor)
        }

        // Load OLED mode preference
        const savedOledMode = await AsyncStorage.getItem(OLED_MODE_KEY)
        if (savedOledMode) {
          setIsOledMode(JSON.parse(savedOledMode))
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error)
      }
    }
    loadThemePreference()
  }, [])

  // Update the setThemeMode function to save preferences
  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
      setUseSystemTheme(true)
      setForcedTheme(null)
      AsyncStorage.setItem(
        THEME_PREFERENCE_KEY,
        JSON.stringify({
          useSystemTheme: true,
        }),
      )
    } else {
      setUseSystemTheme(false)
      setForcedTheme(mode)
      AsyncStorage.setItem(
        THEME_PREFERENCE_KEY,
        JSON.stringify({
          useSystemTheme: false,
          theme: mode,
        }),
      )
    }
  }

  // Combine Material 3 theme with custom palette
  const theme = useMemo<MD3Theme>(() => {
    // Determine which theme to use
    const themeMode = effectiveColorScheme || 'light'
    const baseTheme = themeMode === 'dark' ? MD3DarkTheme : MD3LightTheme

    // Get colors from Material 3 theme
    const customColors = m3Theme[themeMode]

    // Create the theme with proper colors
    const updatedTheme = {
      ...baseTheme,
      roundness: 8,
      colors: {
        ...baseTheme.colors,
        ...customColors,
        primary: customColors.primary ?? baseTheme.colors.primary,
      },
    }

    // Apply OLED black only in dark mode
    if (themeMode === 'dark' && isOledMode) {
      updatedTheme.colors = {
        ...updatedTheme.colors,
        background: '#000000',
        surface: '#000000',
        elevation: {
          ...updatedTheme.colors.elevation,
          level0: '#000000',
          level1: '#0D0D0D',
          level2: '#121212',
          level3: '#181818',
          level4: '#1E1E1E',
          level5: '#222222',
        },
      }
    }

    return updatedTheme
  }, [effectiveColorScheme, m3Theme, themeVersion, isOledMode])

  // Function to switch to a custom color dynamically
  const setCustomTheme = useCallback((sourceColor: string) => {
    // Force immediate theme update
    updateTheme(sourceColor)

    // Save the color preference
    AsyncStorage.setItem(ACCENT_COLOR_KEY, sourceColor)

    // Force a re-render of the entire app
    setThemeVersion((prev) => prev + 1)
  }, [])

  // Reset to system theme
  const resetToSystemTheme = () => {
    setUseSystemTheme(true)
  }

  // Reset to default theme
  const resetToDefaultTheme = () => {
    updateTheme('#4750c8') // Your default blue color
    AsyncStorage.removeItem(ACCENT_COLOR_KEY)
  }

  // Toggle OLED mode
  const toggleOledMode = useCallback(() => {
    setIsOledMode((prev) => {
      const newValue = !prev
      AsyncStorage.setItem(OLED_MODE_KEY, JSON.stringify(newValue))
      return newValue
    })
  }, [])

  const value: ThemeContextValue = {
    theme,
    colorScheme: effectiveColorScheme,
    useSystemTheme,
    isOledMode, // Add this
    setCustomTheme,
    resetToSystemTheme,
    setThemeMode,
    toggleOledMode, // Add this
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
