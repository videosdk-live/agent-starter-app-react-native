import { useState, useEffect, useCallback } from "react";
import { Platform, AppState } from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

const MIC_PERM =
  Platform.OS === "ios"
    ? PERMISSIONS.IOS.MICROPHONE
    : PERMISSIONS.ANDROID.RECORD_AUDIO;

const CAM_PERM =
  Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

export const useMediaPermissions = () => {
  const [audioPermission, setAudioPermission] = useState(false);
  const [videoPermission, setVideoPermission] = useState(false);
  const [micDecline, setMicDecline] = useState(false);
  const [camDecline, setCamDecline] = useState(false);

  const refreshPermissions = useCallback(async () => {
    try {
      const [audio, video] = await Promise.all([
        check(MIC_PERM),
        check(CAM_PERM),
      ]);

      setAudioPermission(audio === RESULTS.GRANTED);
      setVideoPermission(video === RESULTS.GRANTED);
      setMicDecline(audio === RESULTS.BLOCKED || audio === RESULTS.DENIED);
      setCamDecline(video === RESULTS.BLOCKED || video === RESULTS.DENIED);
    } catch (e) {
      console.error("Error checking permissions", e);
    }
  }, []);

  useEffect(() => {
    refreshPermissions();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshPermissions();
    });
    return () => sub.remove();
  }, [refreshPermissions]);

  const handleRequest = useCallback(
    async (type) => {
      const perm = type === "mic" ? MIC_PERM : CAM_PERM;
      try {
        const result = await request(perm);

        if (result === RESULTS.BLOCKED) {
          openSettings().catch(() => {});
        }

        await refreshPermissions();
        return result === RESULTS.GRANTED;
      } catch (e) {
        console.error("Request permission failed", e);
        return false;
      }
    },
    [refreshPermissions],
  );

  return {
    audioPermission,
    videoPermission,
    micDecline,
    camDecline,
    requestPermission: handleRequest,
    refreshPermissions,
  };
};
