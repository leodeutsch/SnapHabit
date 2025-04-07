import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const chipStyles = createThemedStyles((theme: MD3Theme) => ({
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: 24,
    paddingVertical: 4,
    paddingLeft: 14,
    paddingRight: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipText: {
    color: theme.colors.onSecondaryContainer,
    marginRight: 6,
  },
  tagChipDelete: {
    padding: 2,
  },
}))
