import React from "react";
import { Linking } from "react-native";
import BaseModal from "./BaseModal";

const COPY = {
  mic: {
    title: "Microphone Permission Denied",
    description:
      "Microphone access is required to make audio calls. Please enable it in your settings.",
  },
  cam: {
    title: "Camera Permission Denied",
    description:
      "Camera access is required to enable your video. Please enable it in your settings.",
  },
};

const PermissionDeniedModal = ({ isOpen, onClose, type = "mic" }) => {
  const copy = COPY[type] ?? COPY.mic;

  const handleOpenSettings = () => {
    Linking.openSettings().catch(() => {});
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={copy.title}
      description={copy.description}
      zIndex={3000}
      actions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "secondary",
        },
        {
          label: "Open Settings",
          onClick: handleOpenSettings,
          variant: "primary",
          width: 130,
        },
      ]}
    />
  );
};

export default PermissionDeniedModal;
