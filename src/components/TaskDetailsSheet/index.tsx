import { MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useMemo, useRef } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTheme } from '../../hooks/useTheme'
import { dueDateRender } from '../../utils/dueDateRender'
import { Chip } from '../Chip'
import { taskDetailsStyles } from './styles'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MIN_HEIGHT = SCREEN_HEIGHT * 0.3 // Initial height: 30% of screen
const MAX_HEIGHT = SCREEN_HEIGHT * 0.9 // Max height: 90% of screen

export const TaskDetailsSheet = ({}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => taskDetailsStyles(theme), [theme])
  const { isVisible, data, hideBottomSheet } = useBottomSheet()
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const lastPosition = useRef(SCREEN_HEIGHT) // Track last resting position

  // Animate the sheet when visibility changes
  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - MIN_HEIGHT, // Slide up to 30% height
        useNativeDriver: true,
        tension: 50, // Controls animation speed
        friction: 7, // Controls bounce
      }).start(() => {
        lastPosition.current = SCREEN_HEIGHT - MIN_HEIGHT
      })
    } else {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT, // Slide off-screen
        useNativeDriver: true,
      }).start(() => {
        lastPosition.current = SCREEN_HEIGHT
      })
    }
  }, [isVisible])

  // Handle drag gestures
  const panResponder = PanResponder.create({
    // Only respond to significant vertical drags
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dy) > 5,

    // Update position while dragging
    onPanResponderMove: (_, gestureState) => {
      const newY = lastPosition.current + gestureState.dy
      translateY.setValue(
        Math.max(SCREEN_HEIGHT - MAX_HEIGHT, Math.min(SCREEN_HEIGHT, newY)),
      )
    },

    // Snap to position when drag ends
    onPanResponderRelease: (_, gestureState) => {
      const currentY = lastPosition.current + gestureState.dy
      const state =
        lastPosition.current === SCREEN_HEIGHT - MAX_HEIGHT
          ? 'expanded'
          : lastPosition.current === SCREEN_HEIGHT - MIN_HEIGHT
            ? 'minimized'
            : 'closed' // Assuming it starts in one of these states

      const DRAG_THRESHOLD = 100 // Pixels to drag to change state

      if (state === 'expanded') {
        if (gestureState.dy > DRAG_THRESHOLD) {
          // Dragged down more than 100px, snap to minimized
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - MIN_HEIGHT,
            useNativeDriver: true,
          }).start(() => {
            lastPosition.current = SCREEN_HEIGHT - MIN_HEIGHT
          })
        } else {
          // Snap back to expanded (includes small drags or drags up)
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - MAX_HEIGHT,
            useNativeDriver: true,
          }).start(() => {
            lastPosition.current = SCREEN_HEIGHT - MAX_HEIGHT
          })
        }
      } else if (state === 'minimized') {
        if (gestureState.dy < -DRAG_THRESHOLD) {
          // Dragged up more than 100px, snap to expanded
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - MAX_HEIGHT,
            useNativeDriver: true,
          }).start(() => {
            lastPosition.current = SCREEN_HEIGHT - MAX_HEIGHT
          })
        } else if (gestureState.dy > DRAG_THRESHOLD) {
          // Dragged down more than 100px, snap to closed
          hideBottomSheet()
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT,
            useNativeDriver: true,
          }).start(() => {
            lastPosition.current = SCREEN_HEIGHT
          })
        } else {
          // Snap back to minimized
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - MIN_HEIGHT,
            useNativeDriver: true,
          }).start(() => {
            lastPosition.current = SCREEN_HEIGHT - MIN_HEIGHT
          })
        }
      } else if (state === 'closed') {
        if (gestureState.dy < -DRAG_THRESHOLD) {
          // Dragged up more than 100px, snap to minimized
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - MIN_HEIGHT,
            useNativeDriver: true,
          }).start(() => {
            lastPosition.current = SCREEN_HEIGHT - MIN_HEIGHT
          })
        } else {
          // Snap back to closed
          hideBottomSheet()
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT,
            useNativeDriver: true,
          }).start(() => {
            lastPosition.current = SCREEN_HEIGHT
          })
        }
      }
    },
  })

  // Don't render anything if not visible
  if (!isVisible) return null

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideBottomSheet}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>

        {/* Task details */}
        <Text style={styles.title}>{data?.task?.title}</Text>
        <View style={styles.tagViewer}>
          {data?.task?.tags?.map((tag) => (
            <Chip
              key={tag.id}
              tag={tag}
              onPress={() => {}}
              onDelete={() => {}}
              isDeletable={false}
            />
          ))}
        </View>
        <Text style={styles.reminderText}>
          {data?.task ? dueDateRender(data.task, styles) : 'No due date'}
        </Text>
        <Text style={styles.description}>
          {data?.task?.description || 'No description available'}
        </Text>
      </Animated.View>
    </View>
  )
}
