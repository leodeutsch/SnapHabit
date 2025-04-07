import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get('window')
export const SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.2
export const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9

export const taskDetailsStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    height: SHEET_MAX_HEIGHT,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    color: theme.colors.onSurface,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginTop: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  tagViewer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: theme.colors.onSurface,
  },
}))
