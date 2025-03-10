import { Box } from "@mui/material";
import TeliaLogo from "../../assets/icons/telia_logo.svg";

interface PaddingProps {
    px: number;
    py: number;
}
const AppLogo = ({ px, py }: PaddingProps) => {
    return (
        <Box sx={{ px: px, py: py }}>
            <img src={TeliaLogo} className="official-logo" />
        </Box>
    );
};

export default AppLogo;
