import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const formStyles = createThemedStyles((theme: MD3Theme) => ({
  formContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: theme.colors.surface,
    minHeight: 104,
  },
  input: {
    width: '100%',
    borderWidth: 0,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 16,
  },
  bottomContainerLeftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
  },
  bottomContentText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  expandedView: {
    overflow: 'hidden',
    marginBottom: 16,
  },
  descriptionInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.onSurface,
    textAlignVertical: 'top',
  },
}))
