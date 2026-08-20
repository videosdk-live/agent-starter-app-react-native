import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { useMeeting } from "@videosdk.live/react-native-sdk";
import VideosdkRPK from "../../VideosdkRPK";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  MessageSquareText,
  MessageSquareX,
} from "lucide-react-native";
import { BarButton } from "./BarButton";
import { CallTimer } from "./CallTimer";
import { ChatInput } from "./ChatInput";
import { useMediaPermissions } from "../hooks/useMediaPermissions";
import PermissionDeniedModal from "../components/PermissionDeniedModal";
import { COLORS } from "../lib/colors";

export const BottomBar = ({ startTime, onEndCall }) => {
  const {
    localParticipant,
    toggleMic,
    toggleWebcam,
    enableScreenShare,
    disableScreenShare,
    activeSpeakerId,
    localScreenShareOn,
  } = useMeeting();

  const { audioPermission, videoPermission, micDecline, camDecline } =
    useMediaPermissions();

  const [chatOpen, setChatOpen] = useState(false);
  const [permModalType, setPermModalType] = useState(null);

  const micOn = localParticipant?.micOn ?? false;
  const camOn = localParticipant?.webcamOn ?? false;
  const isLocalSpeaker = micOn && activeSpeakerId === localParticipant?.id;
  const screenShareOn = !!localScreenShareOn;

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    const sub = VideosdkRPK.addListener("onScreenShare", async (event) => {
      try {
        if (event === "START_BROADCAST") await enableScreenShare();
        else if (event === "STOP_BROADCAST") await disableScreenShare();
      } catch (e) {
        console.warn("screen share toggle failed", e);
      }
    });
    return () => sub.remove();
  }, [enableScreenShare, disableScreenShare]);

  const handleScreenShare = async () => {
    try {
      if (screenShareOn) {
        await disableScreenShare();
        return;
      }
      if (Platform.OS === "ios") {
        VideosdkRPK.startBroadcast();
      } else {
        await enableScreenShare();
      }
    } catch (e) {
      console.warn("screen share failed", e);
    }
  };

  const handleToggleMic = async () => {
    if (!audioPermission) {
      setPermModalType("mic");
      return;
    }
    try {
      await toggleMic();
    } catch (e) {
      console.warn("toggleMic failed", e);
    }
  };

  const handleToggleWebcam = async () => {
    if (!videoPermission) {
      setPermModalType("cam");
      return;
    }
    try {
      await toggleWebcam();
    } catch (e) {
      console.warn("toggleWebcam failed", e);
    }
  };

  const toggleChat = () => setChatOpen((v) => !v);

  const handleEndCall = () => {
    // Close chat first so ChatInput unmounts and usePubSub unsubscribes while still joined — otherwise the SDK throws "unsubscribe without join".
    setChatOpen(false);
    onEndCall?.();
  };

  return (
    <>
      <View
        className="mx-3 mb-3 border border-fl-divider overflow-hidden"
        style={{
          backgroundColor: COLORS.surfaceCard,
          borderRadius: 20,
        }}
      >
        {chatOpen && <ChatInput onSent={() => setChatOpen(false)} />}

        <View className="px-3 py-2.5 flex-row items-center justify-between gap-1.5">
          <View className="flex-row items-center gap-1.5">
            <CallTimer startTime={startTime} />

            <BarButton
              Icon={micOn ? Mic : MicOff}
              isOff={!micOn}
              onPress={handleToggleMic}
              showSpeakerIndicator
              isSpeaking={isLocalSpeaker}
              showPermissionWarning={micDecline}
            />

            <BarButton
              Icon={camOn ? Video : VideoOff}
              isOff={!camOn}
              onPress={handleToggleWebcam}
              showPermissionWarning={camDecline}
            />

            <BarButton
              Icon={screenShareOn ? MonitorOff : MonitorUp}
              isOff={false}
              isActive={screenShareOn}
              onPress={handleScreenShare}
            />

            <BarButton
              Icon={chatOpen ? MessageSquareX : MessageSquareText}
              isOff={false}
              isActive={chatOpen}
              onPress={toggleChat}
            />
          </View>

          <Pressable
            onPress={handleEndCall}
            className="w-[76px] h-8 rounded-fl-button bg-end-call items-center justify-center active:opacity-85"
          >
            <Text className="text-white text-[13px] font-semibold">
              End Call
            </Text>
          </Pressable>
        </View>
      </View>

      <PermissionDeniedModal
        isOpen={!!permModalType}
        type={permModalType ?? "mic"}
        onClose={() => setPermModalType(null)}
      />
    </>
  );
};
