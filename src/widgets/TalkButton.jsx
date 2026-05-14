import React, { useRef } from "react";
import { Pressable, Animated, Text, View } from "react-native";
import { WaveformIcon } from "./WaveformIcon";
import { buttonShadow } from "../lib/shadows";

export const TalkButton = ({ onPress, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();

  const onPressOut = () =>
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className="self-center"
    >
      <Animated.View
        className="w-[354px] h-10 max-w-full bg-white rounded-[24px] flex-row items-center justify-center px-4 py-2 gap-1"
        style={[buttonShadow, { transform: [{ scale }] }]}
      >
        <View className="w-5 h-5">
          <WaveformIcon color="#37265E" size={20} />
        </View>
        <View className="h-6 items-center justify-center">
          <Text className="text-primary-800 text-base font-medium font-sans leading-6">
            Talk to agent
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};
