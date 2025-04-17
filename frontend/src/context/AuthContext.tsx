// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  email: string;
  hasRegisteredTeam: boolean | null | undefined;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);

  // Function to check if the token is expired
  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const expiry = decoded?.exp * 1000; // Convert expiry to milliseconds
      return expiry < Date.now();
    } catch (err) {
      return true; // If there's an error decoding, consider it expired
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
        }
      }
    }
    setLoading(false);
  }, [token]);

  const login = (data: any) => {
    setLoading(true);
    const token = data.accessToken;
    const newUser: User = {
      id: data.user.id,
      email: data.user.email,
      hasRegisteredTeam: !!data.user.team,
    };

    setToken(token);
    setUser(newUser);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
