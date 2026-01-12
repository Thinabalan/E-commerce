import { createTheme, type PaletteMode } from "@mui/material";

export const getAppTheme = (mode: PaletteMode) => {
    return createTheme({
        palette: {
            mode,
            primary: {
                main: "#2563eb",
            },
        },
        components: {
            /* DIALOG TITLE BORDER */
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        borderBottom: "1px solid rgba(0,0,0,0.12)",
                        padding: "16px 24px",
                        fontWeight: 700,
                    },
                },
            },
            /* DIALOG ACTIONS BORDER */
            MuiDialogActions: {
                styleOverrides: {
                    root: {
                        borderTop: "1px solid rgba(0,0,0,0.12)",
                        backgroundColor: "rgba(0,0,0,0.02)",
                        padding: "16px 24px",
                    },
                },
            },
            /* TAB STYLING */
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontWeight: 600,
                    },
                },
            },
            /* TABLE HEADER STYLING */
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: "bold",
                        backgroundColor: "#fafafa",
                        whiteSpace: "nowrap",
                        zIndex: 1,
                    },
                },
            },
            /* PAGINATION STYLING */
            MuiTablePagination: {
                styleOverrides: {
                    toolbar: {
                        minHeight: 60,
                        paddingTop: 0,
                        paddingBottom: 0,
                    },
                    selectLabel: {
                        margin: 0,
                    },
                    displayedRows: {
                        margin: 0,
                    },
                },
            },
        },
    });
};
