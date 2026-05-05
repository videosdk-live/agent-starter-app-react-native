import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

const HEIGHTS = [0.4, 0.72, 1.0, 0.72, 0.4];

const Bar = ({ index, t, color, barWidth, barSpacing, size }) => {
  const phase = (index / HEIGHTS.length) * 2 * Math.PI;
  const animatedHeight = t.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const heightValue = animatedHeight.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      size * HEIGHTS[index] * 0.5 * (1 + Math.sin(phase)),
      size * HEIGHTS[index] * 0.5 * (1 + Math.sin(phase + Math.PI / 2)),
      size * HEIGHTS[index] * 0.5 * (1 + Math.sin(phase + Math.PI)),
      size * HEIGHTS[index] * 0.5 * (1 + Math.sin(phase + (3 * Math.PI) / 2)),
      size * HEIGHTS[index] * 0.5 * (1 + Math.sin(phase + 2 * Math.PI)),
    ],
  });

  return (
    <Animated.View
      style={{
        width: barWidth,
        height: heightValue,
        backgroundColor: color,
        borderRadius: barWidth / 2,
        marginRight: index < HEIGHTS.length - 1 ? barSpacing : 0,
      }}
    />
  );
};

export const WaveformIcon = ({ color = "#37265E", size = 20 }) => {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  const slot = size / (HEIGHTS.length * 2 - 1);
  const barWidth = slot;
  const barSpacing = slot;

  return (
    <View
      className="flex-row items-center justify-center"
      style={{ width: size, height: size }}
    >
      {HEIGHTS.map((_, i) => (
        <Bar
          key={i}
          index={i}
          t={t}
          color={color}
          barWidth={barWidth}
          barSpacing={barSpacing}
          size={size}
        />
      ))}
    </View>
  );
};
