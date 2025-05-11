import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/screens/loading";

const AdminRoute = () => {
  const { loading, token, role } = useAuth();

  if (loading) {
    return <Loading size="large" overlay={true} />;
  }

  if (!token || role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />; // 👈 redirect normal users to home (or 403 page)
  }

  return <Outlet />;
};

export default AdminRoute;
