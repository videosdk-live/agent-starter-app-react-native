import { useState, useEffect, useCallback } from "react";
import { AppState } from "react-native";
import { useMediaDevice, Constants } from "@videosdk.live/react-native-sdk";

export const useMediaPermissions = () => {
  const { checkPermission, requestPermission: sdkRequestPermission } =
    useMediaDevice();
  const [audioPermission, setAudioPermission] = useState(false);
  const [videoPermission, setVideoPermission] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const map = await checkPermission(Constants.permission.AUDIO_AND_VIDEO);
      setAudioPermission(!!map.get(Constants.permission.AUDIO));
      setVideoPermission(!!map.get(Constants.permission.VIDEO));
    } catch (e) {
      console.warn("checkPermission failed", e);
    }
  }, [checkPermission]);

  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const requestPermission = useCallback(
    async (type) => {
      const permType =
        type === "mic"
          ? Constants.permission.AUDIO
          : type === "cam"
          ? Constants.permission.VIDEO
          : Constants.permission.AUDIO_AND_VIDEO;

      try {
        const map = await sdkRequestPermission(permType);
        const granted =
          type === "mic"
            ? !!map.get(Constants.permission.AUDIO)
            : type === "cam"
            ? !!map.get(Constants.permission.VIDEO)
            : !!map.get(Constants.permission.AUDIO) &&
              !!map.get(Constants.permission.VIDEO);
        await refresh();
        return granted;
      } catch (e) {
        console.warn("requestPermission failed", e);
        await refresh();
        return false;
      }
    },
    [sdkRequestPermission, refresh],
  );

  return {
    audioPermission,
    videoPermission,
    micDecline: !audioPermission,
    camDecline: !videoPermission,
    requestPermission,
    refreshPermissions: refresh,
  };
};
