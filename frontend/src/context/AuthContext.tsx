import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "@/services/apiServices";

export type RoleType = "ROLE_USER" | "ROLE_ADMIN" | null;

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
  login: (username: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  role: RoleType;
  setRole: Dispatch<SetStateAction<RoleType>>;
}

export const AuthContext = createContext<AuthContextType>({
  get token() {
    return localStorage.getItem("token");
  },
  login: () => {},
  logout: () => {},
  loading: false,
  role: null,
  setRole: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<RoleType>(() => {
    return (localStorage.getItem("role") as RoleType) || null;
  });

  const setRole: Dispatch<SetStateAction<RoleType>> = (newRole) => {
    setRoleState(newRole);
    if (typeof newRole === "string") {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
    }
  };

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
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        refresh();
      }
    }
    setLoading(false);
  }, []);

  const refresh = () => {
    setLoading(true);
    authService
      .refresh(localStorage.getItem("refreshToken"))
      .then((response) => {
        const newToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

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

  const login = async (username: string, password: string) => {
    return await authService
      .login(username, password)
      .then(function (response) {
        setLoading(true);
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setRoleState(response.data.user.roles[0]);
        localStorage.setItem("role", response.data.user.roles[0]);
        setLoading(false);
      })
      .catch(function (error) {
        if (
          error.response.data &&
          error.response.data === "The contest hasn't started yet!" &&
          error.response.status === 400
        ) {
          console.log(error);
          throw new Error(error.response.data);
        } else if (error.response.status === 401) {
          throw new Error("Login Failed check credentials");
        }
      });
  };

  const logout = async () => {
    try {
      await authService.logout(localStorage.getItem("refreshToken"));
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }

    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRoleState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        get token() {
          return localStorage.getItem("token");
        },
        login,
        logout,
        loading,
        role,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
