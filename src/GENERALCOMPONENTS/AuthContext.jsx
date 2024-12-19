import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { loginRequest, refreshTokenRequest, logoutRequest } from '../api/authentication'; // Asume que estos son tus métodos de API

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: Cookies.get('token') || null,
    refreshToken: Cookies.get('refreshToken') || null,
    isAuthenticated: false,
  });

  // Verificar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const token = Cookies.get('token');
    const refreshToken = Cookies.get('refreshToken');
    if (token) {
      setAuthState({
        token,
        refreshToken,
        isAuthenticated: true,
      });
    } else {
      setAuthState({
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  }, []);  // Se ejecuta solo una vez cuando se monta el componente

  // Función para manejar login
  const login = async (credentials) => {
    try {
      const response = await loginRequest(credentials);
      const { token, refreshToken } = response.data;

      // Guardar los tokens en las cookies de forma segura
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict', path: '/' });
      Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true, sameSite: 'Strict', path: '/' });

      setAuthState({
        token,
        refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login Error:', error);
      setAuthState({
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  };

  // Función para manejar logout
  const logout = () => {
    // Eliminar los tokens de las cookies
    Cookies.remove('token', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    
    setAuthState({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });

    logoutRequest(); // Llamar a tu API de logout si es necesario
  };

  // Función para refrescar el token
  const refreshToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      console.log("No refresh token found");
      return;
    }

    try {
      const response = await refreshTokenRequest(refreshToken);
      const { token, refreshToken: newRefreshToken } = response.data;

      // Guardar los nuevos tokens en las cookies con las propiedades de seguridad
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict', path: '/' });
      Cookies.set('refreshToken', newRefreshToken, { expires: 7, secure: true, sameSite: 'Strict', path: '/' });

      setAuthState({
        token,
        refreshToken: newRefreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      setAuthState({
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
