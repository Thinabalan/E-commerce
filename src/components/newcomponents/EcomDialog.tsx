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

import type { SxProps, Theme } from "@mui/material";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  paperSx?: SxProps<Theme>;
  backdropBlur?: boolean;
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
  children,
  maxWidth = "sm",
  fullWidth = false,
  paperSx,
  backdropBlur = false,
}: DialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          sx: paperSx,
        },
        backdrop: {
          sx: backdropBlur
            ? {
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(0,0,0,0.5)",
            }
            : {},
        },
      }}
      sx={{ zIndex: 2000, }}>

      {/* HEADER */}
      {title && (
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1}>
            <DialogTitle sx={{ p: 0 }}>
              {title}
            </DialogTitle>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* BODY */}
      {children ? (
        children
      ) : (
        <>
          {/* CONTENT */}
          <DialogContent sx={{ p: 3 }}>
            {description && (
              <DialogContentText>{description}</DialogContentText>
            )}
          </DialogContent>

          {/* ACTIONS */}
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                onClick={onConfirm}
                variant="contained"
                color="success"
                disabled={loading}
              >
                {loading ? "Processing..." : confirmText}
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default EcomDialog;
