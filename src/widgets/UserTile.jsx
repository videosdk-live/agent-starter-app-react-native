import React from "react";
import { View, Text, Pressable } from "react-native";
import {
  useParticipant,
  RTCView,
  MediaStream,
} from "@videosdk.live/react-native-sdk";

const VARIANTS = {
  big: {
    sizeClass: "w-[370px] h-[570px] rounded-[24px]",
    avatarClass: "w-16 h-16",
    avatarTextClass: "text-2xl",
  },
  small: {
    sizeClass: "w-[100px] h-[150px] rounded-[12px]",
    avatarClass: "w-10 h-10",
    avatarTextClass: "text-base",
  },
};

export const UserTile = ({ participantId, variant = "big", onPress }) => {
  const { webcamStream, webcamOn, displayName } = useParticipant(participantId);
  const { sizeClass, avatarClass, avatarTextClass } = VARIANTS[variant];
  const hasVideo = webcamOn && webcamStream?.track;

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={`${sizeClass} overflow-hidden bg-neutral-900`}
    >
      {hasVideo ? (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          mirror
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <View
            className={`${avatarClass} rounded-full bg-[#3A3A3C] items-center justify-center`}
          >
            <Text className={`text-white ${avatarTextClass} font-semibold`}>
              {displayName?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
        </View>
      )}
    </Container>
  );
};
