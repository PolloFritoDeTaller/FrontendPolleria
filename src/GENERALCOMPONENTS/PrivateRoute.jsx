import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


const PrivateRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, isLoading, user } = useAuth(); // Accede a `user` del contexto de autenticación
  
    if (isLoading) return <div>Cargando...</div>;
  
    // Verifica si el usuario está autenticado y si su rol está dentro de los permitidos
    return isAuthenticated && allowedRoles.includes(user?.role)
      ? children
      : <Navigate to="/index" />;
  };

export default PrivateRoute;