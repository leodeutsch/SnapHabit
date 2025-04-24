import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const agendaStyles = createThemedStyles((theme: MD3Theme) => ({
  // ===== Container =====
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // ===== Date Header =====
  selectedDateHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline + '20',
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
  },

  // ===== Items Container =====
  itemsContainer: {
    flex: 1,
    padding: 8,
  },
  emptyDateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },

  // ===== All-day Events =====
  allDayContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline + '20',
    paddingBottom: 8,
  },

  // ===== Time Blocks =====
  timeBlockContainer: {
    marginBottom: 16,
  },
  timeBlockHeader: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.surfaceVariant + '60',
    borderRadius: 4,
    marginBottom: 8,
  },
  timeBlockLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  timeBlockContent: {
    marginLeft: 8,
  },
  emptyTimeBlock: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + '30',
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant + '30',
  },
  emptyTimeBlockText: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  // ===== Individual Items =====
  itemContainer: {
    backgroundColor: theme.colors.secondaryContainer + '80',
    height: 32,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    flex: 1,
    color: theme.colors.onSecondaryContainer,
  },
  itemType: {
    fontSize: 12,
    marginLeft: 8,
    // color: theme.colors.onSecondaryContainer,
  },
  itemLocation: {},
  itemTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  emptyAllDayText: {
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // ===== Timeline =====
  timelineContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 1440, // 24 hours * 60px per hour
  },
  timeColumn: {
    width: 60,
    marginRight: 8,
  },
  timeSlot: {
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  timeLabel: {
    fontSize: 12,
    marginTop: -8, // Offset to align with grid lines
  },
  eventsColumn: {
    flex: 1,
    position: 'relative',
  },
  timeSlotGrid: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 0.8,
  },
  currentTimeIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    zIndex: 100,
  },
  timePositionedEvent: {
    position: 'absolute',
    left: 0,
    right: 8,
    minHeight: 30,
    borderLeftWidth: 4,
    borderRadius: 4,
    padding: 4,
    overflow: 'hidden',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: '500',
    fontSize: 14,
  },
  eventTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  allDaySection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline + '20',
    paddingVertical: 8,
    backgroundColor: theme.colors.background, // To ensure it's visible when fixed
    zIndex: 10, // Ensure it stacks on top
  },
  allDayLabelContainer: {
    width: 60,
    marginRight: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  allDayLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  allDayEventsContainer: {
    flex: 1,
    padding: 8,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 88,
    right: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    width: 72,
  },
  floatingButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 40,
  },
}))
