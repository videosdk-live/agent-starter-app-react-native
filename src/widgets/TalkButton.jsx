import React, { useRef } from "react";
import { Pressable, Animated, Text, View, StyleSheet } from "react-native";
import { WaveformIcon } from "./WaveformIcon";
import { COLORS } from "../lib/colors";

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
      style={styles.pressable}
    >
      <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
        <View style={styles.icon}>
          <WaveformIcon color={COLORS.brandPurple} size={20} />
        </View>
        <View style={{ width: 2 }} />
        <Text style={styles.label}>Talk to agent</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignSelf: "center",
  },
  button: {
    width: 354,
    height: 40,
    maxWidth: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.white,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 24,
    elevation: 6,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    color: COLORS.brandPurple,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
});
