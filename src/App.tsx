import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import { WorkoutProvider } from './context/WorkoutContext';
import './index.css';

// Componente per gestire l'inizializzazione
const AppInitializer: React.FC = () => {
  const { loadUserProfile } = useAuth();

  useEffect(() => {
    // Carica il profilo utente all'avvio dell'app
    loadUserProfile();
  }, []);

  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <Router basename='/fitappv2'>
      <GlobalProvider>
        <AuthProvider>
          <WorkoutProvider>
            <AppInitializer />
          </WorkoutProvider>
        </AuthProvider>
      </GlobalProvider>
    </Router>
  );
};

export default App;
