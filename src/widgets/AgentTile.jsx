import React from "react";
import { View, Pressable } from "react-native";
import {
  useParticipant,
  RTCView,
  MediaStream,
} from "@videosdk.live/react-native-sdk";
import { MeetingOrb } from "./MeetingOrb";

const VARIANTS = {
  big: { sizeClass: "w-[370px] h-[570px] rounded-[24px]", orbSize: 220 },
  small: { sizeClass: "w-[100px] h-[150px] rounded-[12px]", orbSize: 70 },
};

export const AgentTile = ({
  participantId,
  agentState,
  variant = "big",
  onPress,
}) => {
  const { webcamStream, webcamOn } = useParticipant(participantId);
  const { sizeClass, orbSize } = VARIANTS[variant];
  const hasVideo = webcamOn && webcamStream?.track;

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      className={`${sizeClass} overflow-hidden bg-fl-bg`}
    >
      {hasVideo ? (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <MeetingOrb agentState={agentState} size={orbSize} />
        </View>
      )}
    </Container>
  );
};
