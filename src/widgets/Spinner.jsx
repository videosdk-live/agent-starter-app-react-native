import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { COLORS } from "../lib/colors";

export const Spinner = ({
  size = 24,
  color = COLORS.white,
  count = 8,
  duration = 1000,
  style,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, duration]);

  const inputRange = Array.from({ length: count + 1 }, (_, i) => i / count);
  const baseOutput = Array.from({ length: count }, (_, i) =>
    Math.max(1 - i * (1 / (count - 1)), 0),
  );

  const barWidth = size / 10;
  const barHeight = size / 4;
  const borderRadius = size / 20;

  return (
    <View
      className="items-center justify-center"
      style={[{ width: size, height: size }, style]}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i * 360) / count;
        const output = [...baseOutput];
        for (let j = 0; j < i; j++) output.unshift(output.pop());
        output.unshift(output[output.length - 1]);

        const opacity = progress.interpolate({
          inputRange,
          outputRange: output,
        });

        return (
          <View
            key={i}
            className="absolute items-center"
            style={{
              width: size,
              height: size,
              transform: [{ rotate: `${angle}deg` }],
            }}
          >
            <Animated.View
              style={{
                width: barWidth,
                height: barHeight,
                borderRadius,
                backgroundColor: color,
                opacity,
              }}
            />
          </View>
        );
      })}
    </View>
  );
};
