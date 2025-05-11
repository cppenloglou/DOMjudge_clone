import { useAuth } from "@/context/AuthContext";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Loading from "@/screens/loading";

const ProtectedRoutes = () => {
  const { loading, token, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading size="large" overlay={true} />;
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
