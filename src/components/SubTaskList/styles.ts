import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const subTaskListStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    marginVertical: 8,
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.surface + '33', // Add some transparency
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  list: {
    maxHeight: 200, // Limit height so it doesn't take over the form
  },
  subTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  subTaskInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  completedSubTask: {
    textDecorationLine: 'line-through',
    color: theme.colors.outline,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addButtonText: {
    marginLeft: 8,
    color: theme.colors.primary,
    fontWeight: '500',
  },
}))
