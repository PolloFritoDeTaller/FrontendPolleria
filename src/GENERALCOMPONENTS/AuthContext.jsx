import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, logoutRequest, validateTokenRequest, refreshTokenRequest } from "../api/authentication";
import Cookies from "js-cookie";
import { useCart } from "../CONTEXTS/cartContext";
import { useNavigate } from "react-router-dom"; // Añadir useNavigate

// Creamos el contexto de autenticación
export const AuthContext = createContext();

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Componente que provee el contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token") || localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCart();
  const navigate = useNavigate();  // Hook para navegación

  // Función para iniciar sesión
  const signIn = async (data) => {
    try {
      const res = await loginRequest(data, { withCredentials: true });

      if (res && res.data) {
        const { foundUser, token, refreshToken } = res.data;

        // Guardamos el usuario y los tokens en localStorage y cookies
        localStorage.setItem("user", JSON.stringify({
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        }));
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        const isSecure = process.env.NODE_ENV === 'production';  // Solo en producción se usa 'secure: true'
        Cookies.set("token", token, { expires: 1, secure: isSecure, sameSite: "None" });
        Cookies.set("refreshToken", refreshToken, { expires: 7, secure: isSecure, sameSite: "None" });

        setUser({
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        });
        setIsAuthenticated(true);
      }
      return res;
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
      return { isError: true, error: e };
    }
  };

  // Función para cerrar sesión
  const logOut = async () => {
    try {
      await logoutRequest();
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      clearCart();
      navigate("/login");  // Redirigir al login tras cerrar sesión
    } catch (e) {
      console.log("Error al cerrar sesión:", e);
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  // Verificar el token y manejar refresh token
  useEffect(() => {
    const verifyJWT = async () => {
      const token = localStorage.getItem("token") || Cookies.get("token");
      const refreshToken = localStorage.getItem("refreshToken") || Cookies.get("refreshToken");

      if (!token || !refreshToken) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verifica si el access token es válido
        const res = await validateTokenRequest();

        if (res && res.data) {
          const userData = {
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role,
          };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          // Si el token ha expirado, se refresca el token
          const refreshRes = await refreshTokenRequest(refreshToken);
          if (refreshRes && refreshRes.data) {
            const { token: newToken, refreshToken: newRefreshToken } = refreshRes.data;

            // Guardamos los nuevos tokens en localStorage y cookies
            const isSecure = process.env.NODE_ENV === 'production';
            Cookies.set("token", newToken, { expires: 1, secure: isSecure, sameSite: "None" });
            Cookies.set("refreshToken", newRefreshToken, { expires: 7, secure: isSecure, sameSite: "None" });
            localStorage.setItem("token", newToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            const userData = {
              name: refreshRes.data.name,
              email: refreshRes.data.email,
              role: refreshRes.data.role,
            };

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Si no se puede refrescar el token, cerramos la sesión
            setUser(null);
            setIsAuthenticated(false);
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigate("/login");  // Redirigir al login si no se puede refrescar el token
          }
        }
      } catch (error) {
        console.error("Error al verificar JWT:", error);
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");  // Redirigir al login si ocurre un error
      } finally {
        setIsLoading(false);
      }
    };

    verifyJWT();
  }, []); // Este efecto solo se ejecutará una vez al inicio

  return (
    <AuthContext.Provider value={{
      signIn,
      logOut,
      updateUser,
      user,
      isAuthenticated,
      isLoading,
    }}>
      {!isLoading ? children : <div>Cargando...</div>}
    </AuthContext.Provider>
  );
};
