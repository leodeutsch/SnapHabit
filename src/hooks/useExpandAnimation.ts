import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'

export const useExpandAnimation = (duration = 300) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const expandAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(expandAnimation, {
      toValue: isExpanded ? 1 : 0,
      duration,
      useNativeDriver: false,
    }).start()
  }, [isExpanded, expandAnimation, duration])

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
    return isExpanded // Return the current state before toggle
  }

  const interpolateHeight = (minHeight: number, maxHeight: number) => {
    return expandAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [minHeight, maxHeight],
    })
  }

  return {
    isExpanded,
    toggleExpand,
    expandAnimation,
    interpolateHeight,
  }
}
