import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const modalStyles = {
    header: {
      backgroundColor: "#f8f9fa",
      color: "#343a40",
      fontSize: "1.25rem",
      padding: "1rem",
      borderBottom: "1px solid #ddd",
    },
    body: {
      fontSize: "1rem",
      padding: "1.5rem",
      color: "#495057",
      textAlign: "center",
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "1rem",
      borderTop: "1px solid #ddd",
    },
    cancelButton: {
      backgroundColor: "#6c757d",
      borderColor: "#6c757d",
      fontWeight: "600",
      padding: "0.5rem 1rem",
      transition: "background-color 0.3s",
    },
    confirmButton: {
      backgroundColor: "#dc3545",
      borderColor: "#dc3545",
      fontWeight: "600",
      padding: "0.5rem 1rem",
      transition: "background-color 0.3s",
    },
  };

  return (
    <>
      {/* Custom style for the modal backdrop */}
      <style>
        {`
          .modal-backdrop {
            z-index: 1050 !important; /* Ensure the backdrop is above other elements like Sidebar */
          }
        `}
      </style>

      <Modal isOpen={open} toggle={onCancel} centered>
        <ModalHeader toggle={onCancel} style={modalStyles.header}>
          {title}
        </ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter style={modalStyles.footer}>
          <Button style={modalStyles.cancelButton} onClick={onCancel}>
            {cancelText}
          </Button>
          <Button style={modalStyles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ConfirmDialog;
