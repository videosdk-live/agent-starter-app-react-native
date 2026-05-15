import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { SpeakerIndicator } from "./SpeakerIndicator";
import { COLORS } from "../lib/colors";

export const BarButton = ({
  Icon,
  onPress,
  isOff = false,
  showChevron = false,
  onChevronPress,
  isMenuOpen = false,
  showSpeakerIndicator = false,
  isSpeaking = false,
  showPermissionWarning = false,
}) => {
  const iconColor = isOff ? COLORS.destructive : COLORS.white;
  const bgColor = isOff ? COLORS.white08 : COLORS.white07;

  const width = showChevron ? 56 : showSpeakerIndicator ? 64 : 32;
  const ChevronIcon = isMenuOpen ? ChevronUp : ChevronDown;

  return (
    <View style={{ width, height: 32, position: "relative" }}>
      <View style={[styles.container, { width, backgroundColor: bgColor }]}>
        <Pressable onPress={onPress} style={styles.iconZone}>
          <Icon size={18} color={iconColor} strokeWidth={2} />
          {showSpeakerIndicator && (
            <>
              <View style={{ width: 6 }} />
              <SpeakerIndicator isSpeaking={isSpeaking} />
            </>
          )}
        </Pressable>

        {showChevron && (
          <Pressable onPress={onChevronPress} style={styles.chevronZone}>
            <ChevronIcon size={14} color={COLORS.white55} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {showPermissionWarning && (
        <View pointerEvents="none" style={styles.badge}>
          <Text style={styles.badgeText}>!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  iconZone: {
    flex: 1,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronZone: {
    width: 20,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.warningYellow,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.black,
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 9,
  },
});
