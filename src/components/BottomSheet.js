import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { View, PanResponder, Animated, Platform, StyleSheet, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const calculateClosestSnapPoint = (dy, snapPoints = []) => {
  // Calculate the closest snap point based on gesture distance
  const distances = snapPoints.map((point) => Math.abs(dy - point))

  const closestSnapIndex = distances.indexOf(Math.min(...distances))
  return snapPoints[closestSnapIndex]
}

const BottomSheet = forwardRef(({ snapPoints = [0.6, 0.3, 0], onClose = () => {}, children }, ref) => {
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const [isDragging, setIsDragging] = useState(false)
  const safeMaxHeight = height - insets.top
  const _snapPoints = snapPoints.map((m) => m * safeMaxHeight)
  // this initial panY value of safeMaxHeight prevents the bottom sheet from showing anything on initial render
  const panY = useRef(new Animated.Value(safeMaxHeight)).current

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setIsDragging(true)
      Animated.event([null, { dy: panY }], { useNativeDriver: false })(null, { dy: gestureState.dy })
    },
    onPanResponderRelease: (_, gestureState) => {
      const gestureLimitArea = safeMaxHeight / 3
      const gestureDistance = gestureState.dy
      if (gestureDistance > gestureLimitArea) {
        hide()
      } else {
        const toValue = calculateClosestSnapPoint(gestureState.dy, _snapPoints)
        if (!isNaN(toValue)) {
          Animated.spring(panY, {
            toValue,
            useNativeDriver: false,
          }).start(() => {
            setIsDragging(false)
          })
        }
      }
    },
  })

  const show = () => {
    // Open the bottom sheet
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: false,
    }).start()
  }

  const hide = () => {
    // Close the bottom sheet
    Animated.spring(panY, {
      toValue: Math.max(..._snapPoints),
      useNativeDriver: false,
    }).start(() => onClose())
  }

  const snapToIndex = (index) => {
    if (_snapPoints?.length > index && index >= 0) {
      const toValue = _snapPoints[index]
      Animated.spring(panY, {
        toValue,
        useNativeDriver: false,
      }).start()
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
      snapToIndex,
    }),
    [_snapPoints],
  )

  return (
    <Animated.View
      style={{
        ...styles.container,
        backgroundColor: 'lightgrey',
        transform: [{ translateY: panY }],
        maxHeight: Math.min(safeMaxHeight, Math.max(..._snapPoints)),
      }}
    >
      <View style={{ height: Math.max(..._snapPoints), backgroundColor: 'transparent' }}>
        {/* Overlay view */}
        {isDragging && <View style={[styles.overlay, { backgroundColor: 'grey' }]} />}

        {/* Indicator Bar */}
        <View {...panResponder.panHandlers} style={[styles.indicator, { backgroundColor: 'orange' }]}>
          <View
            style={[
              {
                width: 30,
                height: 8,
                borderRadius: 3,
                backgroundColor: 'darkgrey',
              },
            ]}
          />
        </View>

        {/* Content View */}
        <View style={{ zIndex: 3, flex: 1 }}>{children}</View>
      </View>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 20,
    zIndex: 1,
    marginBottom: -1000,
  },
  indicator: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -20,
    paddingVertical: 6,
    zIndex: 3,
  },
})

export default BottomSheet
