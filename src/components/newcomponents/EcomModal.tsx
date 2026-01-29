import { Modal, Box, IconButton, Fade, Backdrop, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";

interface EcomModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string | number;
    maxWidth?: string | number;
}

const EcomModal = ({
    open,
    onClose,
    title,
    children,
    width = 400,
    maxWidth = "90vw",
}: EcomModalProps) => {
    const theme = useTheme();

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        backdropFilter: "blur(6px)",
                        backgroundColor: "rgba(0,0,0,0.3)",
                    },
                },
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: width,
                        maxWidth: maxWidth,
                        bgcolor: "background.paper",
                        boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
                        borderRadius: "20px",
                        outline: "none",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* HEADER */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 3,
                            py: 2,
                            background: theme.palette.mode === "dark"
                                ? "linear-gradient(135deg, #2D3436 0%, #000000 100%)"
                                : "linear-gradient(135deg, #ffbebe 0%, #ffdfdf 100%)",
                            color: theme.palette.mode === "dark" ? "#fff" : "#000",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                            {title}
                        </Typography>
                        <IconButton onClick={onClose} size="small" sx={{ color: "inherit", opacity: 0.7, '&:hover': { opacity: 1 } }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* CONTENT */}
                    <Box sx={{ p: 3, maxHeight: "85vh", overflowY: "auto" }}>
                        {children}
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default EcomModal;
