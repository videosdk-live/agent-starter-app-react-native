import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  useParticipant,
  RTCView,
  MediaStream,
} from "@videosdk.live/react-native-sdk";
import { COLORS } from "../lib/colors";

export const UserTile = ({
  participantId,
  avatarSize = 64,
  borderRadius = 0,
}) => {
  const { webcamStream, webcamOn, displayName } = useParticipant(
    participantId ?? "",
  );
  const hasVideo = webcamOn && webcamStream?.track;

  return (
    <View style={[styles.root, { borderRadius, overflow: "hidden" }]}>
      {hasVideo ? (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          mirror
          style={[styles.video, { borderRadius }]}
        />
      ) : (
        <View style={styles.fallback}>
          <View
            style={[
              styles.avatar,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
              },
            ]}
          >
            <Text style={[styles.avatarText, { fontSize: avatarSize * 0.38 }]}>
              {displayName?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
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
    backgroundColor: COLORS.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    backgroundColor: COLORS.surfaceAvatar,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
