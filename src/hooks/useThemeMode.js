import { createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { themeSettings } from "../utils/theme/themeSettings";

export const useThemeMode = () => {
    const [mode, setMode] = useState("light");
  
    const colorMode = useMemo(
      () => ({
        toggleColorMode: () =>
          setMode((prev) => (prev === "light" ? "dark" : "light")),
      }),
      []
    );
  
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
  };