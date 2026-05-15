const COLORS = {
  black: "#000",
  white: "#FFFFFF",

  surfaceBg: "#000000",
  surfaceCard: "#1C1C1E",
  surfaceMuted: "#2A2A2E",
  surfaceAvatar: "#3A3A3C",
  surfaceModal: "#101113",

  brandPurple: "#37265E",
  accentViolet: "#7C3AED",
  destructive: "#EF4444",
  warningYellow: "#FACC15",

  inputPlaceholder: "#77777A",

  white07: "rgba(255,255,255,0.07)",
  white08: "rgba(255,255,255,0.08)",
  white10: "rgba(255,255,255,0.10)",
  white20: "rgba(255,255,255,0.20)",
  white25: "rgba(255,255,255,0.25)",
  white38: "rgba(255,255,255,0.38)",
  white55: "rgba(255,255,255,0.55)",
  white90: "rgba(255,255,255,0.9)",

  black25: "rgba(0,0,0,0.25)",
  black40: "rgba(0,0,0,0.4)",
  black45: "rgba(0,0,0,0.45)",
  black55: "rgba(0,0,0,0.55)",
  black85: "rgba(0,0,0,0.85)",

  btnSecondary: "#2E3037",

  neutral900: "#1B1B1E",
  neutral800: "#303033",
  neutral700: "#464649",
  neutral500: "#77777A",
  neutral400: "#919093",
  neutral300: "#C7C6C9",

  slate100: "#E1E2EA",
  slate200: "#C5C6CE",

  primary200: "#D1BCFE",
  primary750: "#42316A",
  primary800: "#37265E",

  yellow800: "#854D0E",
  yellow200: "#FEF08A",

  green800: "#166534",
  green200: "#BBF7D0",

  sky800: "#075985",
  sky200: "#BAE6FD",

  red800: "#991B1B",
  red200: "#FECACA",

  status: {
    connecting: {
      bg: "rgba(180,83,9,0.08)",
      border: "rgba(180,83,9,0.6)",
      text: "#FDE68A",
      dot: "#FBBF24",
    },
    connected: {
      bg: "rgba(22,101,52,0.08)",
      border: "rgba(22,101,52,0.6)",
      text: "#BBF7D0",
      dot: "#4ADE80",
    },
    listening: {
      bg: "transparent",
      border: "rgba(107,114,128,0.5)",
      text: "#9CA3AF",
      dot: "#9CA3AF",
    },
    thinking: {
      bg: "rgba(124,58,237,0.08)",
      border: "rgba(124,58,237,0.6)",
      text: "#C4B5FD",
      dot: "#A78BFA",
    },
    speaking: {
      bg: "rgba(14,165,233,0.08)",
      border: "rgba(14,165,233,0.6)",
      text: "#7DD3FC",
      dot: "#38BDF8",
    },
    disconnected: {
      bg: "rgba(153,27,27,0.08)",
      border: "rgba(153,27,27,0.6)",
      text: "#FECACA",
      dot: "#F87171",
    },
    idle: {
      bg: "rgba(225,226,234,0.05)",
      border: "rgba(225,226,234,0.10)",
      text: "#E1E2EA",
      dot: "#E1E2EA",
    },
  },

  orb: {
    speaking: "rgba(14,165,233,0.45)",
    thinking: "rgba(124,58,237,0.45)",
    listening: "rgba(156,163,175,0.35)",
  },
};

const withAlpha = (hex, alpha) => {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  return `${hex}${a}`;
};

module.exports = { COLORS, withAlpha };
