import { createTheme, type Theme } from "@mui/material/styles";

/**
 * Crea un tema de Material-UI basado en el modo dark/light
 * @param darkMode - Si el tema es oscuro o claro
 * @returns Tema de Material-UI
 */
export const createMuiTheme = (darkMode: boolean): Theme => {
  return createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      error: {
        main: darkMode ? "#ef4444" : "#dc2626",
      },
      success: {
        main: darkMode ? "#10b981" : "#059669",
      },
      background: {
        default: darkMode ? "#0f172a" : "#f8fafc",
        paper: darkMode ? "#1e293b" : "#ffffff",
      },
    },
  });
};
