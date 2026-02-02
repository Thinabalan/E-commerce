import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as MuiProvider, CssBaseline } from "@mui/material";
import { MuiTheme } from "../config/MuiTheme";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  // load from storage immediately
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // apply to body + save
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const theme = useMemo(() => {
    return MuiTheme(isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <MuiProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside AppThemeProvider");
  }
  return context;
}
