import React, { useMemo } from 'react'
import { Animated, Pressable } from 'react-native'
import { useTheme } from '../../hooks/useTheme'
import { switchStyles } from './styles'

interface MySwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  activeColor?: string
}

export const MySwitch: React.FC<MySwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  activeColor,
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => switchStyles(theme), [theme])
  const [toggleAnimation] = React.useState(new Animated.Value(value ? 1 : 0))

  const activeTrackColor = activeColor || '#34C759' // iOS green by default

  React.useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [value, toggleAnimation])

  const thumbPosition = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Adjusted for proper positioning
  })

  const trackBackgroundColor = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e9e9ea', activeTrackColor],
  })

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
    >
      <Animated.View
        style={[styles.track, { backgroundColor: trackBackgroundColor }]}
      />
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX: thumbPosition }],
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
            borderRadius: '50%',
          },
        ]}
      />
    </Pressable>
  )
}
