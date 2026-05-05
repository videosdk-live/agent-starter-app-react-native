import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import FastImage from "react-native-fast-image";
import sampleGif from "../assets/sample_gif.gif";
import { parseAgentState } from "./AgentStatePill";

const GLOW_COLOR = {
  speaking: "rgba(14,165,233,0.45)",
  thinking: "rgba(124,58,237,0.45)",
  listening: "rgba(156,163,175,0.35)",
  idle: "rgba(225,226,234,0.0)",
};

export const MeetingOrb = ({ agentState }) => {
  const key = parseAgentState(agentState);
  const glow = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    glow.stopAnimation();
    if (key === "idle") {
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
  }, [key, glow]);

  return (
    <View className="w-[280px] h-[280px] items-center justify-center">
      <Animated.View
        pointerEvents="none"
        className="absolute w-[280px] h-[280px] rounded-[140px]"
        style={{
          backgroundColor: GLOW_COLOR[key],
          opacity: glow,
        }}
      />
      <FastImage
        source={sampleGif}
        style={{ width: 260, height: 260 }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};
