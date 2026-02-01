import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import EcomDialog from "../components/newcomponents/EcomDialog";
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

interface DialogContextType {
    showDialog: (config: DialogConfig) => void;
    hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

    const showDialog = useCallback((config: DialogConfig) => {
        setDialog({
            open: true,
            ...config,
            // Ensure defaults are set if not provided
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

    const handleClose = useCallback(() => {
        hideDialog();
    }, [hideDialog]);

    const handleConfirm = useCallback(() => {
        if (dialog.onConfirm) {
            dialog.onConfirm();
        }
        hideDialog();
    }, [dialog, hideDialog]);

    return (
        <DialogContext.Provider value={{ showDialog, hideDialog }}>
            {children}
            <EcomDialog
                open={dialog.open}
                title={dialog.title}
                description={dialog.description}
                confirmText={dialog.confirmText}
                cancelText={dialog.cancelText}
                onConfirm={dialog.onConfirm ? handleConfirm : undefined}
                onClose={handleClose}
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
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};
