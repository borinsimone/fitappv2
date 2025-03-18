import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  if (!token) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
