import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTags } from '../../hooks/useTags'
import { useTheme } from '../../hooks/useTheme'
import { Tag } from '../../types'
import { tagSheetStyles } from './styles'

const initialTag: Tag = {
  id: '',
  name: '',
}

export const TagSheet: React.FC = () => {
  const { addTag, updateTag } = useTags()
  const { theme } = useTheme()
  const { hideBottomSheet, data } = useBottomSheet()
  const styles = useMemo(() => tagSheetStyles(theme), [theme])
  const [currentTag, setCurrentTag] = useState<Tag>(initialTag)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (data && 'tag' in data) {
      setCurrentTag({ ...initialTag, ...data.tag })
    } else {
      setCurrentTag(initialTag)
    }
    inputRef.current?.focus()
  }, [data])

  const handleSubmit = () => {
    if (currentTag.name.trim()) {
      if (currentTag.id) {
        updateTag(currentTag)
      } else {
        addTag(currentTag.name)
      }
      hideBottomSheet()
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Enter tag name"
        placeholderTextColor={theme.colors.outline}
        value={currentTag.name}
        onChangeText={(text) => setCurrentTag({ ...currentTag, name: text })}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>
          {currentTag.id ? 'Update' : 'Add'} Tag
        </Text>
      </TouchableOpacity>
    </View>
  )
}
