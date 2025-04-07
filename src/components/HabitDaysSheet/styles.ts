import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { FONTS } from '../../styles/theme'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

export const calendarSheetStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: SCREEN_HEIGHT * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dragHandle: {
    width: 36,
    height: 5,
    backgroundColor: theme.colors.outline,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  weekDays: {
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  weekDaysContainer: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  weekDayChip: {
    borderRadius: 24,
    marginHorizontal: 2,
  },
  weekDayChipText: {
    color: theme.colors.onSurface,
    fontFamily: FONTS.REGULAR,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timePickerLabel: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    color: theme.colors.onSurface,
  },

  timePickerButtonText: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    color: theme.colors.onSurface,
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: theme.colors.surface,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.backdrop,
    paddingVertical: SCREEN_HEIGHT * 0.2,
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.BOLD,
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  reminderOptionsContainer: {
    flexGrow: 1,
  },
  reminderOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  confirmButtonText: {
    color: theme.colors.onPrimary,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginVertical: 12,
  },
  remindersSection: {
    marginTop: 24,
  },
  reminderItem: {
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  noRemindersText: {
    color: theme.colors.outline,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  addReminderButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  repeatOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
}))

// In styles.ts
export const calendarTheme = (theme: MD3Theme) => ({
  calendarBackground: theme.colors.surface,
  textSectionTitleColor: theme.colors.primary,
  selectedDayTextColor: theme.colors.onPrimary,
  todayTextColor: theme.colors.primary,
  dayTextColor: theme.colors.onSurface,
  textDisabledColor: theme.colors.surface,
  selectedDayBackgroundColor: theme.colors.primary,
  arrowColor: theme.colors.primary,
  monthTextColor: theme.colors.primary,
  indicatorColor: theme.colors.primary,
  textDayFontFamily: theme.fonts.bodyMedium.fontFamily,
  textMonthFontFamily: theme.fonts.bodyLarge.fontFamily,
  textDayHeaderFontFamily: theme.fonts.bodyMedium.fontFamily,
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
})
