import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#6200ea",
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: "#333",
                    borderRadius: "0.75rem !important",
                    border: "1px solid #6200ea",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& fieldset": {
                        border: "1px solid transparent !important"
                    },
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "var(--purpur-primary-color)",
                    background: "var(--purpur-body-background)",
                    padding: '0 0.5rem',
                    "&.Mui-focused": {
                        color: "var(--purpur-primary-color)",
                        background: "var(--purpur-body-background)",
                        padding: '0 0.5rem'
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    background: "var(--purpur-primary-color)",
                    color: "var(--purpur-body-background)",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    "&.hover": {
                        background: "var(--purpur-primary-color)",
                    },
                    "&.btn--primary-light": {
                        background: "var(--purpur-color-background-interactive-primary-negative)",
                        color: "var(--purpur-color-text-interactive-on-primary-negative)",
                        border: "1px solid transparent",
                        borderRadius: "40px"
                    }
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "transparent",
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: "var(--purpur-body-background)",
                    boxShadow: "none"
                }
            }
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    "& > svg": {
                        fill: "var(--purpur-primary-color)"
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&.employee-card": {
                        background: theme.palette.mode === "light"
                            ? "var(--purpur-color-transparent-black-50)"
                            : "var(--purpur-color-transparent-black-300)",
                        boxShadow: "none",
                        borderRadius: "var(--purpur-border-radius-lg)"
                    }
                })
            }
        }
    }
},
);

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
    },
    components: lightTheme.components,
});
