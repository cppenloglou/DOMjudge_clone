import { useAuth } from "@/context/AuthContext";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { loading, token, role } = useAuth(); // role is now from merged AuthContext
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "ROLE_ADMIN" && location.pathname !== "/admin") {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
