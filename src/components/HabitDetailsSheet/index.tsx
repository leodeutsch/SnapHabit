import { MaterialIcons } from '@expo/vector-icons'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useMemo, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useBottomSheet } from '../../hooks/useBottomSheet'
import { useTheme } from '../../hooks/useTheme'
import { dueDateRender } from '../../utils/dueDateRender'
import { Chip } from '../Chip'
import { habitDetailsStyles } from './styles'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const HabitDetailsSheet: React.FC = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => habitDetailsStyles(theme), [theme])
  const { data, openBottomSheet, closeBottomSheet } = useBottomSheet()
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current

  return (
    <BottomSheetView style={styles.container}>
      <View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={closeBottomSheet}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>

        {/* Task details */}
        <Text style={styles.title}>{data?.habit?.title}</Text>
        <View style={styles.tagViewer}>
          {data?.habit?.tags?.map((tag) => (
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
          {data ? dueDateRender(data, styles) : 'No due date'}
        </Text>
        <Text style={styles.description}>
          {data?.habit?.description || 'No description available'}
        </Text>
      </View>
    </BottomSheetView>
  )
}
