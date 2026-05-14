import React from "react";
import BaseModal from "./BaseModal";

const JoinErrorModal = ({ isOpen, onClose, onTryAgain, description }) => (
  <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    title="Unable to Join Meeting"
    description={
      description ??
      "We couldn’t connect you to the meeting. Please check your internet connection and try again."
    }
    zIndex={3000}
    actions={[
      {
        label: "Try Again",
        onClick: onTryAgain,
        variant: "primary",
      },
    ]}
  />
);

export default JoinErrorModal;
