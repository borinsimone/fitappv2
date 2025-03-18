import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Usa il percorso giusto
    }
  }, [token, navigate]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/home'); // Dopo il login, vai alla home
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login'); // Dopo il logout, torna al login
  };
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

    checkTokenExpiration(); // Controllo immediato all'avvio

    // Controlla il token ogni minuto
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, setToken, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
