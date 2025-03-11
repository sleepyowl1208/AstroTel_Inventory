import { Box, Card, Chip, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import UserAvatar from "./UserAvatar";

const Employee = () => {
    const theme = useTheme(); // Now properly gets the dark/light theme
    const name = useSelector((state: RootState) => state.auth.user.name);
    const role = useSelector((state: RootState) => state.auth.user.role);

    // Function to get appropriate greeting
    // const getGreeting = () => {
    //     const hour = new Date().getHours();
    //     if (hour < 12) return "Morning";
    //     if (hour < 18) return "Afternoon";
    //     return "Evening";
    // };

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
        <Box sx={{ flexGrow: 1 }}>
            <Grid>
                <Card
                    className="employee-card"
                    sx={{
                        p: 2,
                        background: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box>
                            <UserAvatar />
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            WebkitAlignItems: "flex-start"
                        }}>
                            {name && (
                                <Typography variant="h6" sx={{ px: 2, fontSize: "14px", fontWeight: "bold" }}>
                                    {name}
                                </Typography>
                            )
                            }
                            <Box sx={{ mx: 2 }}>
                                <Chip
                                    color="default"
                                    variant="filled"
                                    size="small"
                                    label={role && <Typography variant="h6" sx={{ fontSize: "12px" }} >{role}</Typography>}>
                                </Chip>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Box >
    );
};

export default Employee;
