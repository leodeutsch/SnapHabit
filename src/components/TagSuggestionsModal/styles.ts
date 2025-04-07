import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

export const tagSuggestionsModalStyles = createThemedStyles(
  (theme: MD3Theme) => ({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: SCREEN_HEIGHT * 0.4,
      paddingHorizontal: 8,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    headerButton: {
      padding: 8,
    },
    tagContainer: {
      padding: 16,
      width: SCREEN_WIDTH - 40,
      marginHorizontal: 'auto',
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
