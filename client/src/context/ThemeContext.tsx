import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "../styles/theme.tsx";

interface ThemeContextType {
    mode: "light" | "dark";
    toggleTheme: () => void;
    setMode: (mode: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderComponent = ({ children }: { children: React.ReactNode }) => {
    // Load theme from localStorage or default to "light"
    const [mode, setMode] = useState<"light" | "dark">(() => {
        return (localStorage.getItem("theme") as "light" | "dark") || "light";
    });

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    // Dynamically select the theme
    const theme = useMemo(() => (mode === "dark" ? darkTheme : lightTheme), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within ThemeProviderComponent");
    }
    return context;
};
