import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { X } from "lucide-react-native";
import { cn } from "../lib/utils";

const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  zIndex = 2000,
  actions = [],
}) => {
  return (
    <Modal
      visible={!!isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 items-center justify-center bg-black/60"
        style={{ zIndex }}
      >
        <View
          className="bg-modal rounded-modal w-[500px] max-w-[92%] h-[154px] border border-white/5 px-6 py-5 justify-between"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 25 },
            shadowOpacity: 0.5,
            shadowRadius: 50,
            elevation: 24,
          }}
        >
          <View>
            <View className="flex-row items-center justify-between h-[26px] mb-1">
              <Text className="text-white text-lg font-semibold leading-[26px]">
                {title}
              </Text>
              <Pressable
                onPress={onClose}
                className="active:opacity-100 opacity-40"
                hitSlop={8}
              >
                <X size={20} color="#FFFFFF" />
              </Pressable>
            </View>
            <Text className="text-muted text-xs leading-4 font-normal">
              {description}
            </Text>
          </View>

          <View className="flex-row items-center justify-end gap-3">
            {actions.map((action, i) => (
              <Pressable
                key={i}
                onPress={action.onClick}
                style={({ pressed }) => ({
                  width: action.width ?? 126,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 4,
                })}
                className={cn(
                  "h-8 rounded-button items-center justify-center",
                  action.variant === "primary"
                    ? "bg-accent"
                    : "bg-btn-secondary",
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-medium",
                    action.variant === "primary" ? "text-modal" : "text-white",
                  )}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BaseModal;
