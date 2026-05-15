const { COLORS } = require("./src/lib/colors");

module.exports = {
  content: ["./App.{js,jsx}", "./src/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "fl-bg": COLORS.surfaceBg,
        "fl-bar": COLORS.surfaceCard,
        "fl-sheet": COLORS.surfaceCard,
        "fl-divider": COLORS.white07,

        "btn-bg": COLORS.white07,
        "btn-bg-off": COLORS.white08,
        "btn-icon-on": COLORS.white,
        "btn-secondary": COLORS.btnSecondary,
        "end-call": COLORS.destructive,

        modal: COLORS.surfaceModal,

        "header-text": COLORS.white55,
        "header-text-faded": COLORS.white38,
        "warn-yellow": COLORS.warningYellow,

        "primary-200": COLORS.primary200,
        "primary-750": COLORS.primary750,
        "primary-800": COLORS.primary800,

        "neutral-900": COLORS.neutral900,
        "neutral-800": COLORS.neutral800,
        "neutral-700": COLORS.neutral700,
        "neutral-500": COLORS.neutral500,
        "neutral-400": COLORS.neutral400,
        "neutral-300": COLORS.neutral300,

        "slate-100": COLORS.slate100,
        "slate-200": COLORS.slate200,

        "yellow-800": COLORS.yellow800,
        "yellow-200": COLORS.yellow200,

        "green-800": COLORS.green800,
        "green-200": COLORS.green200,

        "sky-800": COLORS.sky800,
        "sky-200": COLORS.sky200,

        "red-800": COLORS.red800,
        "red-200": COLORS.red200,
      },
      borderRadius: {
        "fl-bar": "20px",
        "fl-button": "10px",
        "fl-pill": "20px",
        "fl-square": "12px",
        tile: "28px",
        modal: "24px",
        "modal-inner": "23px",
        "badge-lg": "14px",
        button: "8px",
        "button-sm": "6px",
      },
      fontFamily: {
        sans: ["Inter", "System"],
      },
    },
  },
  plugins: [],
};
