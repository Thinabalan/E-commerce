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
      sx={{ zIndex: 2000,}}>
      {/* 
         If children are provided, we assume the consumer is handling 
         the entire layout (Composition).
         
         If NO children (or mixed usage), we render the "Simple Mode" 
         (Header + ContentText + Default Actions).
      */}

      {children ? (
        children
      ) : (
        <>
          {/* HEADER */}
          {title && (
            <Box px={2} py={1} borderBottom="1px solid rgba(0,0,0,0.1)">
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <DialogTitle sx={{ p: 0, fontWeight: "bold" }}>{title}</DialogTitle>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* CONTENT */}
          <DialogContent sx={{ p: 3 }}>
            {description && (
              <DialogContentText>{description}</DialogContentText>
            )}
          </DialogContent>

          {/* ACTIONS */}
          <DialogActions sx={{ px: 3, pb: 2 }}>
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
