import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Text, TextInput } from 'react-native'
import { Button } from 'react-native-paper'
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
  const { hideBottomSheet, showBottomSheet, content, data } = useBottomSheet()

  const bottomSheetRef = useRef<BottomSheet>(null)
  const inputRef = useRef<TextInput>(null)

  const styles = useMemo(() => tagSheetStyles(theme), [theme])
  const [currentTag, setCurrentTag] = useState<Tag>(initialTag)
  const snapPoints = useMemo(() => ['24%'], [])

  const isTagsScreen =
    window.location?.pathname?.includes('Tags') || data?.source === 'TagsScreen'

  useEffect(() => {
    if (data?.tag) {
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

      if (!isTagsScreen && content === 'tag') {
        showBottomSheet('tagSuggestions')
      } else {
        hideBottomSheet()
      }

      if (data?.source === 'taskScreen' || data?.source === 'habitScreen') {
        addTag(currentTag.name)
        hideBottomSheet()
      }
    }
  }

  const handleCloseSheet = () => {
    setCurrentTag(initialTag)

    if (data?.source === 'taskScreen' || data?.source === 'habitScreen') {
      hideBottomSheet()
    } else if (!isTagsScreen && content === 'tag') {
      showBottomSheet('tagSuggestions')
    } else {
      hideBottomSheet()
    }
  }

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
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
        <BottomSheetView style={styles.container}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Enter tag name"
            placeholderTextColor={theme.colors.outline}
            value={currentTag.name}
            onChangeText={(text) =>
              setCurrentTag({ ...currentTag, name: text })
            }
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <Button
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {currentTag.id ? 'Update' : 'Add'} Tag
            </Text>
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}
