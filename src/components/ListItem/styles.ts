import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const listItemStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    width: '94%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    marginVertical: 2,
    paddingLeft: 8,
    paddingRight: 0,
  },
  title: {
    fontSize: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
  },
  reminderText: {
    fontSize: 12,
    color: theme.colors.outline,
    backgroundColor: theme.colors.secondaryContainer,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: theme.colors.outline,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
    marginLeft: 56,
    marginRight: 16,
  },
  habitIndicator: {
    // width: 36,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  habitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryContainer,
  },
}))
