import { MD3Theme } from 'react-native-paper'
import { FONTS } from '../../styles/theme'
import { createThemedStyles } from '../../utils/themedStyle'

export const profileStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    borderRadius: 75,
    overflow: 'hidden',
    height: 80,
    width: 80,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatar: {
    height: 150,
    width: 150,
  },
  name: {
    fontSize: FONTS.SIZE.XLARGE,
    fontFamily: FONTS.BOLD,
    color: theme.colors.onBackground,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: FONTS.SIZE.MEDIUM,
    fontFamily: FONTS.REGULAR,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  cardHeader: {
    paddingRight: 16,
    paddingBottom: 24,
  },
  resetButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: FONTS.SIZE.LARGE,
    fontFamily: FONTS.BOLD,
    color: theme.colors.primary,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingText: {
    fontSize: FONTS.SIZE.MEDIUM,
    fontFamily: FONTS.REGULAR,
    color: theme.colors.onBackground,
  },
  infoText: {
    fontSize: FONTS.SIZE.MEDIUM,
    fontFamily: FONTS.REGULAR,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  darkModeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  colorSettingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
}))
