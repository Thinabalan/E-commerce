import { Snackbar, Alert } from "@mui/material";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity?: SnackbarSeverity;
  onClose: () => void;
}

const EcomSnackbar = ({
  open,
  message,
  severity = "info",
  onClose,
}: SnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ zIndex: 3000 }}
    >
      <Alert
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default EcomSnackbar;
