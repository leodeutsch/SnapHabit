import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const checkboxStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unchecked: {
    borderWidth: 2,
    borderColor: theme.colors.outline,
    backgroundColor: theme.colors.background,
  },
  checked: {
    backgroundColor: theme.colors.primary,
  },
}))
