import { Platform, StyleSheet } from 'react-native'
import { MD3Theme } from 'react-native-paper'

export const filterBottomSheetStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    resetButton: {
      padding: 8,
    },
    resetText: {
      color: theme.colors.primary,
      fontWeight: '500',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
      marginBottom: 12,
    },
    tagsContainer: {
      paddingRight: 16,
      paddingBottom: 8,
    },
    tagChip: {
      margin: 4,
      backgroundColor: theme.colors.secondaryContainer,
      borderWidth: 0.8,
      borderColor: theme.colors.secondaryContainer,
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    optionChip: {
      margin: 4,
      backgroundColor: theme.colors.secondaryContainer,
      borderWidth: 0.8,
      borderColor: theme.colors.secondaryContainer,
    },
    daysContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayChip: {
      margin: 4,
      backgroundColor: theme.colors.secondaryContainer,
      borderWidth: 0.8,
      borderColor: theme.colors.secondaryContainer,
    },
    addTagChip: {
      borderStyle: Platform.OS === 'android' ? 'dashed' : 'dotted',
      height: 34,
      margin: 4,
    },
    addTagChipText: {
      color: theme.colors.outline,
    },
    emptyText: {
      color: theme.colors.outline,
      fontStyle: 'italic',
      marginLeft: 4,
    },
  })
