import { X } from 'lucide-react-native'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { useTheme } from '../../hooks/useTheme'
import { Tag } from '../../types'
import { chipStyles } from './styles'

export const Chip: React.FC<{
  tag: Tag
  onDelete: () => void
  onPress: () => void
  disabled?: boolean
  isDeletable?: boolean
  addStyle?: any
}> = ({ tag, onDelete, onPress, disabled, isDeletable = true, addStyle }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => chipStyles(theme), [theme])

  return (
    <TouchableOpacity
      style={[styles.tagChip, addStyle && addStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.tagChipText}>{tag.name}</Text>
      {isDeletable && (
        <TouchableOpacity
          style={styles.tagChipDelete}
          onPress={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          disabled={disabled}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X
            size={18}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}
