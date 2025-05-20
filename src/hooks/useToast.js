import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

function useToast() {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSuccess = (message) => {
    setToast({ open: true, message, severity: "success" });
  };

  const showError = (message) => {
    setToast({ open: true, message, severity: "error" });
  };

  const ToastComponent = (
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        variant="filled"
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );

  return { showSuccess, showError, ToastComponent };
}

export default useToast;
