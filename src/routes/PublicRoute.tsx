import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (user) {
    // 🔥 If already logged in → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
