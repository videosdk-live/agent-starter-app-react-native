import React, { useRef } from "react";
import { Pressable, Animated, Text, View } from "react-native";
import { WaveformIcon } from "./WaveformIcon";

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
        className="w-[354px] h-10 max-w-full bg-white rounded-full flex-row items-center justify-center"
        style={{
          transform: [{ scale }],
          shadowColor: "#FFFFFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 6,
        }}
      >
        <View className="w-5 h-5">
          <WaveformIcon color="#37265E" size={20} />
        </View>
        <View className="w-0.5" />
        <View className="w-[100px] h-6 items-center justify-center">
          <Text
            className="text-black text-sm font-medium leading-6"
            style={{ letterSpacing: 0.1 }}
          >
            Talk to agent
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};
