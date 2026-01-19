import { Box, Grid, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import { useTheme } from "../context/ThemeContext";

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
        alignItems="center"
        ml={2}
        textAlign={{ xs: "center", md: "left" }}
      >
        {/* Brand */}
        <Grid size = {{ xs:12, md:4}} >
          <Typography variant="h6" fontWeight="bold">
            Sellee
          </Typography>
          <Typography variant="body2">
            Your one-stop ecommerce destination
          </Typography>
        </Grid>

        {/* Contact */}
        <Grid size = {{ xs:12, md:4}} textAlign="center">
          <Typography variant="subtitle2" fontWeight={600} mb={0.5}  >
            Contact Us
          </Typography>
          <Typography variant="body2">Email: sellee@gmail.com</Typography>
          <Typography variant="body2">Phone: +91 98765 43210</Typography>
        </Grid>

        {/* Social + Copyright */}
        <Grid size = {{ xs:12, md:4}}
          textAlign={{ xs: "center", md: "right" }}
        >
          <Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }} gap={1} mr={2}>
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

          <Typography variant="caption" display="block" mt={1} mr={2}>
            © {new Date().getFullYear()} Sellee. All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
