import { Navigate, Outlet } from "react-router-dom"; // Importamos Navigate y Outlet
import { useAuth } from "../CONTEXTS/AuthContext";  // Importamos el hook para acceder al contexto de autenticación

// Componente de Ruta Privada
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando o el usuario no está autenticado, redirigimos al login
  if (isLoading) {
    return <div>Cargando...</div>; // Puedes poner un spinner o algún mensaje mientras se verifica la autenticación
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirigimos al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostramos el contenido de la ruta
  return <Outlet />;
};

export default PrivateRoute;
