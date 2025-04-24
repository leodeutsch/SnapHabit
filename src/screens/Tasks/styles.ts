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
    marginBottom: 32,
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
  section: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '40%',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: theme.colors.outline,
    fontSize: 16,
  },
  activeFiltersContainer: {
    backgroundColor: theme.colors.primaryContainer + '40',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  activeFiltersText: {
    color: theme.colors.onSurface,
    fontSize: 14,
    textAlign: 'center',
  },
}))
