import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, getUserProfile } from '../service/authService';

// Estendi l'interfaccia UserData per includere più informazioni del profilo
interface UserData {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  // Aggiungi altri campi del profilo se necessario
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  userProfile: any | null; // Aggiungi userProfile al contesto
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  loadUserProfile: () => Promise<void>; // Nuova funzione
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const navigate = useNavigate();

  // Funzione per caricare il profilo utente
  const loadUserProfile = async (): Promise<void> => {
    if (!token) return;

    try {
      const profileData = await getUserProfile(token);
      console.log('Profilo utente caricato:', profileData);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Errore nel caricamento del profilo:', error);
      // Non fare logout per evitare cicli, solo log dell'errore
    }
  };

  // Modifica la funzione login per caricare il profilo dopo il login
  const login = async (email: string, password: string) => {
    const response = await apiLogin({ email, password });
    const newToken = response.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);

    // Carica il profilo dopo il login
    await loadUserProfile();

    navigate('/home');
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserProfile(null); // Cancella anche i dati del profilo
    navigate('/login');
  };

  // Controlla la scadenza del token e carica il profilo utente all'avvio
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decoded: { exp: number } = jwtDecode(token); // Decodifica il token
          const now = Math.floor(Date.now() / 1000); // Tempo attuale in secondi

          if (decoded.exp < now) {
            alert('Token scaduto, rimuovendo...');
            console.log('Token scaduto, rimuovendo...');
            localStorage.removeItem('token'); // Cancella il token scaduto
            navigate('/login');
          }
        } catch (error) {
          console.error('Errore nella decodifica del token', error);
          localStorage.removeItem('token'); // Rimuove il token se non valido
        }
      }
    };

    const initializeAuth = async () => {
      if (token) {
        checkTokenExpiration();
        await loadUserProfile(); // Carica il profilo all'avvio se c'è un token
      }
    };

    initializeAuth();

    // Controlla il token ogni minuto
    const interval = setInterval(checkTokenExpiration, 60 * 1000);
    return () => clearInterval(interval);
  }, [token]); // Aggiungi token come dipendenza

  const user: UserData | null = token ? jwtDecode<UserData>(token) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userProfile, // Aggiungi userProfile al contesto
        setToken,
        login,
        logout,
        isAuthenticated: !!token,
        loadUserProfile, // Esponi la funzione di caricamento
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
