import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children, onLoginRequired }) => {
  // If no user, redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute;
