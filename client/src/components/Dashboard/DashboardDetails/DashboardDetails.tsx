import { Container, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';
import DashboardChat from "./DashboardChat";
import TicketAnalytics from "./TicketAnalytics";

export default function DashboardDetails() {
    const theme = useTheme();

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "2.5rem",
                            color: theme.palette.mode === "light"
                                ? "var(--purpur-color-purple-800)"
                                : "var(--purpur-color-purple-100)",
                            fontWeight: "600"
                        }}>Dashboard</Typography>
                </Grid>
                <Grid size={12}>
                    <TicketAnalytics />
                </Grid>
                <Grid size={12}>
                    <DashboardChat />
                </Grid>
            </Grid>
        </Container>
    )
}
