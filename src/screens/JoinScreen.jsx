import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TopVignette, BottomVignette } from "../widgets/Vignette";
import { TopHeader } from "../widgets/TopHeader";
import { HolographicOrb } from "../widgets/HolographicOrb";
import { TalkButton } from "../widgets/TalkButton";
import { COLORS } from "../lib/colors";

export const JoinScreen = ({ isConnecting, isDisconnected, onTalkPress }) => {
  const { height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const contentTop = insets.top + 88;
  const bottomReserved = 72 + insets.bottom;
  const orbAreaHeight = screenH - contentTop - bottomReserved;

  return (
    <View style={styles.root}>
      <TopVignette height={200} />
      <BottomVignette height={280} opacity={0.85} />

      <View style={[styles.header, { top: insets.top + 8 }]}>
        <TopHeader
          variant="join"
          isConnecting={isConnecting}
          isDisconnected={isDisconnected}
        />
      </View>

      <View
        style={[
          styles.orbRegion,
          { top: contentTop, height: orbAreaHeight, left: 16, right: 16 },
        ]}
      >
        <HolographicOrb isConnecting={isConnecting} />
      </View>

      <View
        style={[
          styles.talkBtn,
          {
            bottom: insets.bottom + 16,
            left: 16,
            right: 16,
            opacity: isConnecting ? 0 : 1,
          },
        ]}
        pointerEvents={isConnecting ? "none" : "auto"}
      >
        <TalkButton onPress={onTalkPress} disabled={isConnecting} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  orbRegion: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  talkBtn: {
    position: "absolute",
    alignItems: "center",
  },
});
