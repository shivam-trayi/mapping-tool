import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user) {
    // 🔥 If not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};
