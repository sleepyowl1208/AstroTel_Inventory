import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Box, Card, CardContent, Chip, Typography, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';

const ticketsData = [
    {
        label: "New Tickets",
        value: 80,
        icon: <FolderIcon />,
    },
    {
        label: "Open Tickets",
        value: 100,
        icon: <FolderOpenIcon />,
    },
    {
        label: "Pending Tickets",
        value: 70,
        icon: <HourglassEmptyIcon />,
    },
    {
        label: "Closed Tickets",
        value: 30,
        icon: <CheckCircleIcon />,
    },
]

const TicketAnalytics = () => {
    const theme = useTheme();
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between"
        }}>
            {/* Header */}
            <Grid
                size={3}
                container
                alignItems="center"
                spacing={0}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    background: theme.palette.mode === "light" ? "var(--purpur-color-red-50)" : "var(--purpur-color-red-900)",
                    borderRadius: "2rem",
                    padding: "2rem",
                }}>
                <Typography variant="h5" fontWeight="400">
                    This month's ticket
                </Typography>
                <Box />

                {/* Total Tickets */}
                <Grid container spacing={1} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" fontWeight="bold">
                        280 tickets
                    </Typography>
                    <Box sx={{ display: "flex", borderRadius: "8px", px: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Chip color="error" variant="filled" size="small" label="8%" />
                                <ArrowUpwardIcon fontSize="small" sx={{ color: "red" }} />
                            </Box>
                        </Typography>
                    </Box>
                </Grid>
                <Typography variant="body2" color="text.secondary">
                    than last month: <b>119 tickets</b>
                </Typography>
            </Grid>
            {/* Ticket Categories */}
            <Grid container size={9} sx={{
                background: theme.palette.mode === "light"
                    ? "var(--purpur-color-orange-100)"
                    : "var(--purpur-color-orange-900)",
                borderRadius: "2rem",
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="400" sx={{ p: 2 }}>
                        Other Tickets
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    {ticketsData.map((ticket, index) => (
                        <Card key={index} sx={{
                            textAlign: "left",
                            background: theme.palette.mode === "light"
                                ? "var(--purpur-color-orange-100)"
                                : "var(--purpur-color-ornage-900)",
                        }}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        mb: 1,
                                    }}>
                                    {ticket.icon}
                                </Box>
                                <Typography sx={{
                                    color: theme.palette.mode === "light"
                                        ? "var(--purpur-color-orange-900)"
                                        : "var(--purpur-color-orange-100)",
                                }}>
                                    {ticket.label}
                                </Typography>
                                <Typography
                                    variant="h3"
                                    fontWeight="bold">
                                    {ticket.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Grid>
        </Box >
    );
};

export default TicketAnalytics;
