import { Brightness4, Brightness7, Logout, Search } from "@mui/icons-material";
import { AppBar, IconButton, InputAdornment, TextField, Toolbar } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/ThemeContext";
import AppLogo from "../AppLogo/AppLogo";

const AppHeader = () => {
    const { toggleTheme, mode, setMode } = useThemeContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setMode("light"); // Reset theme to light mode on logout
        navigate("/login", { replace: true });
    };

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            const response = await axios.get(`/customers/search`, { params: { query: searchQuery } });

            if (response.data) {
                navigate(`customer-details/${response.data.accountID}`);
            } else {
                //TODO : Add Stackbar
                alert("Customer not found");
            }
        } catch (error) {
            console.error("Search error:", error);
            //TODO : Add Stackbar
            alert("Error searching customer");
        }
    }

    return (
        <AppBar position="static" sx={{ mb: 2, px: 2 }}>
            <Toolbar sx={{
                diplay: "flex",
                justifyContent: "space-between"
            }}>
                <AppLogo px={0} py={2} />
                {/* Search Input */}
                <form onSubmit={handleSearch}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Search Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </form>
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
