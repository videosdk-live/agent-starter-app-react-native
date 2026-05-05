import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { Check } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SpeakerBottomSheet = ({
  isOpen,
  onClose,
  devices = [],
  selectedDeviceId,
  onSelect,
}) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/50 justify-end">
        <Pressable onPress={() => {}} className="w-full">
          <SafeAreaView edges={["bottom"]} className="bg-fl-sheet">
            <View className="bg-fl-sheet rounded-t-fl-bar">
              <View className="self-center w-9 h-1 rounded-sm bg-white/20 mt-3 mb-2" />

              <View className="px-4 pt-1 pb-2">
                <Text
                  className="text-header-text text-xs font-medium"
                  style={{ letterSpacing: 0.4 }}
                >
                  AUDIO OUTPUT
                </Text>
              </View>

              {devices.map((d) => {
                const isSelected = d.deviceId === selectedDeviceId;
                return (
                  <Pressable
                    key={d.deviceId}
                    onPress={() => {
                      onSelect?.(d.deviceId, d.label);
                      onClose();
                    }}
                    className="flex-row items-center px-4 py-3.5 active:bg-white/5"
                  >
                    <View className="flex-1">
                      <Text
                        className={`text-[15px] ${
                          isSelected
                            ? "text-white font-semibold"
                            : "text-white/75 font-normal"
                        }`}
                      >
                        {d.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Check size={18} color="#7C3AED" strokeWidth={2.5} />
                    )}
                  </Pressable>
                );
              })}

              <View className="h-3" />
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
