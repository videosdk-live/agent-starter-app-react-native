import React, { useImperativeHandle } from "react";
import { Dimensions, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const SCREEN = Dimensions.get("window");
const TILE_W = 100;
const TILE_H = 150;
const TOP = 130;
const BOTTOM = 180;
const SIDE = 16;
const SPRING = { damping: 18, stiffness: 200, mass: 0.6 };

const CORNERS = [
  { x: SIDE, y: TOP },
  { x: SCREEN.width - TILE_W - SIDE, y: TOP },
  { x: SIDE, y: SCREEN.height - TILE_H - BOTTOM },
  { x: SCREEN.width - TILE_W - SIDE, y: SCREEN.height - TILE_H - BOTTOM },
];

export const TILE_CORNERS = CORNERS;
export const TILE_SIZE = { width: TILE_W, height: TILE_H };

export const DraggableTile = ({
  ref,
  initialCorner = 1,
  onCornerChange,
  onTap,
  children,
}) => {
  const start = CORNERS[initialCorner];
  const x = useSharedValue(start.x);
  const y = useSharedValue(start.y);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    snapTo: (cornerIdx) => {
      console.log("[DraggableTile] snapTo called:", cornerIdx);
      const target = CORNERS[cornerIdx];
      x.value = withSpring(target.x, SPRING);
      y.value = withSpring(target.y, SPRING);
      onCornerChange?.(cornerIdx);
    },
  }));

  const logPan = (label, ...args) => {
    console.log("[DraggableTile]", label, ...args);
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      runOnJS(logPan)("pan start at", x.value, y.value);
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      x.value = startX.value + e.translationX;
      y.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      let closestIdx = 0;
      let minDist = Infinity;
      for (let i = 0; i < CORNERS.length; i++) {
        const c = CORNERS[i];
        const d = (c.x - x.value) ** 2 + (c.y - y.value) ** 2;
        if (d < minDist) {
          minDist = d;
          closestIdx = i;
        }
      }
      runOnJS(logPan)("pan end, snap to corner", closestIdx);
      x.value = withSpring(CORNERS[closestIdx].x, SPRING);
      y.value = withSpring(CORNERS[closestIdx].y, SPRING);
      if (onCornerChange) runOnJS(onCornerChange)(closestIdx);
    });

  const handleTap = () => {
    console.log("[DraggableTile] tile tapped (outer Pressable)");
    onTap?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        <Pressable onPress={handleTap}>{children}</Pressable>
      </Animated.View>
    </GestureDetector>
  );
};
