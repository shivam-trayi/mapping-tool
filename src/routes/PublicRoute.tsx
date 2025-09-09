import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
  children: JSX.Element;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // Don't force redirect on refresh; let the current URL render
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
