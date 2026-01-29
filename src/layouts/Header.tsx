import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import Login from "../pages/authentication/Login";
import Signup from "../pages/authentication/Signup";
import EcomDialog from "../components/newcomponents/EcomDialog";
import SellProductForm from "../pages/sellproductform/SellProductForm";
import { useSnackbar } from "../context/SnackbarContext";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  InputBase,
  Paper,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Container
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StoreIcon from "@mui/icons-material/Store";
import TableChartIcon from "@mui/icons-material/TableChart";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SummarizeIcon from '@mui/icons-material/Summarize';

interface User {
  name: string;
  email: string;
}

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showSellModal, setShowSellModal] = useState(false);

  // MUI Menu State
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Search State
  const [searchValue, setSearchValue] = useState("");

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  // Drawer Content
  const drawerContent = (
    <Box sx={{ width: 250, height: '100%', bgcolor: isDark ? '#121212' : '#ffbebe', color: isDark ? '#fff' : '#000' }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Menu</Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate("/"); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate("/products"); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Inventory2Icon /></ListItemIcon>
            <ListItemText primary="All Products" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setShowSellModal(true); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><StoreIcon /></ListItemIcon>
            <ListItemText primary="Become a Seller" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate("/producttable"); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><TableChartIcon /></ListItemIcon>
            <ListItemText primary="Product Table" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate("/form"); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><AppRegistrationIcon /></ListItemIcon>
            <ListItemText primary="Registration Form" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { navigate("/registrations"); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><SummarizeIcon /></ListItemIcon>
            <ListItemText primary="Registration List" />
          </ListItemButton>
        </ListItem>

        {/* Mobile Only: Favourites & Theme */}
        <ListItem disablePadding sx={{ display: { lg: 'none' } }}>
          <ListItemButton onClick={() => { navigate("/favourites"); handleDrawerToggle(); }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><FavoriteIcon /></ListItemIcon>
            <ListItemText primary="Favourites" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ display: { lg: 'none' }, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch checked={isDark} onChange={toggleTheme} />
            <Typography sx={{ ml: 1 }}>{isDark ? "Dark Mode" : "Light Mode"}</Typography>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

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
        <Toolbar sx={{ py: 1 }}>
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', px: { xs: 1, sm: 2 } }}>

            {/* HAMBURGER MENU */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
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
                p: '2px 4px',
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

              {/* DESKTOP FAVOURITES */}
              <Button
                component={Link}
                to="/favourites"
                sx={{ display: { xs: 'none', lg: 'flex' }, color: 'inherit', textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
                startIcon={<FavoriteIcon sx={{ fontSize: '1.2rem !important' }} />}
              >
                Favourites
              </Button>

              {/* CART */}
              <Button
                component={Link}
                to="/cart"
                sx={{ color: 'inherit', textTransform: 'none', fontWeight: 600, minWidth: 'auto', fontSize: '1rem' }}
              >
                <ShoppingCartIcon sx={{ mr: 1, fontSize: '1.2rem !important' }} />
                Cart
              </Button>

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
                  <Button
                    onClick={handleOpenUserMenu}
                    sx={{ color: 'inherit', textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
                    endIcon={<KeyboardArrowDownIcon />}
                    startIcon={<PersonIcon sx={{ fontSize: '1.2rem !important' }} />}
                  >
                    {user?.name}
                  </Button>
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
                <Button
                  onClick={() => handleOpenAuth("login")}
                  variant={isDark ? "outlined" : "contained"}
                  sx={{
                    bgcolor: isDark ? 'transparent' : '#ffbebe',
                    color: isDark ? 'white' : 'black',
                    fontSize: '1rem',
                    borderColor: 'white',
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#ffe3e3' }
                  }}
                  startIcon={<PersonIcon sx={{ fontSize: '1.2rem !important' }} />}
                >
                  Login
                </Button>
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

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* AUTH DIALOG */}
      <EcomDialog
        open={showAuth}
        onClose={() => setShowAuth(false)}
        title={authMode === "login" ? "Login" : "Create Account"}
        maxWidth="xs"
        headerSx={{
          bgcolor: 'secondary.main',
          color: 'white',
          '& .MuiTypography-root': { fontWeight: 'bold' },

        }}
      >
        <Box p={3}>
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
        </Box>
      </EcomDialog>

      <EcomDialog
        open={openLogoutDialog}
        title="Logout Confirmation"
        description="Are you sure you want to log out?"
        confirmText="Logout"
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={handleLogout}
      />

      <SellProductForm open={showSellModal} onClose={() => setShowSellModal(false)} />
    </>
  );
}
