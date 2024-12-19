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

  // Use Effect para actualizar el estado cuando los tokens cambian
  useEffect(() => {
    const token = Cookies.get('token');
    const refreshToken = Cookies.get('refreshToken');
    setAuthState({
      token,
      refreshToken,
      isAuthenticated: !!token, // Se considera autenticado si hay un token
    });
  }, []);

  // Función para manejar login
  const login = async (credentials) => {
    try {
      const response = await loginRequest(credentials);
      Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
      Cookies.set('refreshToken', response.data.refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
      setAuthState({
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  // Función para manejar logout
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    setAuthState({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    logoutRequest(); // Puedes llamar a tu API de logout si es necesario
  };

  // Función para refrescar el token
  const refreshToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      try {
        const response = await refreshTokenRequest(refreshToken);
        Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
        setAuthState({
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error al refrescar el token:', error);
      }
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
