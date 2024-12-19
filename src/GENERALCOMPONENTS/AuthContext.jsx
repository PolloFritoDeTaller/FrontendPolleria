import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, logoutRequest, validateTokenRequest, refreshTokenRequest } from "../api/authentication";
import Cookies from 'js-cookie';
import { useCart } from "../CONTEXTS/cartContext";

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
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token"));
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCart();

  const signIn = async (data) => {
    try {
      const res = await loginRequest(data, { withCredentials: true });


      if (res && res.data) {
        const { foundUser } = res.data;


        localStorage.setItem("user", JSON.stringify({
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        }));

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
      setUser(null);
      setIsAuthenticated(false);
      clearCart();
    } catch (e) {
      console.log("Error al cerrar sesión:", e);
    }
  };

  // Función para actualizar los datos del usuario
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData)); // Guardamos en localStorage
  };

  useEffect(() => {
    const verifyJWT = async () => {
      const token = Cookies.get("token");
      const refreshToken = Cookies.get("refreshToken");

      if (!token && !refreshToken) {

        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      try {
        // Intentamos validar el token existente
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
          const refreshRes = await refreshTokenRequest(refreshToken);

          if (refreshRes && refreshRes.data) {
            const { token: newToken, refreshToken: newRefreshToken } = refreshRes.data;

            // Guardamos los nuevos tokens en las cookies
            Cookies.set("token", newToken, { expires: 1 });
            Cookies.set("refreshToken", newRefreshToken, { expires: 7 });

            // Actualizamos los datos del usuario
            const userData = {
              name: refreshRes.data.name,
              email: refreshRes.data.email,
              role: refreshRes.data.role,
              phone: refreshRes.data.phone,
              university: refreshRes.data.university,
              position: refreshRes.data.position,
            };

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Si no se pudo refrescar el token, cerramos sesión
            setUser(null);
            setIsAuthenticated(false);
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    verifyJWT();
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn,
      logOut,
      updateUser,
      user,
      isAuthenticated,
      isLoading,
    }}>
      {!isLoading ? children : <div>Loading...</div>} {/* Solo muestra los hijos si la carga se completó */}
    </AuthContext.Provider>
  );
};
