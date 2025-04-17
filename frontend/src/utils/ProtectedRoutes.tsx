import { useAuth } from "@/context/AuthContext";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for AuthContext to finish loading
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.hasRegisteredTeam && location.pathname !== "/team-registration") {
    return <Navigate to="/team-registration" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
