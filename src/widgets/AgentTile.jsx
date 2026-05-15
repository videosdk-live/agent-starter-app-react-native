import React from "react";
import { View, StyleSheet } from "react-native";
import {
  useParticipant,
  RTCView,
  MediaStream,
} from "@videosdk.live/react-native-sdk";
import { MeetingOrb } from "./MeetingOrb";
import { COLORS } from "../lib/colors";

export const AgentTile = ({
  participantId,
  agentState,
  orbSize = 220,
  borderRadius = 0,
}) => {
  const { webcamStream, webcamOn } = useParticipant(participantId ?? "");
  const hasVideo = webcamOn && webcamStream?.track;

  return (
    <View style={[styles.root, { borderRadius, overflow: "hidden" }]}>
      {hasVideo ? (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          style={[styles.video, { borderRadius }]}
        />
      ) : (
        <View style={styles.fallback}>
          <MeetingOrb agentState={agentState} size={orbSize} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
});
