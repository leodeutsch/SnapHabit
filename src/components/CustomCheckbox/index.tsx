import { Circle, CircleCheck } from 'lucide-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import { useTheme } from '../../hooks/useTheme'
import { checkboxStyles } from './styles'

type CustomCheckboxProps = {
  status: 'checked' | 'unchecked' | 'indeterminate'
  onPress: () => void
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  status,
  onPress,
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => checkboxStyles(theme), [theme])
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(status === 'checked')
  }, [status])

  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    setChecked(status === 'checked')
  }, [status])

  const handlePress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start()

    onPress()
  }

  return (
    <TouchableOpacity
      style={[styles.customCheckbox]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        {checked ? (
          <CircleCheck
            size={24}
            color={theme.colors.primary}
          />
        ) : (
          <Circle
            size={24}
            color={theme.colors.outlineVariant}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}
