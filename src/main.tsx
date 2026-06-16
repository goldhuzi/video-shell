import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./editor/App";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/editor.css";
import "./styles/hud.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
