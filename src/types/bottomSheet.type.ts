import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export type SnapPoint = string | number // percentages ('25%') or fixed values (300)

export interface BottomSheetProps {
  // Essential props
  snapPoints: SnapPoint[]
  children: ReactNode

  // Control props
  initialSnapIndex?: number
  isOpen?: boolean
  onClose?: () => void
  onChange?: (index: number) => void

  // Animation and behavior
  enablePanDownToClose?: boolean
  animationDuration?: number
  animationEasing?: string
  bounceThreshold?: number
  bounciness?: number

  // Styling
  handleComponent?: ReactNode
  backgroundStyle?: StyleProp<ViewStyle>
  handleStyle?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>

  // Additional behavior
  enableOverDrag?: boolean
  enableContentPanningGesture?: boolean
  enableHandlePanningGesture?: boolean
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent'
  keyboardBlurBehavior?: 'none' | 'restore'
}

export interface BottomSheetRef {
  snapToIndex: (index: number) => void
  snapToPosition: (position: number) => void
  expand: () => void
  collapse: () => void
  close: () => void
  forceClose: () => void
  isActive: () => boolean
}
