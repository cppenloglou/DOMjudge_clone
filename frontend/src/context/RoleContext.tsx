import {
  useState,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

export type RoleType = "ROLE_USER" | "ROLE_ADMIN" | null;

type RoleContextType = {
  role: RoleType;
  setRole: Dispatch<SetStateAction<RoleType>>;
};

export const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<RoleType>(() => {
    return (localStorage.getItem("role") as RoleType) || null;
  });

  const setRole: Dispatch<SetStateAction<RoleType>> = (newRole) => {
    console.log(newRole);
    setRoleState(newRole);
    if (typeof newRole === "string") {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => useContext(RoleContext);
