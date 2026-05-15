import React, { useRef, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { COLORS } from "../lib/colors";

export const TranscriptView = ({ messages = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  if (messages.length === 0) return null;

  const visible = messages.length > 10 ? messages.slice(-10) : messages;

  return (
    <View className="max-h-[200px] px-4">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerClassName="py-1"
      >
        {visible.map((msg) => {
          const initial =
            msg.senderName && msg.senderName.length > 0
              ? msg.senderName[0].toUpperCase()
              : "?";
          return (
            <View key={msg.id} className="flex-row items-start mb-2.5">
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: COLORS.surfaceAvatar }}
              >
                <Text className="text-white text-xs font-semibold">
                  {initial}
                </Text>
              </View>

              <View className="w-2.5" />

              <View className="flex-1">
                <Text className="text-header-text text-xs font-medium">
                  {msg.senderName}
                </Text>
                <View className="h-0.5" />
                <Text className="text-white text-sm font-normal leading-5">
                  {msg.text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
