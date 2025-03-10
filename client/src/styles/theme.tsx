import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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
                    "& .MuiFocused": {

                    }
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
                    "&.MuiInputLabel-root": {
                        background: "var(--purpur-body-background)",
                    }
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
        }
    },
});

export default theme;
