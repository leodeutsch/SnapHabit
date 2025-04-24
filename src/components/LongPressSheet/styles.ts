import { StyleSheet } from 'react-native'
import { MD3Theme } from 'react-native-paper'

export const confirmSheetStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    sheetBackground: {
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
      padding: 16,
      position: 'relative',
    },
    postponeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
      paddingHorizontal: 8,
    },
    postponeOption: {
      alignItems: 'center',
    },
    postponeLabel: {
      marginTop: 4,
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    confirmationArea: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingBottom: 32,
    },
    confirmationText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 48,
      left: 16,
      right: 16,
    },
    buttonContainer: {
      margin: 4,
    },
    deleteButton: {
      height: 40,
    },
    cancelButton: {
      height: 40,
    },
    deleteConfirmButton: {
      backgroundColor: theme.colors.error,
    },
  })
