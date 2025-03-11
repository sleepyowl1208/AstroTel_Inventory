import { Brightness4, Brightness7, Logout } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/ThemeContext";
import AppLogo from "../AppLogo/AppLogo";
import SearchComponent from "../Search/SearchComponent";

const AppHeader = () => {
    const { toggleTheme, mode, setMode } = useThemeContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setMode("light"); // Reset theme to light mode on logout
        navigate("/login", { replace: true });
    };

    return (
        <AppBar position="static" sx={{ mb: 2, px: 2 }}>
            <Toolbar sx={{
                diplay: "flex",
                justifyContent: "space-between"
            }}>
                <AppLogo px={0} py={2} />
                <SearchComponent />
                <div>
                    <IconButton onClick={toggleTheme} className="appbar-icons">
                        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    <IconButton onClick={handleLogout}>
                        <Logout />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
