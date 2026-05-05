import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useMeeting,
  useAgentParticipant,
  useMediaDevice,
  switchAudioDevice,
} from "@videosdk.live/react-native-sdk";
import InCallManager from "@videosdk.live/react-native-incallmanager";

import { TopVignette, BottomVignette } from "../widgets/Vignette";
import { TopHeader } from "../widgets/TopHeader";
import { MeetingOrb } from "../widgets/MeetingOrb";
import { TranscriptView } from "../widgets/TranscriptView";
import { BottomBar } from "../widgets/BottomBar";
import { SpeakerBottomSheet } from "../widgets/SpeakerBottomSheet";
import { parseAgentState } from "../widgets/AgentStatePill";

export const MeetingScreen = ({ onLeave, onAgentLeft, onCapacityReached }) => {
  const startTimeRef = useRef(new Date());

  const [agentParticipantId, setAgentParticipantId] = useState(null);
  const [agentState, setAgentState] = useState("idle");
  const [transcripts, setTranscripts] = useState([]);
  const [speakerSheetOpen, setSpeakerSheetOpen] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  const { join, leave, participants, localParticipant } = useMeeting({
    onMeetingJoined: () => {
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
    onAgentStateChanged: ({ state }) => {
      setAgentState(parseAgentState(state));
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
      const devices = list.map((d) => {
        const id = typeof d === "string" ? d : d.deviceId;
        const raw = typeof d === "string" ? d : d.label;
        return { deviceId: id, label: prettyAudio(raw) };
      });
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

  const handleSelectSpeaker = (id, label) => {
    setSelectedSpeaker(id);
    try {
      switchAudioDevice(id);
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

  return (
    <View className="flex-1 bg-fl-bg">
      <TopVignette height={200} />
      <BottomVignette height={260} opacity={0.7} />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <TopHeader
          variant="meeting"
          agentState={agentState}
          onSpeakerPress={handleSpeakerPress}
        />

        <View className="flex-1 items-center justify-center">
          <MeetingOrb agentState={agentState} />
        </View>

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

const prettyAudio = (raw) => {
  if (!raw) return "Audio";
  const s = String(raw).toUpperCase();
  if (s.includes("SPEAKER")) return "Speaker";
  if (s.includes("EARPIECE")) return Platform.OS === "ios" ? "iPhone" : "Phone";
  if (s.includes("WIRED")) return "Wired Headset";
  if (s.includes("BLUETOOTH")) return "Bluetooth";
  return raw;
};
