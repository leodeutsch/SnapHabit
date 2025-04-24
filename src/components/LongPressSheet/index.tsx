import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { Calendar, CalendarCheck, CalendarClock } from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, View } from 'react-native'
import { Button, IconButton, Text } from 'react-native-paper'
import { useTheme } from '../../hooks/useTheme'
import { confirmSheetStyles } from './styles'

type LongPressSheetProps = {
  itemType: 'task' | 'habit'
  visible: boolean
  onClose: () => void
  onDelete: () => void
  onPostpone?: (option: 'today' | 'tomorrow' | 'nextMonday') => void
}

export const LongPressSheet: React.FC<LongPressSheetProps> = ({
  itemType,
  visible,
  onClose,
  onDelete,
  onPostpone,
}) => {
  const { theme } = useTheme()
  const styles = useMemo(() => confirmSheetStyles(theme), [theme])
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const snapPoints = useMemo(() => ['32%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Animation values
  const postponeOpacity = useRef(new Animated.Value(1)).current
  const confirmTextOpacity = useRef(new Animated.Value(0)).current
  const deleteButtonWidth = useRef(new Animated.Value(1)).current
  const cancelButtonOpacity = useRef(new Animated.Value(0)).current

  // Auto show confirmation for habits
  useEffect(() => {
    if (visible && itemType === 'habit') {
      setIsConfirmingDelete(true)
      postponeOpacity.setValue(0)
      confirmTextOpacity.setValue(1)
      deleteButtonWidth.setValue(0.5)
      cancelButtonOpacity.setValue(1)
    }
  }, [
    visible,
    itemType,
    postponeOpacity,
    confirmTextOpacity,
    deleteButtonWidth,
    cancelButtonOpacity,
  ])

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0)
    } else {
      bottomSheetRef.current?.close()
    }
  }, [visible])

  const handleSheetClose = useCallback(() => {
    postponeOpacity.setValue(1)
    confirmTextOpacity.setValue(0)
    deleteButtonWidth.setValue(1)
    cancelButtonOpacity.setValue(0)
    setIsConfirmingDelete(false)
    onClose()
  }, [
    onClose,
    postponeOpacity,
    confirmTextOpacity,
    deleteButtonWidth,
    cancelButtonOpacity,
  ])

  const handleDeletePress = useCallback(() => {
    setIsConfirmingDelete(true)

    Animated.sequence([
      // Step 1: Fade out postpone options with a slight bounce
      Animated.timing(postponeOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      // Step 2: Change button width (can't use useNativeDriver for width/layout)
      Animated.timing(deleteButtonWidth, {
        toValue: 0.5,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false, // Must be false for layout animations
      }),
      // Step 3: Fade in confirmation text and cancel button
      Animated.parallel([
        Animated.timing(confirmTextOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(cancelButtonOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ]).start()
  }, [
    postponeOpacity,
    deleteButtonWidth,
    confirmTextOpacity,
    cancelButtonOpacity,
  ])

  const handleCancelPress = useCallback(() => {
    Animated.sequence([
      // Step 1: Fade out confirmation text and cancel button
      Animated.parallel([
        Animated.timing(confirmTextOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(cancelButtonOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
      // Step 2: Scale up delete button
      Animated.timing(deleteButtonWidth, {
        toValue: 1,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false, // FIXED: Changed from false to false
      }),
      // Step 3: Fade in postpone options
      Animated.timing(postponeOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsConfirmingDelete(false)
    })
  }, [
    postponeOpacity,
    deleteButtonWidth,
    confirmTextOpacity,
    cancelButtonOpacity,
  ])

  const handleConfirmDelete = useCallback(() => {
    // Execute delete operation first
    onDelete()

    // Then close the sheet right away
    handleSheetClose()
  }, [onDelete, handleSheetClose])

  const renderPostponeOptions = () => {
    if (itemType === 'task' && onPostpone) {
      return (
        <Animated.View
          style={[styles.postponeContainer, { opacity: postponeOpacity }]}
        >
          <View style={styles.postponeOption}>
            <IconButton
              icon={({ size }) => (
                <CalendarClock
                  size={size}
                  color={theme.colors.primary}
                />
              )}
              size={28}
              onPress={() => {
                onPostpone('today')
                handleSheetClose()
              }}
              disabled={isConfirmingDelete}
            />
            <Text style={styles.postponeLabel}>Today</Text>
          </View>
          <View style={styles.postponeOption}>
            <IconButton
              icon={({ size }) => (
                <Calendar
                  size={size}
                  color={theme.colors.primary}
                />
              )}
              size={28}
              onPress={() => {
                onPostpone('tomorrow')
                handleSheetClose()
              }}
              disabled={isConfirmingDelete}
            />
            <Text style={styles.postponeLabel}>Tomorrow</Text>
          </View>
          <View style={styles.postponeOption}>
            <IconButton
              icon={({ size }) => (
                <CalendarCheck
                  size={size}
                  color={theme.colors.primary}
                />
              )}
              size={28}
              onPress={() => {
                onPostpone('nextMonday')
                handleSheetClose()
              }}
              disabled={isConfirmingDelete}
            />
            <Text style={styles.postponeLabel}>Next Monday</Text>
          </View>
        </Animated.View>
      )
    }
    return null
  }

  const renderConfirmationArea = () => (
    <Animated.View
      style={[
        styles.confirmationArea,
        {
          opacity: confirmTextOpacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 60,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      pointerEvents={isConfirmingDelete ? 'auto' : 'none'}
    >
      <Text style={styles.confirmationText}>Are you sure?</Text>
    </Animated.View>
  )

  const renderActionButtons = () => {
    // Create interpolated width values instead of using scale
    const deleteButtonWidthInterpolated = deleteButtonWidth.interpolate({
      inputRange: [0.5, 1],
      outputRange: ['48%', '100%'], // Shrink to 48% of container width at minimum
    })

    const cancelButtonWidthInterpolated = deleteButtonWidth.interpolate({
      inputRange: [0.5, 1],
      outputRange: ['48%', '0%'], // Grow from 0% to 48% when delete button shrinks
    })

    return (
      <View style={styles.actionButtonsContainer}>
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: cancelButtonOpacity,
              width: cancelButtonWidthInterpolated,
              display: isConfirmingDelete ? 'flex' : 'none',
            },
          ]}
        >
          <Button
            mode="outlined"
            style={[styles.cancelButton, { width: '100%' }]}
            onPress={handleCancelPress}
          >
            Cancel
          </Button>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer,
            { width: deleteButtonWidthInterpolated },
          ]}
        >
          <Button
            mode="contained"
            style={[styles.deleteButton, { width: '100%' }]}
            buttonColor={theme.colors.error}
            onPress={
              isConfirmingDelete ? handleConfirmDelete : handleDeletePress
            }
          >
            {isConfirmingDelete ? 'Delete' : `Delete ${itemType}`}
          </Button>
        </Animated.View>
      </View>
    )
  }

  // Only show the delete button for habits, no postpone options
  const renderContent = () => {
    if (itemType === 'habit') {
      return (
        <>
          {renderConfirmationArea()}
          {renderActionButtons()}
        </>
      )
    }

    return (
      <>
        {renderConfirmationArea()}
        {renderPostponeOptions()}
        {renderActionButtons()}
      </>
    )
  }

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.4}
            pressBehavior="close"
          />
        )}
        onClose={handleSheetClose}
        style={styles.container}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetView style={styles.contentContainer}>
          {renderContent()}
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}
