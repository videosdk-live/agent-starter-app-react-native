import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import {
  createScreenShareVideoTrack,
  useRoom,
} from "@videosdk.live/react-native-sdk";
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
    toggleCam,
    enableScreenShare,
    disableScreenShare,
    activeSpeakerId,
    isScreenSharing,
  } = useRoom();

  const { audioPermission, videoPermission, micDecline, camDecline } =
    useMediaPermissions();

  const [chatOpen, setChatOpen] = useState(false);
  const [permModalType, setPermModalType] = useState(null);

  const micOn = localParticipant?.micOn ?? false;
  const camOn = localParticipant?.webcamOn ?? false;
  const isLocalSpeaker = micOn && activeSpeakerId === localParticipant?.id;
  const screenShareOn = !!isScreenSharing;

  const handleScreenShare = async () => {
    try {
      if (screenShareOn) {
        await disableScreenShare();
        return;
      }
      // iOS shows the broadcast picker, Android asks for screen-capture consent
      await enableScreenShare(await createScreenShareVideoTrack());
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
      await toggleCam();
    } catch (e) {
      console.warn("toggleCam failed", e);
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
