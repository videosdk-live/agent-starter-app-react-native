import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { X } from "lucide-react-native";
import { cn } from "../lib/utils";
import { buttonShadow } from "../lib/shadows";

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
          className="bg-modal rounded-[24px] w-[350px] min-w-[300px] max-w-full h-[154px] border border-white/5 px-6 py-5 justify-between"
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
            <Text className="text-neutral-400 text-xs leading-4 font-normal">
              {description}
            </Text>
          </View>

          <View className="flex-row items-center justify-end gap-3">
            {actions.map((action, i) => (
              <Pressable
                key={i}
                onPress={action.onClick}
                style={({ pressed }) => ({
                  width: action.width ?? 88,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  ...(action.variant === "primary" ? buttonShadow : {}),
                })}
                className={cn(
                  "h-8 rounded-button items-center justify-center px-3 py-1.5",
                  action.variant === "primary"
                    ? "bg-primary-200"
                    : "bg-btn-secondary",
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-medium font-sans leading-5",
                    action.variant === "primary"
                      ? "text-primary-800"
                      : "text-white",
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
