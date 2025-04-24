import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { FONTS } from '../../styles/theme'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

export const calendarSheetStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    height: SCREEN_HEIGHT * 0.7,
    paddingHorizontal: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerButton: {
    padding: 8,
  },
  calendar: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.onSurface,
    height: 340,
    marginBottom: 32,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timePickerLabel: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    color: theme.colors.onSurface,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
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
  bottomSheetContent: {
    flex: 1,
    padding: 16,
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
  reminderOptionsList: {
    height: 80,
  },
  reminderOptionsContainer: {
    flexGrow: 1,
  },
  reminderOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.surfaceVariant,
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
    paddingHorizontal: 16,
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
  customReminderContainer: {
    flexDirection: 'column',
    marginVertical: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 72,
  },
  valuePicker: {
    width: '30%',
    height: 88,
    color: theme.colors.onSurface,
  },
  unitPicker: {
    width: '70%',
    height: 88,
    color: theme.colors.onSurface,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  valueButton: {
    width: '26%',
    marginRight: 8,
  },
  unitButton: {
    width: '70%',
  },
  pickerModal: {
    padding: 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  pickerContent: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  pickerItem: {
    padding: 12,
    margin: 4,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: theme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  unitPickerItem: {
    width: '100%',
    marginVertical: 4,
  },
  pickerItemSelected: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
  },
  pickerItemText: {
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  pickerItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
}))

export const calendarTheme = (theme: MD3Theme) => ({
  backgroundColor: 'transparent',
  calendarBackground: 'transparent',
  textSectionTitleColor: theme.colors.onSurfaceVariant,
  selectedDayBackgroundColor: theme.colors.primary,
  selectedDayTextColor: theme.colors.onPrimary,
  todayTextColor: theme.colors.primary,
  dayTextColor: theme.colors.onSurface,
  textDisabledColor: theme.colors.surfaceVariant,
  dotColor: theme.colors.primary,
  selectedDotColor: theme.colors.primary,
  arrowColor: theme.colors.primary,
  monthTextColor: theme.colors.primary,
  textDayFontFamily: 'System',
  textMonthFontFamily: 'System',
  textDayHeaderFontFamily: 'System',
})
