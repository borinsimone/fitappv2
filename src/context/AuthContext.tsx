import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  login as apiLogin,
  getUserProfile,
  updateProfile as apiUpdateProfile,
  deleteAccount as apiDeleteAccount,
} from "../service/authService";

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
  userProfile: UserData | null;
  setToken: (token: string | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ token: string; user: UserData }>;
  logout: () => void;
  isAuthenticated: boolean;
  loadUserProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserData>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userProfile, setUserProfile] =
    useState<UserData | null>(null);
  const navigate = useNavigate();

  // Funzione per caricare il profilo utente
  const loadUserProfile =
    useCallback(async (): Promise<void> => {
      if (!token) return;

      try {
        const profileData = await getUserProfile(token);
        console.log(
          "Profilo utente caricato:",
          profileData
        );
        setUserProfile(profileData);
      } catch (error) {
        console.error(
          "Errore nel caricamento del profilo:",
          error
        );
        // Non fare logout per evitare cicli, solo log dell'errore
      }
    }, [token]);

  // Modifica la funzione login per caricare il profilo dopo il login
  const login = async (email: string, password: string) => {
    const response = await apiLogin({ email, password });
    const newToken = response.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Carica il profilo dopo il login
    await loadUserProfile();

    navigate("/home");
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserProfile(null); // Cancella anche i dati del profilo
    navigate("/login");
  };

  const updateProfile = async (data: Partial<UserData>) => {
    if (!token) return;
    try {
      await apiUpdateProfile(data, token);
      await loadUserProfile(); // Ricarica il profilo aggiornato
    } catch (error) {
      console.error(
        "Errore nell'aggiornamento del profilo:",
        error
      );
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!token) return;
    try {
      await apiDeleteAccount(token);
      logout();
    } catch (error) {
      console.error(
        "Errore nell'eliminazione dell'account:",
        error
      );
      throw error;
    }
  };

  // Controlla la scadenza del token e carica il profilo utente all'avvio
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded: { exp: number } = jwtDecode(token); // Decodifica il token
          const now = Math.floor(Date.now() / 1000); // Tempo attuale in secondi

          if (decoded.exp < now) {
            alert("Token scaduto, rimuovendo...");
            console.log("Token scaduto, rimuovendo...");
            localStorage.removeItem("token"); // Cancella il token scaduto
            navigate("/login");
          }
        } catch (error) {
          console.error(
            "Errore nella decodifica del token",
            error
          );
          localStorage.removeItem("token"); // Rimuove il token se non valido
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
    const interval = setInterval(
      checkTokenExpiration,
      60 * 1000
    );
    return () => clearInterval(interval);
  }, [token, loadUserProfile, navigate]); // Aggiungi tutte le dipendenze

  const user: UserData | null = token
    ? jwtDecode<UserData>(token)
    : null;

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
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }
  return context;
};
