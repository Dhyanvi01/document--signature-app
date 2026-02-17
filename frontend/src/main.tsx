import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// ✅ ADD THESE TWO LINES
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
