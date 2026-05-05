import React, { useEffect, useState } from "react";
import { Text } from "react-native";

export const CallTimer = ({ startTime }) => {
  const [seconds, setSeconds] = useState(() =>
    startTime
      ? Math.max(0, Math.floor((Date.now() - startTime.getTime()) / 1000))
      : 0,
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <Text
      className="text-white text-[13px] font-medium"
      style={{ fontVariant: ["tabular-nums"] }}
    >
      {m}:{s}
    </Text>
  );
};
