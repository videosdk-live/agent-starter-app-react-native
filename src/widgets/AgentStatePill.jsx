import React from "react";
import { View, Text } from "react-native";
import { STATUS_CONFIGS } from "../lib/statusConfigs";

const Pill = ({ config }) => (
  <View
    className="h-5 px-1.5 py-0.5 rounded-[12px] border items-center justify-center"
    style={{
      width: config.w,
      backgroundColor: config.bg,
      borderColor: config.border,
    }}
  >
    <View className="absolute inset-y-0 left-1.5 justify-center">
      <View
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.dot }}
      />
    </View>
    <Text
      className="text-xs font-normal font-sans leading-4"
      style={{ color: config.color }}
    >
      {config.text}
    </Text>
  </View>
);

export const AgentStatePill = ({ state }) => {
  const key = String(state || "").toLowerCase();
  return <Pill config={STATUS_CONFIGS[key] ?? STATUS_CONFIGS.idle} />;
};
