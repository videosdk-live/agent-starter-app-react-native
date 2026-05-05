import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TopVignette, BottomVignette } from "../widgets/Vignette";
import { TopHeader } from "../widgets/TopHeader";
import { HolographicOrb } from "../widgets/HolographicOrb";
import { TalkButton } from "../widgets/TalkButton";

export const JoinScreen = ({ isConnecting, isDisconnected, onTalkPress }) => {
  return (
    <View className="flex-1 bg-fl-bg">
      <TopVignette height={200} />
      <BottomVignette height={280} opacity={0.85} />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <TopHeader
          variant="join"
          isConnecting={isConnecting}
          isDisconnected={isDisconnected}
        />

        <View className="flex-1 items-center justify-center px-4">
          <HolographicOrb isConnecting={isConnecting} />
        </View>

        <View
          className="px-4 pb-4"
          style={{ opacity: isConnecting ? 0 : 1 }}
          pointerEvents={isConnecting ? "none" : "auto"}
        >
          <TalkButton onPress={onTalkPress} disabled={isConnecting} />
        </View>
      </SafeAreaView>
    </View>
  );
};
