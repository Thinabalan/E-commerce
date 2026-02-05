import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/MuiThemeProvider";
import { useAuth } from "../context/AuthContext";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Switch,
    Tooltip,
    Typography,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StoreIcon from "@mui/icons-material/Store";
import TableChartIcon from "@mui/icons-material/TableChart";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { UserRole } from "../types/AuthenticationTypes";

interface SidebarProps {
    open: boolean;
    onSellClick: () => void;
}

const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 65;

export default function Sidebar({ open, onSellClick, onClose }: SidebarProps & { onClose: () => void }) {
    const { isDark , toggleTheme } = useTheme();
    const { user, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const allMenuItems = [
        { text: "Home", icon: <HomeIcon />, path: "/", roles: ['admin', 'seller', 'buyer'] },
        { text: "All Products", icon: <Inventory2Icon />, path: "/products", roles: ['admin', 'seller', 'buyer'] },
        { text: "Become a Seller", icon: <StoreIcon />, onClick: onSellClick, roles: ['admin', 'buyer'] },
        { text: "Product Table", icon: <TableChartIcon />, path: "/producttable", roles: ['admin'] },
        { text: "Registration Form", icon: <AppRegistrationIcon />, path: "/form", roles: ['admin', 'seller'] },
        { text: "Registration List", icon: <SummarizeIcon />, path: "/registrations", roles: ['admin'] },
        { text: "Favourites", icon: <FavoriteIcon />, path: "/favourites", roles: ['admin', 'seller', 'buyer'] },
    ];

    const menuItems = allMenuItems.filter(item => {
        if (!item.roles) return true;
        if (!user) return item.roles.includes('buyer'); 
        return hasRole(item.roles as UserRole[]);

    });

    const drawerContent = (
         <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List sx={{ mt: 1 }}>
            {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
                    <Tooltip title={!open ? item.text : ""} placement="right" disableHoverListener={open}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                if (item.path) navigate(item.path);
                                if (item.onClick) item.onClick();
                                onClose();
                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: { xs: "initial", md: open ? "initial" : "center" },
                                px: 4,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: { xs: 3, md: open ? 4 : "auto" },
                                    justifyContent: "center",
                                    color: "inherit",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    opacity: { xs: 1, md: open ? 1 : 0 },
                                    transition: "opacity 0.2s ease",
                                    display: { xs: "block", md: open ? "block" : "none" },
                                    "& .MuiTypography-root": {
                                        fontWeight: 600,
                                    },
                                }}
                            />
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            ))}
        </List>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Box sx={{ 
                px: 3, 
                pb: 3, 
                display: 'flex', 
                alignItems: 'center', 
            }}> 
                <Switch 
                    checked={isDark} 
                    onChange={toggleTheme} 
                    color="default" 
                />
                <Typography variant="body1" fontWeight={600}>
                    {isDark ? "Dark Mode" : "Light Mode"}
                </Typography>
            </Box>
        </Box>
    </Box>
    );

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    width: SIDEBAR_WIDTH_COLLAPSED,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
                        boxSizing: "border-box",
                        marginTop: "65px",
                        height: "calc(100% - 70px)",
                        transition: (theme) =>
                            theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        overflowX: "hidden",
                        bgcolor: isDark ? "#121212" : "#ffbebe",
                        color: isDark ? "#fff" : "#000",
                        borderRight: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
                        boxShadow: open ? "4px 0 10px rgba(0,0,0,0.1)" : "none", // Add shadow when expanded
                        zIndex: 1200,
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Sidebar for Mobile */}
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    "& .MuiDrawer-paper": {
                        width: SIDEBAR_WIDTH_EXPANDED,
                        boxSizing: "border-box",
                        bgcolor: isDark ? "#121212" : "#ffbebe",
                        color: isDark ? "#fff" : "#000",
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
}
