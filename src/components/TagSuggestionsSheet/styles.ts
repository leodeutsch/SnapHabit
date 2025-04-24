import { Dimensions, Platform } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

export const tagSuggestionsModalStyles = createThemedStyles(
  (theme: MD3Theme) => ({
    container: {
      backgroundColor: theme.colors.surface,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 8,
    },
    headerButton: {
      padding: 8,
    },
    tagContainer: {
      paddingVertical: 8,
      width: SCREEN_WIDTH * 0.8,
      marginHorizontal: 'auto',
    },
    tagChip: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.secondaryContainer,
      height: 34,
      marginRight: 8,
      marginBottom: 8,
      borderColor: theme.colors.secondaryContainer,
      borderWidth: 0.8,
    },
    tagChipText: {
      color: theme.colors.onSecondaryContainer,
    },
    addTagChip: {
      borderStyle: Platform.OS === 'android' ? 'dashed' : 'dotted',
      height: 34,
    },
    addTagChipText: {
      color: theme.colors.outline,
    },
    text: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    tagChipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
    },
    selectedTag: {
      borderColor: theme.colors.primary,
      borderWidth: 0.8,
    },
  }),
)
