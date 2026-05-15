import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Volume2 } from "lucide-react-native";
import { AgentStatePill } from "./AgentStatePill";
import { COLORS } from "../lib/colors";

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

  const subtitleColor = variant === "join" ? COLORS.white38 : COLORS.white55;

  return (
    <View style={styles.wrapper}>
      <View style={styles.center}>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          Powered by VideoSDK
        </Text>
        <View style={styles.pillSlot}>
          {pillState && <AgentStatePill state={pillState} />}
        </View>
      </View>

      {variant === "meeting" && (
        <Pressable
          onPress={onSpeakerPress}
          hitSlop={6}
          style={styles.speakerBtn}
        >
          <Volume2 size={20} color={COLORS.white} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    position: "relative",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    minHeight: 62,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  pillSlot: {
    marginTop: 6,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  speakerBtn: {
    position: "absolute",
    right: 16,
    top: 8,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white10,
    alignItems: "center",
    justifyContent: "center",
  },
});
