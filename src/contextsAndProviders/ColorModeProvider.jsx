/* eslint-disable react/prop-types */
import { ThemeProvider } from "@mui/material";
import { useThemeMode } from "../hooks/useThemeMode";
import { ColorModeContext } from "./contexts";


const ColorModeProvider = ({children}) => {
    const [ theme, colorMode ] = useThemeMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ColorModeProvider;