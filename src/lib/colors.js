const COLORS = {
  // Neutral palette
  neutral900: "#1B1B1E",
  neutral800: "#303033",
  neutral700: "#464649",
  neutral500: "#77777A",
  neutral400: "#919093",
  neutral300: "#C7C6C9",

  // Slate palette
  slate100: "#E1E2EA",
  slate200: "#C5C6CE",

  // Primary palette
  primary200: "#D1BCFE",
  primary750: "#42316A",
  primary800: "#37265E",

  // Yellow palette
  yellow800: "#854D0E",
  yellow200: "#FEF08A",

  // Green palette
  green800: "#166534",
  green200: "#BBF7D0",

  // Sky palette
  sky800: "#075985",
  sky200: "#BAE6FD",

  // Red palette
  red800: "#991B1B",
  red200: "#FECACA",
};

const withAlpha = (hex, alpha) => {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  return `${hex}${a}`;
};

module.exports = { COLORS, withAlpha };
