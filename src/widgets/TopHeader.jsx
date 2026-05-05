import React from "react";
import { View, Text, Pressable } from "react-native";
import { Volume2 } from "lucide-react-native";
import {
  AgentStatePill,
  ConnectingPill,
  DisconnectedPill,
} from "./AgentStatePill";

export const TopHeader = ({
  variant = "meeting",
  isConnecting = false,
  isDisconnected = false,
  agentState,
  onSpeakerPress,
  poweredTextOpacity,
}) => {
  const opacity = poweredTextOpacity ?? (variant === "join" ? 0.38 : 0.55);

  let pill = null;
  if (isDisconnected) pill = <DisconnectedPill />;
  else if (isConnecting) pill = <ConnectingPill />;
  else if (variant === "meeting") pill = <AgentStatePill state={agentState} />;

  return (
    <View className="px-4 pt-2">
      <View className="items-center justify-center min-h-[62px] relative">
        <Text
          className="text-[13px] font-normal"
          style={{
            color: `rgba(255,255,255,${opacity})`,
            letterSpacing: 0.2,
          }}
        >
          Powered by VideoSDK
        </Text>

        <View className="mt-1.5 h-8 items-center justify-center">{pill}</View>

        {variant === "meeting" && (
          <Pressable
            onPress={onSpeakerPress}
            hitSlop={6}
            className="absolute right-0 top-0 w-10 h-10 rounded-fl-square bg-white/10 items-center justify-center active:opacity-70"
          >
            <Volume2 size={20} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        )}
      </View>
    </View>
  );
};
