import React from "react";
import { View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import sampleGif from "../assets/sample_gif.gif";
import { Spinner } from "./Spinner";
import { COLORS } from "../lib/colors";

export const HolographicOrb = ({ isConnecting = false }) => {
  return (
    <View style={styles.container}>
      <FastImage
        source={sampleGif}
        style={styles.gif}
        resizeMode={FastImage.resizeMode.contain}
      />
      {isConnecting && (
        <View pointerEvents="none" style={styles.overlay}>
          <Spinner size={32} color={COLORS.white} />
        </View>
      )}
    </View>
  );
};

const ORB_SIZE = 260;

const styles = StyleSheet.create({
  container: {
    width: ORB_SIZE,
    height: ORB_SIZE,
  },
  gif: {
    position: "absolute",
    top: 0,
    left: 0,
    width: ORB_SIZE,
    height: ORB_SIZE,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    overflow: "hidden",
    backgroundColor: COLORS.black45,
    alignItems: "center",
    justifyContent: "center",
  },
});
