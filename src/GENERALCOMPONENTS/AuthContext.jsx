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

        Cookies.set("token", token, { expires: 1 });
        Cookies.set("refreshToken", refreshToken, { expires: 7 });

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
      console.log("logout");
      await logoutRequest();
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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
      const token = localStorage.getItem("token") || Cookies.get("token");
      const refreshToken = localStorage.getItem("refreshToken") || Cookies.get("refreshToken");

      if (!token || !refreshToken) {
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

            // Guardamos los nuevos tokens en localStorage y cookies
            Cookies.set("token", newToken, { expires: 1 });
            Cookies.set("refreshToken", newRefreshToken, { expires: 7 });
            localStorage.setItem("token", newToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            // Actualizamos los datos del usuario
            const userData = {
              name: refreshRes.data.name,
              email: refreshRes.data.email,
              role: refreshRes.data.role,
            };

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            setUser(null);
            setIsAuthenticated(false);
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        }
      } catch (error) {
        console.log("error catch");
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
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
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
