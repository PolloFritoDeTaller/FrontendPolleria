import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../GENERALCOMPONENTS/AuthContext";
import { Children } from "react";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  

  // Si el usuario está autenticado y tiene permiso, renderiza las rutas hijas
  return Children;
};

export default PrivateRoute;
