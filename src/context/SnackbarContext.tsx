import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import EcomSnackbar, { type SnackbarSeverity } from "../components/newcomponents/EcomSnackbar";

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: SnackbarSeverity;
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = "info") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleClose = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <EcomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleClose}
            />
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};
