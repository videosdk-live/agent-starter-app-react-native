import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useMeeting,
  useMediaDevice,
  usePubSub,
  switchAudioDevice,
} from "@videosdk.live/react-native-sdk";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  MessageSquareCheck,
  SendHorizontal,
} from "lucide-react-native";

import { BarButton } from "./BarButton";
import { CallTimer } from "./CallTimer";
import { DevicePickerSheet } from "./DevicePickerSheet";
import { useMediaPermissions } from "../hooks/useMediaPermissions";

export const BottomBar = ({ startTime, onEndCall }) => {
  const {
    localParticipant,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    changeWebcam,
    activeSpeakerId,
  } = useMeeting();

  const { publish } = usePubSub("CHAT");
  const { getCameras, getAudioDeviceList } = useMediaDevice();
  const {
    audioPermission,
    videoPermission,
    micDecline,
    camDecline,
    requestPermission,
  } = useMediaPermissions();

  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");

  const [micSheetOpen, setMicSheetOpen] = useState(false);
  const [camSheetOpen, setCamSheetOpen] = useState(false);

  const [mics, setMics] = useState([]);
  const [cams, setCams] = useState([]);
  const [selectedMic, setSelectedMic] = useState(null);
  const [selectedCam, setSelectedCam] = useState(null);

  const micOn = localParticipant?.micOn ?? false;
  const camOn = localParticipant?.webcamOn ?? false;
  const isLocalSpeaker = micOn && activeSpeakerId === localParticipant?.id;

  const refreshMics = useCallback(async () => {
    if (!audioPermission) return;
    try {
      const list = (await getAudioDeviceList()) || [];
      setMics(
        list.map((d) => {
          const id = typeof d === "string" ? d : d.deviceId;
          return {
            deviceId: id,
            label: prettyAudio(typeof d === "string" ? d : d.label),
          };
        }),
      );
    } catch (e) {
      console.warn("getAudioDeviceList failed", e);
    }
  }, [audioPermission, getAudioDeviceList]);

  const refreshCams = useCallback(async () => {
    if (!videoPermission) return;
    try {
      const list = (await getCameras()) || [];
      setCams(
        list.map((c) => ({ deviceId: c.deviceId, label: c.label || "Camera" })),
      );
    } catch (e) {
      console.warn("getCameras failed", e);
    }
  }, [videoPermission, getCameras]);

  useEffect(() => {
    refreshMics();
    refreshCams();
  }, [refreshMics, refreshCams]);

  const sendChat = async () => {
    const text = chatText.trim();
    if (!text) return;
    try {
      await publish(text);
      setChatText("");
    } catch (e) {
      console.warn("chat publish failed", e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="mx-3 mb-3 bg-fl-bar rounded-fl-bar border border-white/[0.07]">
        {chatOpen && (
          <>
            <View className="pl-3.5 pr-2.5 pt-2.5 flex-row items-center">
              <TextInput
                value={chatText}
                onChangeText={setChatText}
                placeholder="Type something..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                autoFocus
                className="flex-1 text-white text-[15px] py-1 mr-2"
                onSubmitEditing={sendChat}
                returnKeyType="send"
              />
              <Pressable
                onPress={sendChat}
                className="w-8 h-8 rounded-fl-button bg-white/10 items-center justify-center active:opacity-70"
              >
                <SendHorizontal
                  size={18}
                  color="rgba(255,255,255,0.7)"
                  strokeWidth={2}
                />
              </Pressable>
            </View>
            <View className="mx-1 mt-3 h-px bg-white/[0.07]" />
          </>
        )}

        <View className="px-3 py-2.5 flex-row items-center">
          <CallTimer startTime={startTime} />

          <View className="w-2" />

          <BarButton
            Icon={micOn ? Mic : MicOff}
            isOff={!micOn}
            onPress={async () => {
              if (!audioPermission) {
                const ok = await requestPermission("mic");
                if (!ok) return;
              }
              toggleMic();
            }}
            showSpeakerIndicator
            isSpeaking={isLocalSpeaker}
            showPermissionWarning={micDecline}
          />

          <View className="w-1.5" />

          <BarButton
            Icon={camOn ? Video : VideoOff}
            isOff={!camOn}
            onPress={async () => {
              if (!videoPermission) {
                const ok = await requestPermission("cam");
                if (!ok) return;
              }
              toggleWebcam();
            }}
            showChevron
            isMenuOpen={camSheetOpen}
            onChevronPress={() => {
              refreshCams();
              setCamSheetOpen(true);
            }}
            showPermissionWarning={camDecline}
          />

          <View className="w-1.5" />

          <BarButton
            Icon={MonitorUp}
            isOff={false}
            onPress={() => toggleScreenShare()}
          />

          <View className="w-1.5" />

          <BarButton
            Icon={chatOpen ? MessageSquareCheck : MessageSquare}
            isOff={false}
            onPress={() => setChatOpen((v) => !v)}
          />

          <View className="flex-1" />

          <Pressable
            onPress={onEndCall}
            className="w-[76px] h-8 rounded-fl-button bg-end-call items-center justify-center active:opacity-85"
          >
            <Text className="text-white text-[13px] font-semibold">
              End Call
            </Text>
          </Pressable>
        </View>
      </View>

      <DevicePickerSheet
        isOpen={micSheetOpen}
        onClose={() => setMicSheetOpen(false)}
        title="MICROPHONE"
        devices={mics}
        selectedDeviceId={selectedMic}
        onSelect={(id) => {
          setSelectedMic(id);
          try {
            switchAudioDevice(id);
          } catch (e) {
            console.warn("switchAudioDevice failed", e);
          }
        }}
      />

      <DevicePickerSheet
        isOpen={camSheetOpen}
        onClose={() => setCamSheetOpen(false)}
        title="CAMERA"
        devices={cams}
        selectedDeviceId={selectedCam}
        onSelect={(id) => {
          setSelectedCam(id);
          try {
            changeWebcam(id);
          } catch (e) {
            console.warn("changeWebcam failed", e);
          }
        }}
      />
    </KeyboardAvoidingView>
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
