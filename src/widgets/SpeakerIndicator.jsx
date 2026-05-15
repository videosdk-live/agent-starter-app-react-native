import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";
import { COLORS } from "../lib/colors";

const W = 18;
const H = 16;
const HEIGHT_PROFILE = [0.6, 1.0, 0.6];

const Bar = ({ index, t, isSpeaking }) => {
  const barCount = HEIGHT_PROFILE.length;
  const slot = W / (barCount * 2 - 1);
  const barWidth = slot;
  const phase = (index / barCount) * 2 * Math.PI;

  const heightValue = isSpeaking
    ? t.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [
          H * HEIGHT_PROFILE[index] * 0.5 * (1 + Math.sin(phase)),
          H * HEIGHT_PROFILE[index] * 0.5 * (1 + Math.sin(phase + Math.PI / 2)),
          H * HEIGHT_PROFILE[index] * 0.5 * (1 + Math.sin(phase + Math.PI)),
          H *
            HEIGHT_PROFILE[index] *
            0.5 *
            (1 + Math.sin(phase + (3 * Math.PI) / 2)),
          H * HEIGHT_PROFILE[index] * 0.5 * (1 + Math.sin(phase + 2 * Math.PI)),
        ],
      })
    : H * 0.25 * HEIGHT_PROFILE[index];

  return (
    <Animated.View
      style={{
        width: barWidth,
        height: heightValue,
        backgroundColor: COLORS.white,
        opacity: isSpeaking ? 1 : 0.4,
        borderRadius: barWidth / 2,
        marginRight: index < barCount - 1 ? slot : 0,
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
    <View style={styles.container}>
      {HEIGHT_PROFILE.map((_, i) => (
        <Bar key={i} index={i} t={t} isSpeaking={isSpeaking} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: W,
    height: H,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
