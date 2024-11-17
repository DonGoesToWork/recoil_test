import "./ConfirmButton.css";

import React, { useState } from "react";

interface ConfirmButtonProps {
  children: React.ReactNode;
  onConfirm: () => void;
  confirmMessage?: string; // Optional custom confirmation message
  confirmTitle?: string; // Optional custom title
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ children, onConfirm, confirmMessage = "Are you sure you want to proceed?", confirmTitle = "Please Confirm" }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setModalOpen(true); // Open the confirmation modal
  };

  const handleConfirm = () => {
    setModalOpen(false);
    onConfirm(); // Execute the confirmed action
  };

  const handleCancel = () => {
    setModalOpen(false); // Close the modal without confirming
  };

  return (
    <div>
      {/* Trigger the confirmation modal when clicking the button */}
      <div onClick={handleClick}>{children}</div>

      {/* Full-screen modal overlay */}
      {isModalOpen && (
        <div className="confirm-modal">
          <div className="modal-content">
            <h2>{confirmTitle}</h2>
            <p>{confirmMessage}</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmButton;
