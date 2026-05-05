import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import FastImage from "react-native-fast-image";
import sampleGif from "../assets/sample_gif.gif";

export const HolographicOrb = ({ isConnecting = false }) => {
  return (
    <View className="w-[260px] h-[260px] items-center justify-center">
      <FastImage
        source={sampleGif}
        style={{ width: 260, height: 260 }}
        resizeMode={FastImage.resizeMode.contain}
      />

      {isConnecting && (
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-[130px] overflow-hidden bg-black/45 items-center justify-center"
        >
          <CircularSpinner />
        </View>
      )}
    </View>
  );
};

const CircularSpinner = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      className="w-8 h-8 rounded-full"
      style={{
        borderWidth: 2.5,
        borderColor: "rgba(255,255,255,0.25)",
        borderTopColor: "#FFFFFF",
        transform: [{ rotate: spin }],
      }}
    />
  );
};
