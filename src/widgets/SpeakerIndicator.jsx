import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

const HEIGHT_PROFILE = [0.6, 1.0, 0.6];
const WIDTH = 10;
const HEIGHT = 10;

const Bar = ({ index, t, isSpeaking }) => {
  const phase = (index / HEIGHT_PROFILE.length) * 2 * Math.PI;

  const heightValue = isSpeaking
    ? t.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
          HEIGHT * HEIGHT_PROFILE[index] * 0.5 * (1 + Math.sin(phase)),
          HEIGHT *
            HEIGHT_PROFILE[index] *
            0.5 *
            (1 + Math.sin(phase + Math.PI / 2)),
          HEIGHT *
            HEIGHT_PROFILE[index] *
            0.5 *
            (1 + Math.sin(phase + Math.PI)),
          HEIGHT *
            HEIGHT_PROFILE[index] *
            0.5 *
            (1 + Math.sin(phase + (3 * Math.PI) / 2)),
          HEIGHT *
            HEIGHT_PROFILE[index] *
            0.5 *
            (1 + Math.sin(phase + 2 * Math.PI)),
        ],
      })
    : HEIGHT * 0.25 * HEIGHT_PROFILE[index];

  const barCount = HEIGHT_PROFILE.length;
  const barSpacing = WIDTH / (barCount * 2 - 1);
  const barWidth = barSpacing;

  return (
    <Animated.View
      className="bg-white"
      style={{
        width: barWidth,
        height: heightValue,
        opacity: isSpeaking ? 1 : 0.4,
        borderRadius: barWidth / 2,
        marginRight: index < barCount - 1 ? barSpacing : 0,
      }}
    />
  );
};

export const SpeakerIndicator = ({ isSpeaking = false }) => {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isSpeaking) {
      t.stopAnimation();
      return;
    }
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
  }, [isSpeaking, t]);

  return (
    <View className="flex-row items-center justify-center w-[10px] h-[10px]">
      {HEIGHT_PROFILE.map((_, i) => (
        <Bar key={i} index={i} t={t} isSpeaking={isSpeaking} />
      ))}
    </View>
  );
};
