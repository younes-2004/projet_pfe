// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./views/router.jsx"; // Chemin d'import correct
import { ContextProvider } from "./contexts/contextprovider.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} /> {/* Ici le routeur est injecté */}
    </ContextProvider>
  </React.StrictMode>
);