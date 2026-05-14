import React from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import sampleGif from "../assets/sample_gif.gif";
import { Spinner } from "./Spinner";

export const HolographicOrb = ({ isConnecting = false }) => {
  return (
    <View
      className="w-[250px] h-[250px] items-center justify-center"
      style={{ marginLeft: -0.5 }}
    >
      <FastImage
        source={sampleGif}
        className="w-[250px] h-[250px]"
        resizeMode={FastImage.resizeMode.contain}
      />

      {isConnecting && (
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-[125px] overflow-hidden bg-black/45 items-center justify-center"
        >
          <Spinner size={24} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};
