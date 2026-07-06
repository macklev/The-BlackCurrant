import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../apiService';

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
