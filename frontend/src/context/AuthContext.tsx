// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import API from "@/services/api";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BASE_URL + "/auth";

export type MyJwtPayload = {
  exp: number;
  iat: number;
  id: number;
  sub: string;
  team_id: number;
  type: String;
};

export interface User {
  id: string;
  email: string;
  hasRegisteredTeam: boolean | null | undefined;
}

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

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
    if (token) {
      if (isTokenExpired(token)) {
        refresh();
      }
    }
    setLoading(false);
  }, [token]);

  const refresh = () => {
    setLoading(true);
    axios
      .post(`${API_URL}/refresh`, refreshToken, { withCredentials: true })
      .then((response) => {
        const newToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        setToken(newToken);
        setRefreshToken(newRefreshToken);

        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
      })
      .catch((error) => {
        console.error("Error refreshing token:", error);
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const login = (data: any) => {
    setLoading(true);

    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    console.log("Login data:", data);

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("token", data.accessToken);
    }

    setLoading(false);
  };

  const logout = async () => {
    try {
      await API.post(`${API_URL}/logout`, refreshToken);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }

    setToken(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
