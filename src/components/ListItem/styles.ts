import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const listItemStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    width: '94%',
    minHeight: 70,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    elevation: 6,
    borderRadius: 16,
    marginBottom: 6,
    paddingBlock: 4,
    paddingLeft: 8,
    paddingRight: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    textAlignVertical: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  reminderText: {
    fontSize: 12,
    color: theme.colors.outline,
    alignSelf: 'center',
    marginRight: 8,
  },
  rightContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: theme.colors.outline,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: theme.colors.outline,
  },
}))
