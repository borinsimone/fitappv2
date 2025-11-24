import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
}

interface GlobalContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context
const GlobalContext = createContext<
  GlobalContextType | undefined
>(undefined);

// Create a provider component
interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<
  GlobalProviderProps
> = ({ children }) => {
  // Add your state management here
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const value = {
    isLoading,
    setIsLoading,
    user,
    setUser,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalProvider"
    );
  }
  return context;
};
