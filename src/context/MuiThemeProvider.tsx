import { type ReactNode, useMemo } from "react";
import { ThemeProvider as MuiProvider, CssBaseline } from "@mui/material";
import { useTheme } from "./ThemeContext";
import { MuiTheme } from "../config/MuiTheme";

interface Props {
    children: ReactNode;
}

export const MuiThemeProvider = ({ children }: Props) => {
    const { isDark } = useTheme();

    const theme = useMemo(() => {
        return MuiTheme(isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <MuiProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiProvider>
    );
};
