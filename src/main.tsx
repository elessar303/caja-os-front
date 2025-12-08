import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CustomThemeProvider } from "./context/theme";
import { AppProvider } from "./context/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </CustomThemeProvider>
  </StrictMode>
);
