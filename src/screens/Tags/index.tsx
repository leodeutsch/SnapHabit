import { LayoutGrid, LayoutList, Pencil, Trash, X } from 'lucide-react-native'
import React, { useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Chip } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTags } from '../../hooks/useTags'
import { useTheme } from '../../hooks/useTheme'
import { Tag } from '../../types'
import { tagStyles } from './styles'

const EMPHASIZED_EASING = Easing.bezier(0.2, 0, 0, 1)
const DURATION_LONG2 = 400
const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const TagsScreen = () => {
  const { showBottomSheet, hideBottomSheet } = useBottomSheet()
  const { tags, deleteTag } = useTags()
  const { theme } = useTheme()
  const styles = useMemo(() => tagStyles(theme), [theme])
  const [isListView, setIsListView] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const listViewAnim = useRef(new Animated.Value(0)).current

  const handleDeleteTag = (tag: Tag) => {
    Alert.alert(
      'Delete Tag',
      `Are you sure you want to delete "${tag.name}"?`,
      [
        { text: 'Cancel', style: 'default' },
        {
          text: 'Delete',
          style: 'cancel',
          onPress: () => deleteTag(tag.id),
        },
      ],
    )
  }

  const chipViewStyle = {
    opacity: listViewAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  }

  const listViewStyle = {
    opacity: listViewAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }

  const animateViewChange = (toListView: boolean) => {
    if (isAnimating) return

    setIsAnimating(true)
    Animated.timing(listViewAnim, {
      toValue: toListView ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      setIsListView(toListView)
      setIsAnimating(false)
    })
  }

  const renderTagItem = ({ item }: { item: Tag }) => (
    <View style={styles.tagItem}>
      <Text style={styles.tagName}>{item.name}</Text>
      <View style={styles.tagActions}>
        <TouchableOpacity
          onPress={() =>
            showBottomSheet('tag', { tag: item, source: 'TagsScreen' })
          }
        >
          <Pencil
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 24 }}
          onPress={() => handleDeleteTag(item)}
        >
          <Trash
            size={18}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderTagChips = () => (
    <ScrollView contentContainerStyle={styles.tagChipsContainer}>
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          style={styles.tagChip}
          textStyle={styles.tagChipText}
          onPress={() => showBottomSheet('tag', { tag, source: 'TagsScreen' })}
          onClose={() => !isAnimating && handleDeleteTag(tag)}
          closeIcon={() => (
            <X
              size={16}
              color={theme.colors.onSecondaryContainer}
            />
          )}
        >
          {tag.name}
        </Chip>
      ))}
      <Chip
        mode="outlined"
        onPress={() => showBottomSheet('tag', { source: 'TagsScreen' })}
        style={styles.addTagChip}
        textStyle={styles.addTagChipText}
        disabled={isAnimating}
        compact
      >
        Add Tag
      </Chip>
    </ScrollView>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Tags</Text>
        <TouchableOpacity
          onPress={() => animateViewChange(!isListView)}
          disabled={isAnimating}
        >
          {isListView ? (
            <LayoutGrid
              size={24}
              color={theme.colors.onBackground}
            />
          ) : (
            <LayoutList
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.viewContainer}>
        {/* First view - Chip View */}
        <Animated.View
          style={[styles.chipViewContainer, chipViewStyle]}
          pointerEvents={isListView ? 'none' : 'auto'}
        >
          {renderTagChips()}
        </Animated.View>

        <Animated.View
          style={[styles.listViewContainer, listViewStyle]}
          pointerEvents={isListView ? 'auto' : 'none'}
        >
          <FlatList
            data={tags}
            renderItem={renderTagItem}
            keyExtractor={(item) => item.id}
            style={styles.tagList}
          />
        </Animated.View>
      </View>
    </View>
  )
}
