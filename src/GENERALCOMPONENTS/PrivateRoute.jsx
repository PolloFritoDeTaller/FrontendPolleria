import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../GENERALCOMPONENTS/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role))) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado y tiene permiso, renderiza las rutas hijas
  return <Outlet />;
};

export default PrivateRoute;
