import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { useMenu } from '@/contexts/MenuContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const EDGE_WIDTH = 30; // Width of the edge detection zone
const SWIPE_THRESHOLD = 50; // Minimum swipe distance to trigger

export function SwipeEdgeDetector({ children }: { children: React.ReactNode }) {
  const { openMenu, menuVisible } = useMenu();
  const startX = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only activate if touch starts near right edge
        const touchX = evt.nativeEvent.pageX;
        startX.current = touchX;
        return touchX > SCREEN_WIDTH - EDGE_WIDTH;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Respond to left swipes from right edge
        const touchX = evt.nativeEvent.pageX;
        return (
          startX.current > SCREEN_WIDTH - EDGE_WIDTH &&
          gestureState.dx < -10 &&
          Math.abs(gestureState.dy) < 30
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped left far enough, open menu
        if (gestureState.dx < -SWIPE_THRESHOLD || gestureState.vx < -0.5) {
          openMenu();
        }
      },
    })
  ).current;

  // Don't capture gestures when menu is visible
  if (menuVisible) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
      {/* Invisible edge zone indicator (for debugging, can remove) */}
      <View style={styles.edgeZone} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  edgeZone: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: EDGE_WIDTH,
    // backgroundColor: 'rgba(255,0,0,0.1)', // Uncomment for debugging
  },
});

export default SwipeEdgeDetector;
