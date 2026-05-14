import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { SpeakerIndicator } from "./SpeakerIndicator";
import { buttonShadow } from "../lib/shadows";

export const BarButton = ({
  Icon,
  onPress,
  isOff = false,
  isActive = false,
  showChevron = false,
  onChevronPress,
  isMenuOpen = false,
  showSpeakerIndicator = false,
  isSpeaking = false,
  showPermissionWarning = false,
}) => {
  const iconColor = isOff ? "#EF4444" : "#FFFFFF";
  const widthClass = showChevron
    ? "w-14"
    : showSpeakerIndicator
    ? "w-[50px]"
    : "w-8";

  const bgClass = isActive ? "bg-primary-800" : "bg-neutral-900";
  const borderClass = isActive ? "border-primary-200" : "border-neutral-800";

  const ChevronIcon = isMenuOpen ? ChevronUp : ChevronDown;

  return (
    <View className={`h-8 ${widthClass}`}>
      <View
        className={`h-8 rounded-[8px] border-[0.5px] ${borderClass} ${bgClass} flex-row items-center ${widthClass}`}
        style={buttonShadow}
      >
        <Pressable
          onPress={onPress}
          className={`flex-1 h-8 flex-row items-center justify-center active:opacity-70 gap-1 ${
            showSpeakerIndicator ? "pl-1 pr-2 py-1" : ""
          }`}
        >
          <View className="w-6 h-6 rounded-[4px] p-1 items-center justify-center">
            <Icon size={16} color={iconColor} strokeWidth={2} />
          </View>

          {showSpeakerIndicator && <SpeakerIndicator isSpeaking={isSpeaking} />}
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
