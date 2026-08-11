import React, { useState } from "react";
import { View, Pressable, TextInput } from "react-native";
import Animated, { FadeIn, Easing } from "react-native-reanimated";
import { usePubSub } from "@videosdk.live/react-native-sdk";
import { SendHorizontal } from "lucide-react-native";
import { buttonShadow } from "../lib/shadows";
import { COLORS } from "../lib/colors";

export const ChatInput = ({ onSent }) => {
  const { publish } = usePubSub("CHAT");
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  const send = async () => {
    const message = text.trim();
    if (!message) return;
    try {
      await publish(message);
      setText("");
      onSent?.();
    } catch (e) {
      console.warn("chat publish failed", e);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(180).easing(Easing.out(Easing.cubic))}
    >
      <View className="h-16 px-4 flex-row items-center justify-between">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type something..."
          placeholderTextColor={COLORS.inputPlaceholder}
          className="flex-1 text-white text-sm font-normal font-sans leading-5 mr-3"
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <Pressable
          onPress={send}
          disabled={!canSend}
          style={[buttonShadow, { opacity: canSend ? 1 : 0.5 }]}
          className="w-8 h-8 rounded-[6px] p-1.5 bg-neutral-800 items-center justify-center active:opacity-70"
        >
          <SendHorizontal size={20} color={COLORS.white} strokeWidth={2} />
        </Pressable>
      </View>
      <View className="self-center w-[338px] h-px bg-white/10" />
    </Animated.View>
  );
};
