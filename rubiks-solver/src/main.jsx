import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";   // ← THIS IS REQUIRED
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);