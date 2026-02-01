import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StoreIcon from "@mui/icons-material/Store";
import TableChartIcon from "@mui/icons-material/TableChart";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FavoriteIcon from "@mui/icons-material/Favorite";

interface SidebarProps {
    open: boolean;
    onSellClick: () => void;
}

const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 65;

export default function Sidebar({ open, onSellClick, onClose }: SidebarProps & { onClose: () => void }) {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Home", icon: <HomeIcon />, path: "/" },
        { text: "All Products", icon: <Inventory2Icon />, path: "/products" },
        { text: "Become a Seller", icon: <StoreIcon />, onClick: onSellClick },
        { text: "Product Table", icon: <TableChartIcon />, path: "/producttable" },
        { text: "Registration Form", icon: <AppRegistrationIcon />, path: "/form" },
        { text: "Registration List", icon: <SummarizeIcon />, path: "/registrations" },
        { text: "Favorites", icon: <FavoriteIcon />, path: "/favourites" },
    ];

    const drawerContent = (
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
    );

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
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
                    display: { xs: 'block', md: 'none' },
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
