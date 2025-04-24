import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Chip } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTags } from '../../hooks/useTags'
import { useTheme } from '../../hooks/useTheme'
import { MySwitch } from '../MySwitch'
import { taskFilterBottomSheetStyles } from './styles'

interface TaskFilterBottomSheetProps {
  isVisible: boolean
  onClose: () => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  showCompleted: boolean
  setShowCompleted: (show: boolean) => void
  showPastDue: boolean
  setShowPastDue: (show: boolean) => void
}

export const TaskFilterBottomSheet: React.FC<TaskFilterBottomSheetProps> = ({
  isVisible,
  onClose,
  selectedTags,
  setSelectedTags,
  showCompleted,
  setShowCompleted,
  showPastDue,
  setShowPastDue,
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => taskFilterBottomSheetStyles(theme), [theme])
  const { tags } = useTags()
  const { showBottomSheet } = useBottomSheet()
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['50%'], [])

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose()
      }
    },
    [onClose],
  )

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  )

  // Toggle tag selection
  const handleTagPress = useCallback(
    (tagId: string) => {
      setSelectedTags(
        selectedTags.includes(tagId)
          ? selectedTags.filter((id) => id !== tagId)
          : [...selectedTags, tagId],
      )
    },
    [selectedTags, setSelectedTags],
  )

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSelectedTags([])
    setShowCompleted(false)
    setShowPastDue(false)
  }, [setSelectedTags, setShowCompleted, setShowPastDue])

  // Effect to control the bottom sheet visibility
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [isVisible])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: theme.colors.outlineVariant }}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      // Add this key prop to force proper remounting
      key={`task-filter-sheet-${isVisible ? 'visible' : 'hidden'}`}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Tasks</Text>
          <TouchableOpacity
            onPress={handleResetFilters}
            style={styles.resetButton}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Status Filters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.optionsContainer}>
            <View style={styles.statusOption}>
              <Text style={styles.statusText}>Show Completed</Text>
              {/* <TouchableOpacity
                style={styles.switchContainer}
                onPress={() => setShowCompleted(!showCompleted)}
                activeOpacity={0.7}
              > */}
              <MySwitch
                value={showCompleted}
                onValueChange={setShowCompleted}
                activeColor={theme.colors.primary}
                // Add a key to force remounting
                key={`completed-switch-${isVisible}`}
              />
              {/* </TouchableOpacity> */}
            </View>
            <View style={styles.statusOption}>
              <Text style={styles.statusText}>Only Past Due</Text>
              {/* <TouchableOpacity
                style={styles.switchContainer}
                onPress={() => setShowPastDue(!showPastDue)}
                activeOpacity={0.7}
              > */}
              <MySwitch
                value={showPastDue}
                onValueChange={setShowPastDue}
                activeColor={theme.colors.primary}
                // Add a key to force remounting
                key={`past-due-switch-${isVisible}`}
              />
              {/* </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Chip
                  key={tag.id}
                  selected={selectedTags.includes(tag.id)}
                  showSelectedCheck={false}
                  onPress={() => handleTagPress(tag.id)}
                  style={[
                    styles.tagChip,
                    selectedTags.includes(tag.id) && {
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  textStyle={{
                    color: selectedTags.includes(tag.id)
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSecondaryContainer,
                  }}
                >
                  {tag.name}
                </Chip>
              ))
            ) : (
              <Text style={styles.emptyText}>No tags available</Text>
            )}
            <Chip
              mode="outlined"
              onPress={() => showBottomSheet('tag', { source: 'taskScreen' })}
              style={styles.addTagChip}
              textStyle={styles.addTagChipText}
              compact
            >
              Add Tag
            </Chip>
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}
