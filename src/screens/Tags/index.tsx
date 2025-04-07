import { MaterialIcons } from '@expo/vector-icons'
import React, { useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Chip } from '../../components/Chip'
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
  const translateYAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

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

  const showBottomSheetAnimated = () => {
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: DURATION_LONG2 * 0.4,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: DURATION_LONG2 * 0.6,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const hideBottomSheetAnimated = () => {
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: SCREEN_HEIGHT,
        duration: DURATION_LONG2 * 0.4,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: DURATION_LONG2 * 0.6,
        easing: EMPHASIZED_EASING,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideBottomSheet()
    })
    Keyboard.dismiss()
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
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons
            name="edit"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 24 }}
          onPress={() => handleDeleteTag(item)}
        >
          <MaterialIcons
            name="delete"
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
          tag={tag}
          onDelete={() => !isAnimating && handleDeleteTag(tag)}
          onPress={() => {}}
        />
      ))}
      <TouchableOpacity
        style={styles.addTagChip}
        onPress={() => {}}
        disabled={isAnimating}
      >
        <Text style={styles.addTagChipText}>Add Tag</Text>
      </TouchableOpacity>
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
          <MaterialIcons
            name={isListView ? 'grid-view' : 'list'}
            size={24}
            color={theme.colors.onBackground}
          />
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
