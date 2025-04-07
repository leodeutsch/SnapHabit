import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useTheme } from '../../hooks/useTheme'
import { styles } from './styles'

interface ColorSwatchProps {
  color: string
  size?: number
  isSelected?: boolean
  onPress: () => void
  disabled?: boolean
  opacity?: number
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  size = 40,
  isSelected = false,
  onPress,
  disabled = false,
  opacity = 1,
}) => {
  const { theme } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      disabled={disabled}
      accessibilityLabel={`Select ${color} as app accent color`}
    >
      <View
        style={[
          styles.swatch,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: isSelected ? 2 : 0,
            borderColor: theme.colors.outline,
            opacity,
          },
        ]}
      >
        {isSelected && (
          <View
            style={[styles.checkmark, { borderColor: theme.colors.onPrimary }]}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}
