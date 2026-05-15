import { COLORS } from "./colors";

const pill = (text, key) => ({
  text,
  bg: COLORS.status[key].bg,
  border: COLORS.status[key].border,
  color: COLORS.status[key].text,
  dot: COLORS.status[key].dot,
});

export const STATUS_CONFIGS = {
  connecting: pill("Connecting...", "connecting"),
  connected: pill("Connected", "connected"),
  listening: pill("Listening", "listening"),
  thinking: pill("Thinking", "thinking"),
  speaking: pill("Speaking", "speaking"),
  disconnected: pill("Disconnected", "disconnected"),
  idle: pill("Idle", "idle"),
};
