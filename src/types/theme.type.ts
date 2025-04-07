import { ReactNode } from 'react'
import { MD3Theme } from 'react-native-paper'

export type ThemeContextType = {
  theme: MD3Theme
  colorScheme: string | null
  useSystemTheme: boolean
  setCustomTheme: (sourceColor: string) => void
  resetToSystemTheme: () => void
}

export type ThemeProviderProps = {
  children: ReactNode
}

export interface ColorPalette {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  elevation: {
    level0: string
    level1: string
    level2: string
    level3: string
    level4: string
    level5: string
  }
  surfaceDisabled: string
  onSurfaceDisabled: string
  backdrop: string
}

export interface ThemeColors {
  light: ColorPalette
  dark: ColorPalette
}
