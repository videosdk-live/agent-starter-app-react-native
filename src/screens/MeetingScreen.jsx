import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SwitchCamera, VideoOff, MonitorUp } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useMeeting,
  useAgentParticipant,
  useParticipant,
  useMediaDevice,
  switchAudioDevice,
  createCameraVideoTrack,
} from "@videosdk.live/react-native-sdk";

import { TopVignette, BottomVignette } from "../widgets/Vignette";
import { TopHeader } from "../widgets/TopHeader";
import { MeetingOrb } from "../widgets/MeetingOrb";
import { AgentTile } from "../widgets/AgentTile";
import { UserTile } from "../widgets/UserTile";
import { TranscriptView } from "../widgets/TranscriptView";
import { BottomBar } from "../widgets/BottomBar";
import { SpeakerBottomSheet } from "../widgets/SpeakerBottomSheet";
import { COLORS } from "../lib/colors";

const CamOffPlaceholder = () => (
  <View style={styles.camOff}>
    <VideoOff size={24} color={COLORS.white38} />
  </View>
);

const ScreenShareOverlay = ({ onStop }) => (
  <View style={styles.shareOverlay}>
    <View style={styles.shareIconWrap}>
      <MonitorUp size={36} color={COLORS.white} />
    </View>
    <Text style={styles.shareText}>
      You're sharing your screen with everyone
    </Text>
    <Pressable onPress={onStop} style={styles.stopBtn}>
      <MonitorUp size={16} color={COLORS.white90} />
      <Text style={styles.stopBtnText}>Stop Sharing</Text>
    </Pressable>
  </View>
);

const CamFlipBtn = ({ onPress, top, right, left }) => (
  <Pressable
    onPress={onPress}
    style={[styles.camFlip, { top, right, left }]}
    hitSlop={8}
  >
    <SwitchCamera size={16} color={COLORS.white} />
  </Pressable>
);

