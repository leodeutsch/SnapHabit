import { MD3Theme } from 'react-native-paper'
import { FONTS } from '../../styles/theme'
import { createThemedStyles } from '../../utils/themedStyle'

export const logStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: theme.colors.background,
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
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.REGULAR,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
  },
  habitItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
  },
  habitDate: {
    fontSize: 14,
    color: theme.colors.outlineVariant,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.outlineVariant,
    textAlign: 'center',
  },
}))
