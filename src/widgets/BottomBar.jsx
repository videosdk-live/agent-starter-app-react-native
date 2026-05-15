import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, Platform } from "react-native";
import Animated, { FadeIn, Easing } from "react-native-reanimated";
import { useMeeting, usePubSub } from "@videosdk.live/react-native-sdk";
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
  SendHorizontal,
} from "lucide-react-native";

import { BarButton } from "./BarButton";
import { CallTimer } from "./CallTimer";
import { useMediaPermissions } from "../hooks/useMediaPermissions";
import PermissionDeniedModal from "../components/PermissionDeniedModal";
import { buttonShadow } from "../lib/shadows";
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

  const { publish } = usePubSub("CHAT");
  const { audioPermission, videoPermission, micDecline, camDecline } =
    useMediaPermissions();

  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [permModalType, setPermModalType] = useState(null);

  const micOn = localParticipant?.micOn ?? false;
  const camOn = localParticipant?.webcamOn ?? false;
  const isLocalSpeaker = micOn && activeSpeakerId === localParticipant?.id;
  const screenShareOn = !!localScreenShareOn;
  const canSend = chatText.trim().length > 0;

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    const sub = VideosdkRPK.addListener("onScreenShare", (event) => {
      if (event === "START_BROADCAST") enableScreenShare();
      else if (event === "STOP_BROADCAST") disableScreenShare();
    });
    return () => sub.remove();
  }, [enableScreenShare, disableScreenShare]);

  const handleScreenShare = () => {
    if (screenShareOn) {
      disableScreenShare();
      return;
    }
    if (Platform.OS === "ios") {
      VideosdkRPK.startBroadcast();
    } else {
      enableScreenShare();
    }
  };

  const toggleChat = () => setChatOpen((v) => !v);

  const sendChat = async () => {
    const text = chatText.trim();
    if (!text) return;
    try {
      await publish(text);
      setChatText("");
      setChatOpen(false);
    } catch (e) {
      console.warn("chat publish failed", e);
    }
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
        {chatOpen && (
          <Animated.View
            entering={FadeIn.duration(180).easing(Easing.out(Easing.cubic))}
          >
            <View className="h-16 px-4 flex-row items-center justify-between">
              <TextInput
                value={chatText}
                onChangeText={setChatText}
                placeholder="Type something..."
                placeholderTextColor={COLORS.inputPlaceholder}
                className="flex-1 text-white text-sm font-normal font-sans leading-5 mr-3"
                onSubmitEditing={sendChat}
                returnKeyType="send"
              />
              <Pressable
                onPress={sendChat}
                disabled={!canSend}
                style={[buttonShadow, { opacity: canSend ? 1 : 0.5 }]}
                className="w-8 h-8 rounded-[6px] p-1.5 bg-neutral-800 items-center justify-center active:opacity-70"
              >
                <SendHorizontal size={20} color={COLORS.white} strokeWidth={2} />
              </Pressable>
            </View>
            <View className="self-center w-[338px] h-px bg-white/10" />
          </Animated.View>
        )}

        <View className="px-3 py-2.5 flex-row items-center justify-between gap-1.5">
          <View className="flex-row items-center gap-1.5">
            <CallTimer startTime={startTime} />

            <BarButton
              Icon={micOn ? Mic : MicOff}
              isOff={!micOn}
              onPress={() => {
                if (!audioPermission) {
                  setPermModalType("mic");
                  return;
                }
                toggleMic();
              }}
              showSpeakerIndicator
              isSpeaking={isLocalSpeaker}
              showPermissionWarning={micDecline}
            />

            <BarButton
              Icon={camOn ? Video : VideoOff}
              isOff={!camOn}
              onPress={() => {
                if (!videoPermission) {
                  setPermModalType("cam");
                  return;
                }
                toggleWebcam();
              }}
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
            onPress={onEndCall}
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
