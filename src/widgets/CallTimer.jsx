import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "../lib/colors";

export const CallTimer = ({ startTime }) => {
  const [seconds, setSeconds] = useState(() =>
    startTime
      ? Math.max(0, Math.floor((Date.now() - startTime.getTime()) / 1000))
      : 0,
  );

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <Text style={styles.text}>
      {m}:{s}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    minWidth: 36,
    textAlign: "center",
  },
});
