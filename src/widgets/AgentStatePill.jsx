import React from "react";
import { View, Text } from "react-native";

const PILL_CONFIG = {
  speaking: {
    label: "Speaking",
    dotClass: "bg-pill-speaking-dot",
    borderClass: "border-pill-speaking-border",
    bgClass: "bg-pill-speaking-bg",
    textClass: "text-pill-speaking-text",
  },
  thinking: {
    label: "Thinking",
    dotClass: "bg-pill-thinking-dot",
    borderClass: "border-pill-thinking-border",
    bgClass: "bg-pill-thinking-bg",
    textClass: "text-pill-thinking-text",
  },
  listening: {
    label: "Listening",
    dotClass: "bg-pill-listening-dot",
    borderClass: "border-pill-listening-border",
    bgClass: "bg-pill-listening-bg",
    textClass: "text-pill-listening-text",
  },
  idle: {
    label: "Idle",
    dotClass: "bg-pill-idle-dot",
    borderClass: "border-pill-idle-border",
    bgClass: "bg-pill-idle-bg",
    textClass: "text-pill-idle-text",
  },
};

export const parseAgentState = (raw) => {
  const s = String(raw || "").toLowerCase();
  if (s.includes("listen")) return "listening";
  if (s.includes("speak")) return "speaking";
  if (s.includes("think") || s.includes("process")) return "thinking";
  return "idle";
};

const Pill = ({ label, dotClass, borderClass, bgClass, textClass }) => (
  <View
    className={`flex-row items-center px-3 py-1.5 rounded-fl-pill border ${borderClass} ${bgClass}`}
  >
    <View className={`w-[7px] h-[7px] rounded-full ${dotClass}`} />
    <View className="w-1.5" />
    <Text
      className={`text-[13px] font-medium ${textClass}`}
      style={{ letterSpacing: 0.2 }}
    >
      {label}
    </Text>
  </View>
);

export const AgentStatePill = ({ state }) => {
  const key = parseAgentState(state);
  return <Pill {...PILL_CONFIG[key]} />;
};

export const ConnectingPill = () => (
  <Pill
    label="Connecting..."
    dotClass="bg-pill-connecting-dot"
    borderClass="border-pill-connecting-border"
    bgClass="bg-pill-connecting-bg"
    textClass="text-pill-connecting-text"
  />
);

export const DisconnectedPill = () => (
  <Pill
    label="Disconnected"
    dotClass="bg-pill-disconnected-dot"
    borderClass="border-pill-disconnected-border"
    bgClass="bg-pill-disconnected-bg"
    textClass="text-pill-disconnected-text"
  />
);
