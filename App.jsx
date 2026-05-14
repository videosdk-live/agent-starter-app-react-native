import React, { useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MeetingProvider } from "@videosdk.live/react-native-sdk";
import Config from "react-native-config";
import { JoinScreen } from "./src/screens/JoinScreen";
import { MeetingScreen } from "./src/screens/MeetingScreen";
import { createMeeting, dispatchAgent, verifyMeeting } from "./src/Api";
import BaseModal from "./src/components/BaseModal";
import CapacityModal from "./src/components/CapacityModal";
import JoinErrorModal from "./src/components/JoinErrorModal";
import { useMediaPermissions } from "./src/hooks/useMediaPermissions";

export default function App() {
  const [status, setStatus] = useState("idle");
  const [meetingId, setMeetingId] = useState(null);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showAgentLeftModal, setShowAgentLeftModal] = useState(false);
  const [joinErrorOpen, setJoinErrorOpen] = useState(false);
  const [startMicEnabled, setStartMicEnabled] = useState(false);

  const AUTH_TOKEN = Config.AUTH_TOKEN;
  const { requestPermission } = useMediaPermissions();

  const handleTalkPress = useCallback(async () => {
    setStatus("connecting");
    try {
      const micGranted = await requestPermission("mic");
      await requestPermission("cam");

      let id = Config.MEETING_ID;
      if (id) {
        const ok = await verifyMeeting(id);
        if (!ok) throw new Error("Invalid meeting ID");
      } else {
        id = await createMeeting();
        if (!id) throw new Error("Could not create meeting");
      }

      const dispatched = await dispatchAgent({ meetingId: id });
      if (!dispatched) throw new Error("Agent dispatch failed");

      setStartMicEnabled(micGranted);
      setMeetingId(id);
      setStatus("connected");
    } catch (e) {
      console.warn("Talk to agent failed:", e?.message || e);
      setStatus("idle");
      setJoinErrorOpen(true);
    }
  }, [requestPermission]);

  const dismissJoinError = useCallback(() => {
    setJoinErrorOpen(false);
    setStatus("idle");
  }, []);

  const handleLeave = useCallback(() => {
    setMeetingId(null);
    setStatus("idle");
  }, []);

  const handleAgentLeft = useCallback(() => {
    setShowAgentLeftModal(true);
  }, []);

  const handleCapacityReached = useCallback(() => {
    setShowCapacityModal(true);
  }, []);

  const closeAgentLeft = () => {
    setShowAgentLeftModal(false);
    handleLeave();
  };

  const closeCapacity = () => {
    setShowCapacityModal(false);
    handleLeave();
  };

  return (
    <GestureHandlerRootView
      className="flex-1 bg-fl-bg"
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {status !== "connected" && (
          <JoinScreen
            isConnecting={status === "connecting"}
            isDisconnected={false}
            onTalkPress={handleTalkPress}
          />
        )}

        {status === "connected" && AUTH_TOKEN && meetingId && (
          <MeetingProvider
            config={{
              meetingId:"e7mz-dc2n-4x06",
              micEnabled: startMicEnabled,
              webcamEnabled: false,
              name: "Guest",
            }}
            token={AUTH_TOKEN}
          >
            <MeetingScreen
              onLeave={handleLeave}
              onAgentLeft={handleAgentLeft}
              onCapacityReached={handleCapacityReached}
            />
          </MeetingProvider>
        )}

        <CapacityModal isOpen={showCapacityModal} onClose={closeCapacity} />
        <JoinErrorModal
          isOpen={joinErrorOpen}
          onClose={dismissJoinError}
          onTryAgain={dismissJoinError}
        />
        <BaseModal
          isOpen={showAgentLeftModal}
          onClose={closeAgentLeft}
          title="Agent Left"
          description="The agent has left the meeting. You can leave now too."
          actions={[
            {
              label: "Okay",
              onClick: closeAgentLeft,
              variant: "primary",
            },
          ]}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
