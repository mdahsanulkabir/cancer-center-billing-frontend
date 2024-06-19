/* eslint-disable react/prop-types */
import { Typography, Box, useTheme } from "@mui/material";
import { colorTokens } from "../utils/theme/colorTokens";

const Header2 = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h4"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h6" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header2;