import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { access_token, loading } = useSelector((state) => state.auth);

  if (loading) return <LoadingSpinner />;

  if (!access_token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AuthRoute = ({ children }) => {
  const { access_token, loading } = useSelector((state) => state.auth);

  if (loading) return <LoadingSpinner />;

  if (access_token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
