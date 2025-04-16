import { useAuth } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
