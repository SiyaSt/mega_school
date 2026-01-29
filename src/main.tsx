import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProgressProvider } from "./context/UserProgressContext";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <UserProgressProvider>
          <App />
        </UserProgressProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
);
