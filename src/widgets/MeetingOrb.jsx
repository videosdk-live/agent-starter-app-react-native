import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import FastImage from "react-native-fast-image";
import sampleGif from "../assets/sample_gif.gif";

const GLOW_COLOR = {
  speaking: "rgba(14,165,233,0.45)",
  thinking: "rgba(124,58,237,0.45)",
  listening: "rgba(156,163,175,0.35)",
};

export const MeetingOrb = ({ agentState, size = 280 }) => {
  const key = String(agentState || "").toLowerCase();
  const color = GLOW_COLOR[key];
  const glow = useRef(new Animated.Value(0.25)).current;
  const innerSize = Math.round(size * (260 / 280));

  useEffect(() => {
    glow.stopAnimation();
    if (!color) {
      Animated.timing(glow, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.45,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0.25,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [color, glow]);

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: glow,
        }}
      />
      <FastImage
        source={sampleGif}
        style={{ width: innerSize, height: innerSize }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};
