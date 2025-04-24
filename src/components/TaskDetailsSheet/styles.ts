import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

/**
 * Main DetailsSheet styles
 */
export const detailsStyles = createThemedStyles((theme: MD3Theme) => ({
  // Container and layout
  container: {
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },

  // Title section
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    color: theme.colors.onSurface,
    fontWeight: '500',
    paddingTop: 4,
    marginLeft: 4,
  },

  // Main content/preview
  preview: {
    paddingLeft: 36,
  },
  description: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: '400',
  },
  tagViewer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  // Footer/collapsed view elements
  bottomCollapsed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 12,
    color: theme.colors.outline,
    backgroundColor: theme.colors.secondaryContainer,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  // Bottom action bar
  bottomTask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Content sections
  additionalContent: {},
  deleteButton: {},
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    lineHeight: 22,
  },
  detailedView: {
    marginTop: 24,
  },
}))

/**
 * SubTaskList specific styles
 */
export const subtaskStyles = createThemedStyles((theme: MD3Theme) => ({
  // Container layout
  container: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  taskContainer: {
    position: 'relative',
    marginVertical: 4,
    height: 32, // Fixed height for consistent layout
    overflow: 'hidden',
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },

  // Background for delete action
  deleteBackground: {
    position: 'absolute',
    top: 0.4,
    bottom: 0.4,
    right: 0.4,
    left: 0.4,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    borderRadius: 8,
  },

  // Main task item
  foreground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    height: '100%',
    width: '100%',
  },
  taskInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  // Completed task styles
  completedTask: {
    color: theme.colors.outline,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  completedTaskRow: {
    backgroundColor: theme.colors.surfaceVariant,
  },

  // UI elements
  deleteButton: {
    padding: 8,
  },
  noTasksText: {
    color: theme.colors.outline,
    opacity: 0.6,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Drag handle
  dragHandle: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  // Drag state
  dragging: {
    opacity: 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },

  // Reordering UI
  reorderButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderButtonText: {
    fontSize: 16,
    color: theme.colors.outline,
  },

  // Separator
  divider: {
    height: 1,
    width: '72%',
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.4,
    marginLeft: 56,
    marginRight: 16,
  },
}))
