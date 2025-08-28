// src/routes/PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();

  // ✅ If logged in, prevent access to login/signup
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
