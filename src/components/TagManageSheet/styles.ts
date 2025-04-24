import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const tagSheetStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
  },
  input: {
    width: '68%',
    borderWidth: 0,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
  },
  submitButton: {
    backgroundColor: theme.colors.surface,
    width: '24%',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 4,
  },
  submitButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
}))
