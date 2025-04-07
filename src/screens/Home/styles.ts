import { Dimensions } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

export const homeStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: theme.colors.background,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerDateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.onBackground,
  },
  headerDate: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.onBackground,
  },
  headerMonth: {
    fontSize: 16,
    fontWeight: '300',
    fontStyle: 'italic',
    color: theme.colors.onBackground,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
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
}))
