import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import EcomDialog from "../components/newcomponents/EcomDialog";
import EcomSnackbar, { type SnackbarSeverity } from "../components/newcomponents/EcomSnackbar";
import type { SxProps, Theme } from "@mui/material";

interface DialogConfig {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    loading?: boolean;
    children?: React.ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    fullWidth?: boolean;
    fullScreen?: boolean;
    paperSx?: SxProps<Theme>;
    headerSx?: SxProps<Theme>;
    backdropBlur?: boolean;
}

interface UIContextType {
    showDialog: (config: DialogConfig) => void;
    hideDialog: () => void;
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
    hideSnackbar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    /* DIALOG STATE */
    const [dialog, setDialog] = useState<DialogConfig & { open: boolean }>({
        open: false,
        title: "",
        description: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        loading: false,
        maxWidth: "sm",
        fullWidth: false,
        fullScreen: false,
        backdropBlur: false,
    });

    /* SNACKBAR STATE */
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: SnackbarSeverity;
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    /* DIALOG HANDLERS */
    const showDialog = useCallback((config: DialogConfig) => {
        setDialog({
            open: true,
            ...config,
            confirmText: config.confirmText || "Confirm",
            cancelText: config.cancelText || "Cancel",
            maxWidth: config.maxWidth || "sm",
            fullWidth: config.fullWidth ?? false,
            fullScreen: config.fullScreen ?? false,
            backdropBlur: config.backdropBlur ?? false,
        });
    }, []);

    const hideDialog = useCallback(() => {
        setDialog((prev) => ({ ...prev, open: false }));
    }, []);

    const handleDialogConfirm = useCallback(() => {
        if (dialog.onConfirm) {
            dialog.onConfirm();
        }
        hideDialog();
    }, [dialog, hideDialog]);

    /* SNACKBAR HANDLERS */
    const showSnackbar = useCallback(
        (message: string, severity: SnackbarSeverity = "info") => {
            setSnackbar({ open: true, message, severity });
        },
        []
    );

    const hideSnackbar = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <UIContext.Provider value={{ showDialog, hideDialog, showSnackbar, hideSnackbar }}>
            {children}

            {/* GLOBAL DIALOG */}
            <EcomDialog
                open={dialog.open}
                title={dialog.title}
                description={dialog.description}
                confirmText={dialog.confirmText}
                cancelText={dialog.cancelText}
                onConfirm={dialog.onConfirm ? handleDialogConfirm : undefined}
                onClose={hideDialog}
                loading={dialog.loading}
                maxWidth={dialog.maxWidth}
                fullWidth={dialog.fullWidth}
                fullScreen={dialog.fullScreen}
                paperSx={dialog.paperSx}
                headerSx={dialog.headerSx}
                backdropBlur={dialog.backdropBlur}
            >
                {dialog.children}
            </EcomDialog>

            {/* GLOBAL SNACKBAR */}
            <EcomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={hideSnackbar}
            />
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within UIProvider");
    }
    return context;
};
