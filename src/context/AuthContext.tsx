import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/service/authService";
import { User, JwtPayload } from "@/types/authTypes";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            id: decoded.id,
            username: decoded.username,
            roleId: decoded.roleId,
          });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(username, password);
      const token = response.data.token;

      const decoded: JwtPayload = jwtDecode(token);
      const user: User = {
        id: decoded.id,
        username: decoded.username,
        roleId: decoded.roleId,
      };

      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast({ title: "Login successful", description: response.message });
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast({ title: "Login failed", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);
      const token = response.data.token;

      const decoded: JwtPayload = jwtDecode(token);
      const user: User = {
        id: decoded.id,
        username: decoded.username,
        roleId: decoded.roleId,
      };

      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast({ title: "Signup successful", description: response.message });
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      toast({ title: "Signup failed", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authService.forgotPassword(email);
      toast({
        title: "Request successful",
        description: response.message || "Check your email for reset link",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      toast({ title: "Failed", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const response = await authService.resetPassword(token, newPassword);
      toast({
        title: "Password reset successful",
        description: response.message,
      });
      navigate("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Reset failed";
      toast({ title: "Failed", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await authService.logout();
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast({ title: "Logout successful", description: response.message });
      navigate("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      toast({ title: "Logout failed", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
