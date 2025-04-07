import { MD3Theme } from 'react-native-paper'
import { FONTS } from '../../styles/theme'
import { createThemedStyles } from '../../utils/themedStyle'

export const themedStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.REGULAR,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
  },
  text: {
    color: theme.colors.onBackground,
    fontSize: 18,
  },
}))
