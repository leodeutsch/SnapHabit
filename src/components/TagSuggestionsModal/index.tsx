import { MaterialIcons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTags } from '../../hooks/useTags'
import { useTaskForm } from '../../hooks/useTaskForm'
import { useTheme } from '../../hooks/useTheme'
import { Tag } from '../../types'
import { Chip } from '../Chip'
import { tagSuggestionsModalStyles } from './styles'

export const TagSuggestionsModal: React.FC = () => {
  const { currentTask, updateCurrentTask } = useTaskForm()
  const { hideBottomSheet, showBottomSheet } = useBottomSheet()
  const { tags } = useTags()
  const { theme } = useTheme()
  const styles = useMemo(() => tagSuggestionsModalStyles(theme), [theme])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const handleSave = () => {
    updateCurrentTask({
      ...currentTask,
      tags: [...(currentTask.tags || []), ...(selectedTags || [])],
    })

    showBottomSheet('addTask')
  }

  const renderTagChips = () => (
    <ScrollView contentContainerStyle={styles.tagChipsContainer}>
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          tag={tag}
          onDelete={() => {}}
          onPress={() => {
            setSelectedTags((prev) =>
              prev.includes(tag)
                ? prev.filter((t) => t.id !== tag.id)
                : [...prev, tag],
            )
          }}
          isDeletable={false}
          addStyle={[
            { borderWidth: 0.8, borderColor: theme.colors.secondaryContainer },
            selectedTags.includes(tag) && styles.selectedTag,
          ]}
        />
      ))}
    </ScrollView>
  )

  return (
    <View style={styles.container}>
      <View style={styles.sheetHeader}>
        <TouchableOpacity
          onPress={hideBottomSheet}
          style={styles.headerButton}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
        >
          <MaterialIcons
            name="check"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tagContainer}>{renderTagChips()}</View>
      {/* <ScrollView>
        {tags.map((tag) =>
          selectedTags.includes(tag) ? (
            <TouchableOpacity
              key={tag.id}
              style={[styles.item, styles.selectedItem]}
              onPress={() => {
                setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id))
              }}
            >
              <Text style={styles.text}>{tag.name}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={tag.id}
              style={styles.item}
              onPress={() => {
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t.id !== tag.id)
                    : [...prev, tag],
                )
              }}
            >
              <Text style={styles.text}>{tag.name}</Text>
            </TouchableOpacity>
          ),
        )}
      </ScrollView> */}
    </View>
  )
}
