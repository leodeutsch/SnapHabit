import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { Check, X } from 'lucide-react-native'
import { useMemo, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { Chip, Portal } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useFormType } from '../../hooks/useFormType'
import { useHabitForm } from '../../hooks/useHabitForm'
import { useTags } from '../../hooks/useTags'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { Tag } from '../../types'
import { tagSuggestionsModalStyles } from './styles'

export const TagSuggestionsModal: React.FC = () => {
  const { formType } = useFormType()
  const { updateTask } = useTasks()
  const { currentTask, updateCurrentTask } = useTaskForm()
  const { currentHabit, updateCurrentHabit } = useHabitForm()
  const { data, hideBottomSheet, showBottomSheet } = useBottomSheet()
  const { tags } = useTags()
  const { theme } = useTheme()
  const styles = useMemo(() => tagSuggestionsModalStyles(theme), [theme])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['24%', '60%'], [])

  // Determine if we're in edit mode for an existing task
  const isEditMode = Boolean(data?.task && data?.returnTo === 'taskDetails')
  const taskToEdit = isEditMode ? data?.task : null

  // Initialize selected tags based on the current mode
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    isEditMode && taskToEdit?.tags
      ? taskToEdit.tags
      : formType === 'task'
        ? currentTask.tags || []
        : currentHabit.tags || [],
  )

  // Update the handleSave function to handle both create and edit flows
  const handleSave = () => {
    if (isEditMode && taskToEdit) {
      // Edit flow - update existing task
      const updatedTask = {
        ...taskToEdit,
        tags: selectedTags,
      }

      // Update the task in global state
      updateTask(updatedTask)

      // Return to task details
      showBottomSheet('taskDetails', { task: updatedTask })
    } else if (formType === 'habit') {
      // Original habit create flow
      updateCurrentHabit({
        ...currentHabit,
        tags: selectedTags,
      })
      showBottomSheet('addHabit')
    } else {
      // Original task create flow
      updateCurrentTask({
        ...currentTask,
        tags: selectedTags,
      })
      showBottomSheet('addTask')
    }
  }

  const renderTagChips = () => (
    <ScrollView contentContainerStyle={styles.tagChipsContainer}>
      {tags.map((tag) => {
        const isTagSelected = selectedTags.some((t) => t.id === tag.id)
        return (
          <Chip
            key={tag.id}
            style={[styles.tagChip, isTagSelected && styles.selectedTag]}
            selected={isTagSelected}
            showSelectedCheck={false}
            textStyle={styles.tagChipText}
            onPress={() => {
              setSelectedTags((prev) =>
                prev.some((t) => t.id === tag.id)
                  ? prev.filter((t) => t.id !== tag.id)
                  : [...prev, tag],
              )
            }}
          >
            {tag.name}
          </Chip>
        )
      })}
      <Chip
        mode="outlined"
        onPress={() =>
          showBottomSheet('tag', { source: 'TagSuggestionsModal' })
        }
        style={styles.addTagChip}
        textStyle={styles.addTagChipText}
        compact
      >
        Add Tag
      </Chip>
    </ScrollView>
  )

  // Also update the handleCloseSheet function
  const handleCloseSheet = () => {
    if (isEditMode && taskToEdit) {
      // Return to details view with original task
      setTimeout(() => {
        showBottomSheet('taskDetails', { task: taskToEdit })
      }, 100)
    } else {
      // Original close behavior
      bottomSheetRef.current?.close()
      showBottomSheet(formType === 'task' ? 'addTask' : 'addHabit')
    }
  }

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        animateOnMount
        enableDynamicSizing={false}
        onClose={handleCloseSheet}
        backdropComponent={(props: any) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0}
            onPress="close"
          />
        )}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.outlineVariant,
        }}
        backgroundStyle={{
          backgroundColor: theme.colors.surface,
        }}
      >
        <View style={styles.container}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              onPress={hideBottomSheet}
              style={styles.headerButton}
            >
              <X
                size={24}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.headerButton}
            >
              <Check
                size={24}
                color={theme.colors.primary}
                strokeWidth={3}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tagContainer}>{renderTagChips()}</View>
        </View>
      </BottomSheet>
    </Portal>
  )
}
