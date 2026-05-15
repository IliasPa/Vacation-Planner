import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VacationPlanner from "./vacation-planner.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <VacationPlanner />
  </StrictMode>
);
