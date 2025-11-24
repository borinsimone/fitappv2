import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { GlobalProvider } from "./context/GlobalContext";
import { WorkoutProvider } from "./context/WorkoutContext";
import "./index.css";

// Componente per gestire l'inizializzazione
const App: React.FC = () => {
  return (
    <Router basename="/fitappv2">
      <GlobalProvider>
        <AuthProvider>
          <WorkoutProvider>
            <AppRoutes />
          </WorkoutProvider>
        </AuthProvider>
      </GlobalProvider>
    </Router>
  );
};

export default App;
