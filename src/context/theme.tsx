import React, { createContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme, type AppTheme } from "../styles/theme";
import { createMuiTheme } from "../constants/themes";

interface ThemeContextProps {
  darkMode: boolean;
  toggleTheme: () => void;
  muiTheme: ReturnType<typeof createMuiTheme>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  darkMode: false,
  toggleTheme: () => {},
  muiTheme: createMuiTheme(false),
});

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true; // default dark
  });

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme: AppTheme = darkMode ? darkTheme : lightTheme;
  
  // Crear tema de MUI basado en darkMode
  const muiTheme = useMemo(() => createMuiTheme(darkMode), [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, muiTheme }}>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={muiTheme}>
          {children}
        </MuiThemeProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
