import { Search as SearchIcon, Tag } from 'lucide-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Searchbar } from 'react-native-paper'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useHabits } from '../../hooks/useHabits'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useSearch } from '../../hooks/useSearch'
import { useTags } from '../../hooks/useTags'
import { useTasks } from '../../hooks/useTasks'
import { useTheme } from '../../hooks/useTheme'
import { BottomSheetContent } from '../../types'
import { searchModalStyles } from './styles'

// Types
type SuggestionType = 'task' | 'habit' | 'tag' | 'description'

interface Suggestion {
  id: string
  type: SuggestionType
  title: string
  description?: string
  tagName?: string
}

// Main Component
export const SearchModal: React.FC = () => {
  // Hooks
  const { theme } = useTheme()
  const styles = useMemo(() => searchModalStyles(theme), [theme])
  const { tasks } = useTasks()
  const { habits } = useHabits()
  const { tags } = useTags()
  const { showBottomSheet } = useBottomSheet()
  const { keyboardVisible } = useKeyboard()
  const { isSearchVisible, searchQuery, hideSearch, setSearchQuery } =
    useSearch()

  // State
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [keyboardWasVisible, setKeyboardWasVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Refs
  const inputRef = useRef<TextInput>(null)
  const slideAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const suggestionsSlideAnim = useRef(new Animated.Value(0)).current

  // Effects

  // 1. Handle visibility animations
  useEffect(() => {
    if (isSearchVisible) {
      handleOpen()
    } else if (!isClosing) {
      handleRegularClose()
    }
  }, [isSearchVisible, isClosing])

  // 2. Handle keyboard dismiss
  useEffect(() => {
    if (
      keyboardWasVisible &&
      !keyboardVisible &&
      isSearchVisible &&
      !isClosing
    ) {
      handleKeyboardDismiss()
    }
    setKeyboardWasVisible(keyboardVisible)
  }, [keyboardVisible, keyboardWasVisible, isSearchVisible])

  // 3. Filter suggestions based on query
  useEffect(() => {
    filterSuggestions()
  }, [searchQuery, tasks, habits])

  // Animation handlers
  const handleOpen = () => {
    setIsClosing(false)
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      inputRef.current?.focus()
    })

    // Show suggestions container after a slight delay
    setTimeout(() => {
      Animated.timing(suggestionsSlideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }, 100)
  }

  const handleRegularClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(suggestionsSlideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleKeyboardDismiss = () => {
    setIsClosing(true)

    // First close the suggestions container
    Animated.timing(suggestionsSlideAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Then close the main modal
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        hideSearch()
        setIsClosing(false)
      })
    })
  }

  // Search functionality
  const filterSuggestions = () => {
    const filtered: Suggestion[] = []
    const query = searchQuery.toLowerCase().trim()
    setSearchQuery(query)

    if (query.length > 0) {
      // Filter tasks
      tasks.forEach((task) => {
        if (task.title.toLowerCase().includes(query)) {
          filtered.push({
            id: task.id,
            type: 'task',
            title: task.title,
            description: task.description,
          })
        } else if (task.description?.toLowerCase().includes(query)) {
          filtered.push({
            id: task.id,
            type: 'description',
            title: task.title,
            description: task.description,
          })
        } else if (
          task.tags &&
          task.tags.length > 0 &&
          task.tags.some((tag) => tag.name.toLowerCase().includes(query))
        ) {
          filtered.push({
            id: task.id,
            type: 'task',
            title: task.title,
            description: `Tagged with: ${
              task.tags.find((tag) => tag.name.toLowerCase().includes(query))
                ?.name
            }`,
          })
        }
      })

      // Filter habits
      habits.forEach((habit) => {
        if (habit.title.toLowerCase().includes(query)) {
          filtered.push({
            id: habit.id,
            type: 'habit',
            title: habit.title,
            description: habit.description,
          })
        } else if (habit.description?.toLowerCase().includes(query)) {
          filtered.push({
            id: habit.id,
            type: 'description',
            title: habit.title,
            description: habit.description,
          })
        } else if (
          habit.tags &&
          habit.tags.length > 0 &&
          habit.tags.some((tag) => tag.name.toLowerCase().includes(query))
        ) {
          filtered.push({
            id: habit.id,
            type: 'habit',
            title: habit.title,
            description: `Tagged with: ${
              habit.tags.find((tag) => tag.name.toLowerCase().includes(query))
                ?.name
            }`,
          })
        }
      })

      // Show suggestions container
      Animated.timing(suggestionsSlideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else {
      // Hide suggestions container when query is empty
      Animated.timing(suggestionsSlideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }

    setSuggestions(filtered)
  }

  const handleSelectItem = (item: Suggestion) => {
    setIsClosing(true)
    let bottomSheetToShow: BottomSheetContent | null = null
    let bottomSheetParams: any = null

    // Determine which sheet to show
    if (item.type === 'tag' && item.tagName) {
      const tagSearched = tags.find((tag) => tag.name === item.tagName)
      if (tagSearched) {
        bottomSheetToShow = 'tag'
        bottomSheetParams = { tag: tagSearched }
      }
    } else {
      const isTask =
        item.type === 'task' ||
        (item.type === 'description' && tasks.some((t) => t.id === item.id))
      const isHabit =
        item.type === 'habit' ||
        (item.type === 'description' && habits.some((h) => h.id === item.id))

      if (isTask) {
        const task = tasks.find((t) => t.id === item.id)
        if (task) {
          bottomSheetToShow = 'taskDetails'
          bottomSheetParams = { task }
        }
      } else if (isHabit) {
        const habit = habits.find((h) => h.id === item.id)
        if (habit) {
          bottomSheetToShow = 'habitDetails'
          bottomSheetParams = { habit }
        }
      }
    }

    // Close the modal
    Animated.parallel([
      Animated.timing(suggestionsSlideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Show bottom sheet BEFORE hiding search
      if (bottomSheetToShow) {
        showBottomSheet(bottomSheetToShow, bottomSheetParams)
      }

      hideSearch()
      setIsClosing(false)
    })
  }

  // Render functions
  const renderSuggestionItem = ({ item }: { item: Suggestion }) => {
    let icon
    let subtitle

    switch (item.type) {
      case 'task':
        icon = (
          <SearchIcon
            size={16}
            color={theme.colors.primary}
          />
        )
        subtitle = 'Task'
        break
      case 'habit':
        icon = (
          <SearchIcon
            size={16}
            color={theme.colors.secondary}
          />
        )
        subtitle = 'Habit'
        break
      case 'tag':
        icon = (
          <Tag
            size={16}
            color={theme.colors.tertiary}
          />
        )
        subtitle = item.description
        break
      case 'description':
        icon = (
          <SearchIcon
            size={16}
            color={theme.colors.outline}
          />
        )
        subtitle = 'Found in description'
        break
    }

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelectItem(item)}
      >
        <View style={styles.suggestionIcon}>{icon}</View>
        <View style={styles.suggestionContent}>
          <Text style={styles.suggestionTitle}>{item.title}</Text>
          <Text style={styles.suggestionSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (!isSearchVisible) return null

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={hideSearch}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Search Bar */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.searchBarContainer}>
          <Searchbar
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search..."
            placeholderTextColor={theme.colors.outline}
            returnKeyLabel="Search"
            clearButtonMode="while-editing"
            style={styles.searchBar}
            inputStyle={styles.input}
          />
        </View>
      </Animated.View>

      {/* Suggestions */}
      <Animated.View
        style={[
          styles.suggestionsContainer,
          {
            opacity: suggestionsSlideAnim,
            transform: [
              {
                translateY: suggestionsSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
            height:
              searchQuery.length > 0 && suggestions.length === 0
                ? 100
                : Math.min(suggestions.length * 80, 400),
          },
        ]}
      >
        {searchQuery.length > 0 ? (
          suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => `${item.id}-${item.type}`}
              renderItem={renderSuggestionItem}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Nothing searched</Text>
          </View>
        )}
      </Animated.View>
    </View>
  )
}
