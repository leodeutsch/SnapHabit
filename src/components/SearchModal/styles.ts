import { Dimensions, StyleSheet } from 'react-native'
import { MD3Theme } from 'react-native-paper'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

export const searchModalStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    // ===== Main Container & Backdrop =====
    container: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 800,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.backdrop,
    },

    // ===== Search Bar & Modal Container =====
    modalContainer: {
      position: 'absolute',
      top: 32,
      left: 8,
      right: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 32,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderLeftWidth: 0.4,
      borderRightWidth: 0.4,
      borderBottomWidth: 0.4,
      borderColor: theme.colors.outlineVariant,
      zIndex: 1000,
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchBar: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 16,
      elevation: 0,
    },
    input: {
      color: theme.colors.onSurface,
    },

    // ===== Suggestions Container =====
    suggestionsContainer: {
      position: 'absolute',
      top: 96,
      left: 9,
      right: 9,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      minHeight: 128,
      maxHeight: '72%',
      paddingTop: 24,
      zIndex: 999,
    },
    suggestionsList: {
      flex: 1,
    },

    // ===== Recent Search Items =====
    recentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant + '30',
    },
    suggestionText: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginLeft: 12,
    },

    // ===== Suggestion Items =====
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant + '20',
      borderRadius: 8,
      marginBottom: 4,
    },
    suggestionIcon: {
      marginRight: 12,
    },
    suggestionContent: {
      flex: 1,
    },
    suggestionTitle: {
      fontSize: 16,
      color: theme.colors.onSurface,
      fontWeight: '500',
    },
    suggestionSubtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },

    // ===== Empty State =====
    noResultsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noResultsText: {
      color: theme.colors.outline,
      fontSize: 16,
    },
  })
