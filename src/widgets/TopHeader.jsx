import React from "react";
import { View, Text, Pressable } from "react-native";
import { Volume2 } from "lucide-react-native";
import { AgentStatePill } from "./AgentStatePill";

export const TopHeader = ({
  variant = "meeting",
  isConnecting = false,
  isDisconnected = false,
  agentState,
  onSpeakerPress,
}) => {
  let pillState = null;
  if (isDisconnected) pillState = "disconnected";
  else if (isConnecting) pillState = "connecting";
  else if (variant === "meeting") pillState = agentState;

  return (
    <View className="px-4 pt-2">
      <View className="items-center justify-center min-h-[62px] relative">
        <Text className="w-[251px] h-4 text-xs font-normal font-sans leading-4 text-center text-neutral-700">
          Powered by VideoSDK
        </Text>

        <View className="mt-1.5 h-8 items-center justify-center">
          {pillState && <AgentStatePill state={pillState} />}
        </View>

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
