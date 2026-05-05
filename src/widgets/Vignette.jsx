import React from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { View } from "react-native";

export const TopVignette = ({ height = 200 }) => (
  <View
    pointerEvents="none"
    className="absolute top-0 left-0 right-0"
    style={{ height }}
  >
    <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#000000" stopOpacity={0.4} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#topVignette)" />
    </Svg>
  </View>
);

export const BottomVignette = ({ height = 260, opacity = 0.7 }) => (
  <View
    pointerEvents="none"
    className="absolute bottom-0 left-0 right-0"
    style={{ height }}
  >
    <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="bottomVignette" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0%" stopColor="#000000" stopOpacity={opacity} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#bottomVignette)" />
    </Svg>
  </View>
);
