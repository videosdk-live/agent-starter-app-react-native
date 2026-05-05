import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { SpeakerIndicator } from "./SpeakerIndicator";

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
  const iconColor = isOff ? "#EF4444" : "#FFFFFF";
  const width = showChevron ? 56 : showSpeakerIndicator ? 64 : 32;
  const height = 32;

  const ChevronIcon = isMenuOpen ? ChevronUp : ChevronDown;

  return (
    <View style={{ width, height }}>
      <View
        className={`h-8 rounded-fl-button flex-row items-center ${
          isOff ? "bg-btn-bg-off" : "bg-btn-bg"
        }`}
        style={{ width }}
      >
        <Pressable
          onPress={onPress}
          className="flex-1 h-8 flex-row items-center justify-center active:opacity-70"
          style={{ paddingLeft: showSpeakerIndicator ? 10 : 0 }}
        >
          <Icon size={18} color={iconColor} strokeWidth={2} />

          {showSpeakerIndicator && (
            <>
              <View className="w-1.5" />
              <SpeakerIndicator isSpeaking={isSpeaking} />
              <View className="w-1.5" />
            </>
          )}
        </Pressable>

        {showChevron && (
          <Pressable
            onPress={onChevronPress}
            className="w-5 h-8 items-center justify-center active:opacity-70"
          >
            <ChevronIcon
              size={14}
              color="rgba(255,255,255,0.55)"
              strokeWidth={2}
            />
          </Pressable>
        )}
      </View>

      {showPermissionWarning && (
        <View
          pointerEvents="none"
          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-warn-yellow rounded-full items-center justify-center"
        >
          <Text className="text-black text-[9px] font-extrabold leading-[9px]">
            !
          </Text>
        </View>
      )}
    </View>
  );
};
