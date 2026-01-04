import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

const EcomDialog = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  loading = false,
}: DialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
        sx={{
    zIndex: 2000,
  }}
    >
      {/* HEADER */}
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1}>
        <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* CONTENT */}
      {description && (
        <DialogContent>
          <DialogContentText>
            {description}
          </DialogContentText>
        </DialogContent>
      )}

      {/* ACTIONS */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          disabled={loading}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EcomDialog;
