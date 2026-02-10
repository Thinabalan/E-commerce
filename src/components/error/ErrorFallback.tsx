import { Box, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { FallbackProps } from "react-error-boundary";
import EcomButton from "../newcomponents/EcomButton";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    const message =
        error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                textAlign: "center",
                p: 3
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 4,
                    gap: 2,
                }}
            >
                    <ErrorOutlineIcon color="error" fontSize="large" />
                    <Typography variant="h5" fontWeight={700} color="error">
                        Something went wrong
                    </Typography>
                    <Typography variant="body1" color="text.secondary" >
                        {message || "An unexpected error occurred."}
                    </Typography>
                    <EcomButton
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={resetErrorBoundary}
                        label="Try Again"
                    />
            </Paper>
        </Box>
    );
};

export default ErrorFallback;
