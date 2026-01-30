import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import Login from "../pages/authentication/Login";
import Signup from "../pages/authentication/Signup";
import EcomDialog from "../components/newcomponents/EcomDialog";
import { useSnackbar } from "../context/SnackbarContext";
import EcomModal from "../components/newcomponents/EcomModal";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  InputBase,
  Paper,
  Menu,
  MenuItem,
  Switch,
  Container
} from "@mui/material";

import EcomButton from "../components/newcomponents/EcomButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface User {
  name: string;
  email: string;
}

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // MUI Menu State
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Search State
  const [searchValue, setSearchValue] = useState("");

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    loadUser();
    window.addEventListener("auth-change", loadUser);
    return () => window.removeEventListener("auth-change", loadUser);
  }, []);

  const isLoggedIn = Boolean(user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    handleCloseUserMenu();
    setOpenLogoutDialog(false);
    navigate("/");
    showSnackbar("Logged out Successfully", "success");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/products?q=${searchValue}`);
    }
  };

  const handleOpenAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuth(true);
  };


  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          bgcolor: isDark ? '#121212' : '#ffbebe',
          color: isDark ? '#fff' : '#000',
          transition: 'background-color 0.3s'
        }}
      >
        <Toolbar>
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', px: { xs: 0, sm: 0 } }}>

            {/* HAMBURGER MENU */}
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2}}
              onClick={onMenuClick}
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {/* LOGO */}
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Sellee
            </Typography>

            {/* DESKTOP SEARCH */}
            <Paper
              component="form"
              sx={{
                p: '1px 4px',
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                width: 450,
                borderRadius: '20px',
                mx: 4,
                bgcolor: isDark ? '#333' : '#fff',
                color: isDark ? '#fff' : 'inherit'
              }}
              elevation={0}
              onSubmit={(e) => { e.preventDefault(); navigate(`/products?q=${searchValue}`); }}
            >
              <IconButton sx={{ p: '10px', color: isDark ? '#aaa' : '#666' }} aria-label="search">
                <SearchIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, color: 'inherit' }}
                placeholder="Search for products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e: any) => handleSearch(e)}
              />
            </Paper>

            {/* RIGHT SIDE ACTIONS */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1 } }}>

              {/* CART */}
              <EcomButton
                component={Link}
                label="Cart"
                startIcon={<ShoppingCartIcon sx={{ mr: 1, fontSize: '1.2rem !important' }} />}
                sx={{ color: 'inherit', textTransform: 'none', fontWeight: 600, minWidth: 'auto', fontSize: '1rem' }}
              />

              {/* THEME TOGGLE (Desktop) */}
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
                <Switch checked={isDark} onChange={toggleTheme} color="default" />
                <Typography variant="body2" fontWeight={600} fontSize='1rem' sx={{ ml: 0.2 }}>
                  {isDark ? "Dark" : "Light"}
                </Typography>
              </Box>

              {/* USER PROFILE / LOGIN */}
              {isLoggedIn ? (
                <Box>
                  <EcomButton
                    onClick={handleOpenUserMenu}
                    label={user?.name || ""}
                    sx={{ color: 'inherit', textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
                    endIcon={<KeyboardArrowDownIcon />}
                    startIcon={<PersonIcon sx={{ fontSize: '1.2rem !important' }} />}
                  />
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/profile"); }}>
                      <Typography textAlign="center">My Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); setOpenLogoutDialog(true); }}>
                      <Typography textAlign="center" color="error">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <EcomButton
                  onClick={() => handleOpenAuth("login")}
                  variant={isDark ? "outlined" : "contained"}
                  label="Login"
                  sx={{
                    bgcolor: isDark ? 'transparent' : '#ffbebe',
                    color: isDark ? 'white' : 'black',
                    fontSize: '1rem',
                    borderColor: 'white',
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#ffe3e3' }
                  }}
                  startIcon={<PersonIcon sx={{ fontSize: '1.2rem !important' }} />}
                />
              )}
            </Box>
          </Container>
        </Toolbar>

        {/* MOBILE SEARCH BAR (Visible only on xs/sm) */}
        <Box sx={{ display: { xs: 'block', lg: 'none' }, px: 2, pb: 2, width: '100%' }}>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              borderRadius: '18px',
              bgcolor: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : 'inherit'
            }}
            onSubmit={(e) => { e.preventDefault(); navigate(`/products?q=${searchValue}`); }}
          >
            <IconButton sx={{ p: '8px', color: isDark ? '#aaa' : '#666' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'inherit' }}
              placeholder="Search for products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e: any) => handleSearch(e)}
            />
          </Paper>
        </Box>
      </AppBar>


      {/* AUTH MODAL */}
      <EcomModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        title={authMode === "login" ? "Login" : "Create Account"}
      >
        {authMode === "login" ? (
          <Login
            onSuccess={() => setShowAuth(false)}
            switchToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <Signup
            onSwitchLogin={() => setAuthMode("login")}
          />
        )}
      </EcomModal>

      <EcomDialog
        open={openLogoutDialog}
        title="Logout Confirmation"
        description="Are you sure you want to log out?"
        confirmText="Logout"
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={handleLogout}
      />

    </>
  );
}
