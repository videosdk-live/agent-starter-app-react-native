import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STATUS_CONFIGS } from "../lib/statusConfigs";

export const AgentStatePill = ({ state }) => {
  const key = String(state || "").toLowerCase();
  const cfg = STATUS_CONFIGS[key] ?? STATUS_CONFIGS.idle;

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
