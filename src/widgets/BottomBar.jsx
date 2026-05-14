import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, TextInput, Platform } from "react-native";
import Animated, {
  LinearTransition,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useMeeting, usePubSub } from "@videosdk.live/react-native-sdk";
import VideosdkRPK from "../../VideosdkRPK";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquareText,
  MessageSquareX,
  SendHorizontal,
} from "lucide-react-native";

import { BarButton } from "./BarButton";
import { CallTimer } from "./CallTimer";
import { useMediaPermissions } from "../hooks/useMediaPermissions";
import PermissionDeniedModal from "../components/PermissionDeniedModal";
import { buttonShadow } from "../lib/shadows";

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
  const inputRef = useRef(null);

  const micOn = localParticipant?.micOn ?? false;
  const camOn = localParticipant?.webcamOn ?? false;
  const isLocalSpeaker = micOn && activeSpeakerId === localParticipant?.id;
  const screenShareOn = !!localScreenShareOn;
  const canSend = chatText.trim().length > 0;

  useEffect(() => {
    if (!chatOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [chatOpen]);

  useEffect(() => {
    console.log("[ScreenShare][JS] localScreenShareOn changed:", screenShareOn);
  }, [screenShareOn]);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    console.log("[ScreenShare][JS] subscribing to VideosdkRPK onScreenShare");
    const sub = VideosdkRPK.addListener("onScreenShare", (event) => {
      console.log("[ScreenShare][JS] onScreenShare event received:", event);
      if (event === "START_BROADCAST") {
        console.log("[ScreenShare][JS] calling enableScreenShare()");
        enableScreenShare();
      } else if (event === "STOP_BROADCAST") {
        console.log("[ScreenShare][JS] calling disableScreenShare()");
        disableScreenShare();
      }
    });
    return () => {
      console.log("[ScreenShare][JS] unsubscribing onScreenShare listener");
      sub.remove();
    };
  }, [enableScreenShare, disableScreenShare]);

  const handleScreenShare = () => {
    console.log(
      "[ScreenShare][JS] handleScreenShare tapped, screenShareOn:",
      screenShareOn,
      "platform:",
      Platform.OS,
    );
    if (screenShareOn) {
      console.log("[ScreenShare][JS] -> disableScreenShare()");
      disableScreenShare();
      return;
    }
    if (Platform.OS === "ios") {
      console.log("[ScreenShare][JS] -> VideosdkRPK.startBroadcast()");
      VideosdkRPK.startBroadcast();
    } else {
      console.log("[ScreenShare][JS] -> enableScreenShare() (android)");
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
    } catch (e) {
      console.warn("chat publish failed", e);
    }
  };

  return (
    <>
      <Animated.View
        layout={LinearTransition.duration(250)}
        className="self-center mb-3 w-[370px] max-w-full border border-[#FFFFFF33] overflow-hidden"
        style={{
          backgroundColor: "#000000",
          borderRadius: 24,
        }}
      >
        {chatOpen && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <View className="h-16 px-4 flex-row items-center justify-between">
              <TextInput
                ref={inputRef}
                value={chatText}
                onChangeText={setChatText}
                placeholder="Type something..."
                placeholderTextColor="#77777A"
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
                <SendHorizontal size={20} color="#FFFFFF" strokeWidth={2} />
              </Pressable>
            </View>
            <View className="self-center w-[338px] h-px bg-white/10" />
          </Animated.View>
        )}

        <View className="h-[55px] px-4 py-3 flex-row items-center justify-between gap-1.5">
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
              Icon={MonitorUp}
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
      </Animated.View>

      <PermissionDeniedModal
        isOpen={!!permModalType}
        type={permModalType ?? "mic"}
        onClose={() => setPermModalType(null)}
      />
    </>
  );
};
