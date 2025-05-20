import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
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
  token: null,
  login: () => {},
  logout: () => {},
  loading: false,
  role: null,
  setRole: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );

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
  const isTokenExpired = (token: string, offsetSeconds = 60) => {
    try {
      const decoded: any = jwtDecode(token);
      const expiry = decoded?.exp * 1000;
      return expiry < Date.now() + offsetSeconds * 1000; // expire 1 minute early
    } catch (err) {
      return true;
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndRefresh = async () => {
      if (token) {
        if (isTokenExpired(token)) {
          await refresh();
        }
      }
      setLoading(false);
    };

    checkAndRefresh();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        refresh();
      }
    }, 60 * 1000); // check every 1 minute

    return () => clearInterval(interval); // cleanup
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);
  }, []);

  useLayoutEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        console.log("TOKEN does not exist refreshing...");
        try {
          const response = await authService.refresh();
          setToken(response.data.accessToken);
          console.log("TOKEN set: ", response.data.accessToken);
        } catch (error) {
          console.warn("User is not logged in or refresh token is invalid.");
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const refresh = () => {
    setLoading(true);
    authService
      .refresh()
      .then((response) => {
        const newToken = response.data.accessToken;

        setToken(newToken);

        localStorage.setItem("token", newToken);
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
    setLoading(true);
    const response = await authService
      .login(username, password)
      .then((response) => {
        setLoading(true);
        setToken(response.data.accessToken);
        setRoleState(response.data.user.roles[0]);

        if (response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("role", response.data.user.roles[0]);
        }

        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response.data &&
          error.response.data === "The contest hasn't started yet!" &&
          error.response.status === 400
        ) {
          throw new Error(error.response.data);
          return error.response.data;
        } else if (error.response.status === 401) {
          throw new Error("Login Failed check credentials");
        }
      })
      .finally(() => {
        setLoading(false);
      });
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      throw new Error("Logout failed");
    }

    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, loading, role, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
