import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const tagSheetStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBlock: 16,
    paddingInline: 16,
    minHeight: 96,
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: theme.colors.surface,
    elevation: 8,
    zIndex: 1000,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: '32%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}))
