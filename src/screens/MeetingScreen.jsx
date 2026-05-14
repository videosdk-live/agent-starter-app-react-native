import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SwitchCamera } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useMeeting,
  useAgentParticipant,
  useMediaDevice,
  switchAudioDevice,
  createCameraVideoTrack,
} from "@videosdk.live/react-native-sdk";
import InCallManager from "@videosdk.live/react-native-incallmanager";

import { TopVignette, BottomVignette } from "../widgets/Vignette";
import { TopHeader } from "../widgets/TopHeader";
import { MeetingOrb } from "../widgets/MeetingOrb";
import { AgentTile } from "../widgets/AgentTile";
import { UserTile } from "../widgets/UserTile";
import { DraggableTile, TILE_CORNERS } from "../widgets/DraggableTile";
import { TranscriptView } from "../widgets/TranscriptView";
import { BottomBar } from "../widgets/BottomBar";
import { SpeakerBottomSheet } from "../widgets/SpeakerBottomSheet";

export const MeetingScreen = ({ onLeave, onAgentLeft, onCapacityReached }) => {
  const startTimeRef = useRef(new Date());

  const [agentParticipantId, setAgentParticipantId] = useState(null);
  const [agentState, setAgentState] = useState("idle");
  const [transcripts, setTranscripts] = useState([]);
  const [speakerSheetOpen, setSpeakerSheetOpen] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [bigIsAgent, setBigIsAgent] = useState(false);
  const [smallCorner, setSmallCorner] = useState(1);
  const facingModeRef = useRef("front");

  const { join, leave, participants, localParticipant, changeWebcam } =
    useMeeting({
      onMeetingJoined: () => {
        setAgentState("connected");
        try {
          InCallManager.start({ media: "audio" });
          InCallManager.setForceSpeakerphoneOn(true);
        } catch (e) {}
      },
      onMeetingLeft: () => {
        try {
          InCallManager.stop();
        } catch (e) {}
        onLeave?.();
      },
      onParticipantJoined: (p) => {
        if (p?.isAgent) setAgentParticipantId(p.id);
      },
      onParticipantLeft: (p) => {
        if (p?.isAgent) onAgentLeft?.();
      },
    });

  const { getAudioDeviceList } = useMediaDevice();

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
    const id = setTimeout(() => {
      if (participants.size > 2) {
        leave();
        onCapacityReached?.();
      }
    }, 2500);
    return () => clearTimeout(id);
  }, [localParticipant?.id]);

  useAgentParticipant(agentParticipantId, {
    onAgentStateChanged: (state) => {
      console.log("[MeetingScreen] agent state changed:", state);
      setAgentState(state);
    },
    onAgentTranscriptionReceived: (data) => {
      const text = data?.segment?.text;
      if (!text) return;
      setTranscripts((prev) => {
        const next = [
          ...prev,
          {
            id:
              data?.segment?.timestamp ||
              `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            senderName: data?.participant?.displayName || "Agent",
            text,
          },
        ];
        return next.slice(-10);
      });
    },
  });

  const refreshSpeakers = useCallback(async () => {
    try {
      const list = (await getAudioDeviceList()) || [];
      const devices = list.map((d) => ({
        deviceId: d.deviceId,
      }));
      setSpeakers(devices);
      if (!selectedSpeaker && devices[0]) {
        setSelectedSpeaker(devices[0].deviceId);
      }
    } catch (e) {
      console.warn("getAudioDeviceList failed", e);
    }
  }, [getAudioDeviceList, selectedSpeaker]);

  const handleSpeakerPress = async () => {
    await refreshSpeakers();
    setSpeakerSheetOpen(true);
  };

  const handleSelectSpeaker = (deviceId) => {
    setSelectedSpeaker(deviceId);
    try {
      switchAudioDevice(deviceId);
    } catch (e) {
      console.warn("switchAudioDevice failed", e);
    }
  };

  const handleEndCall = () => {
    try {
      leave();
    } catch (e) {}
    onLeave?.();
  };

  const swapTiles = useCallback(() => setBigIsAgent((v) => !v), []);

  const handleSwitchCamera = useCallback(async () => {
    console.log("[MeetingScreen] switch camera tapped");
    try {
      const next = facingModeRef.current === "front" ? "environment" : "front";
      facingModeRef.current = next;
      console.log("[MeetingScreen] creating track with facingMode:", next);
      const track = await createCameraVideoTrack({ facingMode: next });
      console.log("[MeetingScreen] track created:", track);
      changeWebcam(track);
      console.log("[MeetingScreen] changeWebcam invoked");
    } catch (e) {
      console.warn("[MeetingScreen] switch camera failed", e);
    }
  }, [changeWebcam]);

  const bothJoined = !!agentParticipantId && !!localParticipant?.id;

  return (
    <View className="flex-1 bg-fl-bg">
      <TopVignette height={200} />
      <BottomVignette height={260} opacity={0.7} />

      {bothJoined ? (
        <>
          <View className="absolute top-[130px] left-4">
            {bigIsAgent ? (
              <AgentTile
                participantId={agentParticipantId}
                agentState={agentState}
                variant="big"
              />
            ) : (
              <UserTile participantId={localParticipant.id} variant="big" />
            )}
          </View>

          {smallCorner !== 1 && (
            <Pressable
              onPress={handleSwitchCamera}
              style={{
                position: "absolute",
                left: TILE_CORNERS[1].x,
                top: TILE_CORNERS[1].y,
              }}
              className="w-[100px] h-[150px] rounded-[12px] border-2 border-dashed border-white/25 bg-black/40 items-center justify-center active:opacity-70"
            >
              <SwitchCamera
                size={28}
                color="rgba(255,255,255,0.7)"
                strokeWidth={2}
              />
            </Pressable>
          )}

          <DraggableTile
            initialCorner={1}
            onCornerChange={setSmallCorner}
            onTap={swapTiles}
          >
            {bigIsAgent ? (
              <UserTile participantId={localParticipant.id} variant="small" />
            ) : (
              <AgentTile
                participantId={agentParticipantId}
                agentState={agentState}
                variant="small"
              />
            )}
          </DraggableTile>
        </>
      ) : (
        <View className="absolute inset-0 items-center justify-center">
          <MeetingOrb agentState={agentState} />
        </View>
      )}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          <TopHeader
            variant="meeting"
            agentState={agentState}
            onSpeakerPress={handleSpeakerPress}
          />

          <View className="flex-1" />

          <View>
            {transcripts.length > 0 && (
              <View className="mb-2">
                <TranscriptView messages={transcripts} />
              </View>
            )}
            <BottomBar
              startTime={startTimeRef.current}
              onEndCall={handleEndCall}
            />
          </View>
        </SafeAreaView>
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
