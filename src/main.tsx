import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "styled-components";
import { globalTheme } from "./theme.ts";

const Root = () => {
  return (
    <ThemeProvider theme={globalTheme}>
      <App />
    </ThemeProvider>
  );
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
