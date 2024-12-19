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
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token") || localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCart();

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

        Cookies.set("token", token, { expires: 7 });  // Token expirando en 7 días
        Cookies.set("refreshToken", refreshToken, { expires: 30 }); // refreshToken expirando en 30 días

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
    } catch (e) {
      console.log("Error al cerrar sesión:", e);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
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

            // Guardamos los nuevos tokens en localStorage y cookies con tiempos de expiración extendidos
            Cookies.set("token", newToken, { expires: 7 });
            Cookies.set("refreshToken", newRefreshToken, { expires: 30 });
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
        console.error("Error al verificar JWT:", error);
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
