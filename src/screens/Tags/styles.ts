import { Dimensions, Platform, StyleSheet } from 'react-native'
import { MD3Theme } from 'react-native-paper'
import { FONTS } from '../../styles/theme'
import { createThemedStyles } from '../../utils/themedStyle'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const tagStyles = createThemedStyles((theme: MD3Theme) => ({
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
  tagChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondaryContainer,
    height: 34,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipText: {
    color: theme.colors.onSecondaryContainer,
    marginRight: 4,
  },
  tagChipDelete: {
    padding: 2,
  },
  addTagChip: {
    borderStyle: Platform.OS === 'android' ? 'dashed' : 'dotted',
    height: 34,
  },
  addTagChipText: {
    color: theme.colors.outline,
  },
  tagList: {
    flex: 1,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.4,
    borderBottomColor: theme.colors.outlineVariant,
  },
  tagName: {
    fontSize: 16,
    color: theme.colors.onBackground,
  },
  tagActions: {
    flexDirection: 'row',
  },
  editButton: {
    color: theme.colors.primary,
    marginRight: 16,
  },
  deleteButton: {
    color: theme.colors.error,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.backdrop,
    zIndex: 3,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    zIndex: 4,
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  viewContainer: {
    flex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 8,
  },
  chipViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '96%',
    paddingHorizontal: 16,
  },
  listViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
  },
}))
