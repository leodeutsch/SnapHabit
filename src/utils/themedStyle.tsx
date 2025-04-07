import { StyleSheet } from 'react-native'
import { MD3Theme } from 'react-native-paper'

export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  stylesFactory: (theme: MD3Theme) => T,
): (theme: MD3Theme) => T {
  return (theme: MD3Theme) => StyleSheet.create(stylesFactory(theme))
}
