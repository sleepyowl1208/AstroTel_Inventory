import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

const Dashboard = () => {
    const navigate = useNavigate();
    const name = useSelector((state: RootState) => state.auth.user.name);
    const role = useSelector((state: RootState) => state.auth.user.role);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        // Prevent going back to dashboard after logout
        window.history.pushState(null, "", window.location.href);

        const blockBackNavigation = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", blockBackNavigation);

        return () => {
            window.removeEventListener("popstate", blockBackNavigation);
        };
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4">Dashboard</Typography>
                {/* {message && <Typography variant="h6" color="primary">{message}</Typography>} */}
                {name && <Typography variant="h6">Welcome, {name}! 😊</Typography>}
                {role && <Typography variant="subtitle1">Role: {role}</Typography>}
            </Box>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
