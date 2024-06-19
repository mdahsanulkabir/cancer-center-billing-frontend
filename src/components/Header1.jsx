/* eslint-disable react/prop-types */
import { Typography, Box, useTheme } from "@mui/material";
import { colorTokens } from "../utils/theme/colorTokens";

const Header1 = ({ title, subtitle }) => {
    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);
    return (
        <Box mb="30px">
            <Typography
                variant="h2"
                color={colors.oliveAccent[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
            >
                {title}
            </Typography>
            <Typography variant="h5" color="#2d2fc0">
                {subtitle}
            </Typography>
        </Box>
    );
};

export default Header1;