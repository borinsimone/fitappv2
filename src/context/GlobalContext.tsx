import React, { createContext, useContext, ReactNode, useState } from 'react';

// Define the type for your context state
interface GlobalContextType {
  // Add your global state properties here
  // Example:
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
}

// Create the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Create a provider component
interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  // Add your state management here
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();

  const value = {
    isLoading,
    setIsLoading,
    user,
    setUser,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
