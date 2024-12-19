import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth(); // Accede al contexto

  if (isLoading) return <div>Cargando...</div>;

  // Verifica si el usuario está autenticado y si su rol está dentro de los permitidos
  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role))) {
    // Si no está autenticado o no tiene el rol adecuado, no redirige, solo retorna null
    return null; // Deberías manejar la lógica de mostrar algo alternativo (p. ej., un mensaje)
  }

  return children;
};

export default PrivateRoute;
