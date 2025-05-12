import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { loading, token, role } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />; // 👈 redirect normal users to home (or 403 page)
  }

  return <Outlet />;
};

export default AdminRoute;
