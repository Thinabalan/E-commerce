import { Box, Typography, Paper } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import EcomButton from "../../components/newcomponents/EcomButton";

const NotFound = () => {
    const navigate = useNavigate();

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
                    p: 6,
                    maxWidth: 500,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: 4,
                }}
            >
                <SearchOffIcon sx={{ fontSize: 80, color: "text.secondary", opacity: 0.5 }} />

                <Box>
                    <Typography variant="h3" fontWeight={800} color="primary" gutterBottom>
                        404
                    </Typography>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Page Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Oops! The page you are looking for doesn't exist or has been moved.
                    </Typography>
                </Box>

                <EcomButton
                    label="Back to Home"
                    variant="contained"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate("/")}
                />
            </Paper>
        </Box>
    );
};

export default NotFound;
