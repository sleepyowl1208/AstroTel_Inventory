import { Container } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useEffect } from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import DashboardDetails from "../../components/Dashboard/DashboardDetails/DashboardDetails";
import Employee from "../../components/Dashboard/Employee/Employee";


const Dashboard = () => {

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
        <>
            <AppHeader />
            <Container maxWidth={false}>
                <Grid container spacing={1}>
                    <Grid size={2}>
                        <Employee />
                    </Grid>
                    <Grid size={10}>
                        <DashboardDetails />
                    </Grid>
                </Grid>
            </Container>
        </>

    );
};

export default Dashboard;
