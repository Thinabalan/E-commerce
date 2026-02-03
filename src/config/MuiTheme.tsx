import { createTheme, type PaletteMode } from "@mui/material";

export const MuiTheme = (mode: PaletteMode) => {
    return createTheme({
        palette: {
            mode,
            primary: {
                main: "#2563eb",
            },
            background: {
                default: mode === 'dark' ? "#121212" : "#f5f7fa",
                paper: mode === 'dark' ? "#1e1e1e" : "#ffffff",
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
                    root: ({ theme }) => ({
                        textTransform: "none",
                        fontWeight: 600,
                        "&.Mui-selected": {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.04)",
                        },
                    }),
                },
            },
            /* TABLE HEADER STYLING */
            MuiTableCell: {
                styleOverrides: {
                    head: ({ theme }) => ({
                        fontWeight: "bold",
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#fafafa",
                        whiteSpace: "nowrap",
                        zIndex: 1,
                    }),
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
            /* BUTTON STYLING */
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                },
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "8px",
                        padding: "8px 16px",
                        minHeight: "42px",
                    },
                    sizeSmall: {
                        minHeight: "32px",
                        fontSize: "0.8125rem",
                    },
                    sizeLarge: {
                        minHeight: "48px",
                        fontSize: "1rem",
                        padding: "10px 24px",
                    },
                    startIcon: {
                        marginRight: "8px",
                        "& > *:nth-of-type(1)": {
                            fontSize: "1.25rem",
                        },
                    },
                    endIcon: {
                        marginLeft: "8px",
                        "& > *:nth-of-type(1)": {
                            fontSize: "1.25rem",
                        },
                    },
                },
            },
            /* LIST ITEM BUTTON STYLING */
            MuiListItemButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&.Mui-selected': {
                            bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(156, 39, 176, 0.12)',
                            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                            '&:hover': {
                                bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.2)'
                                    : '#ffbebe',
                            }
                        },
                        '&:hover': {
                            bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.04)',
                        }
                    })
                }
            },
        },
    });
};
