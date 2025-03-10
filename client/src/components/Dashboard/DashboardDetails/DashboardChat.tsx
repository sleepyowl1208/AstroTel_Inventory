import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import DashboardChatImg from "../../../assets/images/dashboard-chat-data.png";

export default function DashboardChat() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <img src={DashboardChatImg} alt="Dashboard Chat" width={"100%"} />
                </Grid>
            </Grid>
        </Box>
    );
}
