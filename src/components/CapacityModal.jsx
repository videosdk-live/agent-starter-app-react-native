import React from "react";
import BaseModal from "./BaseModal";

const CapacityModal = ({ isOpen, onClose }) => (
  <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    title="Meeting Capacity Reached"
    description="This meeting has reached its maximum limit of 2 participants. Please try joining again later."
    zIndex={3000}
    actions={[
      {
        label: "Close",
        onClick: onClose,
        variant: "primary",
      },
    ]}
  />
);

export default CapacityModal;