export const MeetingScreen = ({ onLeave, onAgentLeft, onCapacityReached }) => {
  const startTimeRef = useRef(new Date());

  const { width: screenW } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const bigW = screenW - 32;
  const bigH = bigW * (570 / 370);
  const bigTop = insets.top + 88;
  const pipW = screenW * 0.3;
  const pipH = pipW * 1.45;

  const [agentParticipantId, setAgentParticipantId] = useState(null);
  const [agentState, setAgentState] = useState("idle");
  const [transcripts, setTranscripts] = useState([]);
  const [speakerSheetOpen, setSpeakerSheetOpen] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const facingModeRef = useRef("front");

  const {
    join,
    leave,
    participants,
    localParticipant,
    changeWebcam,
    disableScreenShare,
    localScreenShareOn,
  } = useMeeting({
    onMeetingJoined: () => {
      setAgentState("connected");
    },
    onMeetingLeft: () => {
      onLeave?.();
    },
    onParticipantJoined: (p) => {
      if (p?.isAgent) setAgentParticipantId(p.id);
    },
    onParticipantLeft: (p) => {
      if (p?.isAgent) onAgentLeft?.();
    },
    onError: (err) => {
      const name = err?.code ?? "Error";
      const message = err?.message ?? "Something went wrong";
      Alert.alert(String(name), String(message));
    },
  });

  const { getAudioDeviceList } = useMediaDevice({
    onAudioDeviceChanged: async () => {
      try {
        const list = (await getAudioDeviceList()) ?? [];
        setSpeakers(list);
      } catch (e) {
        console.warn("onAudioDeviceChanged failed", e);
      }
    },
  });

  const { webcamOn: agentWebcamOn } = useParticipant(agentParticipantId ?? "");
  const { webcamOn: localWebcamOn } = useParticipant(
    localParticipant?.id ?? "",
  );

  const joined = useRef(false);
  useEffect(() => {
    if (joined.current) return;
    joined.current = true;
    const t = setTimeout(() => join(), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (agentParticipantId) return;
    for (const p of participants.values()) {
      if (p.isAgent) {
        setAgentParticipantId(p.id);
        break;
      }
    }
  }, [participants, agentParticipantId]);

  useEffect(() => {
    if (!localParticipant?.id) return;
    if (participants.size > 2) {
      leave();
      onCapacityReached?.();
    }
  }, [participants.size, localParticipant?.id]);

  useAgentParticipant(agentParticipantId, {
    onAgentStateChanged: (data) => setAgentState(data?.state ?? data),
    onAgentTranscriptionReceived: (data) => {
      const text = data?.segment?.text;
      if (!text) return;
      setTranscripts((prev) => {
        const next = [
          ...prev,
          {
            id:
              data?.segment?.timestamp ??
              `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            senderName: data?.participant?.displayName ?? "Agent",
            text,
          },
        ];
        return next.slice(-20);
      });
    },
  });

  const refreshSpeakers = useCallback(async () => {
    try {
      const list = (await getAudioDeviceList()) ?? [];
      setSpeakers(list);
      if (!selectedSpeaker && list[0]) setSelectedSpeaker(list[0].label);
    } catch (e) {
      console.warn("getAudioDeviceList failed", e);
    }
  }, [getAudioDeviceList, selectedSpeaker]);

  const handleSpeakerPress = async () => {
    await refreshSpeakers();
    setSpeakerSheetOpen(true);
  };

  const handleSelectSpeaker = (label) => {
    setSelectedSpeaker(label);
    try {
      switchAudioDevice(label);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleEndCall = () => {
    try {
      leave();
    } catch (e) {}
    onLeave?.();
  };

  const handleSwitchCamera = useCallback(async () => {
    try {
      const next = facingModeRef.current === "front" ? "environment" : "front";
      facingModeRef.current = next;
      const track = await createCameraVideoTrack({ facingMode: next });
      changeWebcam(track);
    } catch (e) {
      console.warn("switch camera failed", e);
    }
  }, [changeWebcam]);

  const isScreenSharing = !!localScreenShareOn;
  const bothCamsOff = !agentWebcamOn && !localWebcamOn;
  const showVideoUI =
    !!localParticipant?.id && (!bothCamsOff || isScreenSharing);
  const effectivelySwapped = isSwapped && !!localWebcamOn;
  const canSwap = !isScreenSharing && (isSwapped || !!localWebcamOn);

  const swapTiles = useCallback(() => {
    if (canSwap) setIsSwapped((v) => !v);
  }, [canSwap]);

  const shouldShowPip = isScreenSharing
    ? !!agentWebcamOn || !!localWebcamOn
    : !!localWebcamOn;

  const pipShowCamFlip =
    !effectivelySwapped &&
    !!localWebcamOn &&
    (!isScreenSharing || !agentWebcamOn);
  const bigShowCamFlip =
    effectivelySwapped && !!localWebcamOn && !isScreenSharing;

  const pipDuringShare = agentWebcamOn ? (
    <AgentTile
      participantId={agentParticipantId}
      agentState={agentState}
      orbSize={50}
      borderRadius={13}
    />
  ) : localWebcamOn ? (
    <UserTile
      participantId={localParticipant?.id}
      avatarSize={32}
      borderRadius={13}
    />
  ) : (
    <CamOffPlaceholder />
  );

  const bigFeed = isScreenSharing ? (
    <ScreenShareOverlay onStop={() => disableScreenShare()} />
  ) : effectivelySwapped ? (
    <UserTile participantId={localParticipant?.id} borderRadius={16} />
  ) : (
    <AgentTile
      participantId={agentParticipantId}
      agentState={agentState}
      orbSize={220}
      borderRadius={16}
    />
  );

  const pipContent = isScreenSharing ? (
    pipDuringShare
  ) : effectivelySwapped ? (
    <AgentTile
      participantId={agentParticipantId}
      agentState={agentState}
      orbSize={50}
      borderRadius={13}
    />
  ) : (
    <UserTile
      participantId={localParticipant?.id}
      avatarSize={32}
      borderRadius={13}
    />
  );

  return (
    <View style={styles.root}>
      {!showVideoUI && <TopVignette height={200} />}
      <BottomVignette
        height={showVideoUI ? 280 : 260}
        opacity={showVideoUI ? 0.85 : 0.7}
      />

      {showVideoUI && (
        <View
          style={[
            styles.bigTile,
            { top: bigTop, width: bigW, height: bigH, left: 16 },
          ]}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={canSwap ? swapTiles : undefined}
          >
            {bigFeed}
          </Pressable>

          {shouldShowPip && (
            <View
              style={[
                styles.pip,
                {
                  width: pipW,
                  height: pipH,
                  top: 10,
                  ...(effectivelySwapped ? { left: 10 } : { right: 10 }),
                },
              ]}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={canSwap ? swapTiles : undefined}
              >
                {pipContent}
              </Pressable>

              {pipShowCamFlip && (
                <CamFlipBtn onPress={handleSwitchCamera} top={6} right={6} />
              )}
            </View>
          )}

          {bigShowCamFlip && (
            <CamFlipBtn onPress={handleSwitchCamera} top={10} right={10} />
          )}
        </View>
      )}

      {!showVideoUI && (
        <View style={styles.orbCenter}>
          <MeetingOrb agentState={agentState} />
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.flex,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <TopHeader
            variant="meeting"
            agentState={agentState}
            onSpeakerPress={handleSpeakerPress}
          />

          <View style={styles.flex} />

          <View>
            {transcripts.length > 0 && (
              <View style={styles.transcriptWrap}>
                <TranscriptView messages={transcripts} />
              </View>
            )}
            <BottomBar
              startTime={startTimeRef.current}
              onEndCall={handleEndCall}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <SpeakerBottomSheet
        isOpen={speakerSheetOpen}
        onClose={() => setSpeakerSheetOpen(false)}
        devices={speakers}
        selectedDeviceId={selectedSpeaker}
        onSelect={handleSelectSpeaker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  flex: {
    flex: 1,
  },
  bigTile: {
    position: "absolute",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  pip: {
    position: "absolute",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.white25,
    shadowColor: COLORS.black,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  camFlip: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.black55,
    alignItems: "center",
    justifyContent: "center",
  },
  orbCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  camOff: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  shareOverlay: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  shareIconWrap: {
    padding: 16,
    borderRadius: 999,
    backgroundColor: COLORS.white08,
    marginBottom: 16,
  },
  shareText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 12,
  },
  stopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white10,
    borderWidth: 1,
    borderColor: COLORS.white20,
  },
  stopBtnText: {
    color: COLORS.white90,
    fontSize: 13,
    fontWeight: "500",
  },
  transcriptWrap: {
    marginBottom: 8,
  },
});
