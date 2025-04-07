import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const fabStyles = createThemedStyles((theme: MD3Theme) => ({
  fab: {
    backgroundColor: theme.colors.primary,
  },
}))
