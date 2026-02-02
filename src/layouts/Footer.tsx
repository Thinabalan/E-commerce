import { Box, Grid, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import { useTheme } from "../context/MuiThemeProvider";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 5,
        py: 3,
        boxShadow: 3,
        bgcolor: isDark ? "grey.900" : "background.paper",
        color: isDark ? "grey.100" : "text.primary",
      }}
    >
      <Grid
        container
        spacing={3}
        alignItems="flex-start"
        px={{ xs: 2, md: 3 }}
      >
        {/* Brand */}
        <Grid size={{ xs: 12, md: 4 }} >
          <Typography variant="h6" fontWeight="bold">
            Sellee
          </Typography>
          <Typography variant="body2">
            Your one-stop ecommerce destination
          </Typography>
        </Grid>

        {/* Contact */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
            Contact Us
          </Typography>
          <Typography variant="body2">Email: sellee@gmail.com</Typography>
          <Typography variant="body2">Phone: +91 98765 43210</Typography>
        </Grid>

        {/* Social */}
        <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "left", md: "right" }}>
          <Box
            display="flex"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            gap={1}
          >
            <IconButton color="inherit">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit">
              <InstagramIcon />
            </IconButton>
            <IconButton color="inherit">
              <XIcon />
            </IconButton>
          </Box>

          <Typography variant="caption" display="block" mt={1}>
            © {new Date().getFullYear()} Sellee. All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
