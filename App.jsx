import React, { useState, useEffect, useCallback } from "react";
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

export default function App() {
  const [status, setStatus] = useState("idle");
  const [meetingId, setMeetingId] = useState(null);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showAgentLeftModal, setShowAgentLeftModal] = useState(false);

  const AUTH_TOKEN = Config.AUTH_TOKEN;

  useEffect(() => {
    if (status !== "disconnected") return;
    const t = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const handleTalkPress = useCallback(async () => {
    setStatus("connecting");
    try {
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

      setMeetingId(id);
      setStatus("connected");
    } catch (e) {
      console.warn("Talk to agent failed:", e?.message || e);
      setStatus("disconnected");
    }
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
    <GestureHandlerRootView className="flex-1 bg-fl-bg">
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {status !== "connected" && (
          <JoinScreen
            isConnecting={status === "connecting"}
            isDisconnected={status === "disconnected"}
            onTalkPress={handleTalkPress}
          />
        )}

        {status === "connected" && AUTH_TOKEN && meetingId && (
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: true,
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
