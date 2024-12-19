import axios from "./axios.js";
import Cookies from 'js-cookie';
import { API } from "./conf/routeApi.js";

// Función para hacer login
export const loginRequest = async (data) => {
  console.log("Enviando solicitud de login con:", data);
  try {
    const response = await axios.post(`${API}/login`, data);
    console.log("Respuesta de login:", response);
    return response;
  } catch (error) {
    console.error('Error en loginRequest:', error.response?.data || error.message);
    throw error; // Lanza el error para ser manejado en el frontend
  }
};

// Función para hacer logout
export const logoutRequest = () => {
  console.log("Logout realizado");
  return axios.post(`${API}/logout`);
};

// Función para validar el token de acceso
export const validateTokenRequest = async () => {
  try {
    const response = await axios.get(`${API}/verify-token`);
    console.log("Token válido:", response);
    return response;
  } catch (error) {
    console.error('Error en validateTokenRequest:', error.response?.data || error.message);
    throw error;  // Lanza el error para ser manejado en el frontend
  }
};

// Función para validar la contraseña
export const validatePasswordRequest = user => {
  console.log("Validando contraseña para el usuario:", user);
  return axios.post(`${API}/verifyPassword`, user);
};

// Función para actualizar los datos del usuario
export const updateUserRequest = async (updatedUser) => {
  console.log("Actualizando usuario:", updatedUser);
  try {
    const response = await axios.put(`/api/users/${updatedUser._id}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario', error);
    throw new Error("Error al actualizar el usuario", error);
  }
};

// Función para solicitar un nuevo token usando el refresh token
export const refreshTokenRequest = async () => {
  const refreshToken = Cookies.get('refreshToken');  // Obtener el refreshToken de las cookies
  if (!refreshToken) {
    console.error('No se encontró el refreshToken');
    throw new Error('No se encontró el refreshToken');
  }

  console.log("Enviando solicitud para refrescar el token con refreshToken:", refreshToken);
  try {
    const response = await axios.post(`${API}/refresh-token`, { refreshToken });
    console.log("Respuesta de refreshToken:", response);
    
    // Almacenar el nuevo token en las cookies
    Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
    Cookies.set('refreshToken', response.data.refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
    
    return response.data;
  } catch (error) {
    console.error('Error en refreshTokenRequest:', error.response?.data || error.message);
    throw error;  // Lanza el error para manejarlo en el frontend
  }
};

// Función para registrar un nuevo usuario
export const registerRequest = async (newUser) => {
  console.log("Registrando nuevo usuario:", newUser);
  try {
    const response = await axios.post(`${API}/register`, newUser);
    return response.data; // Retorna los datos proporcionados por el backend
  } catch (error) {
    console.error('Error en registerRequest:', error.response?.data || error.message);
    throw error; // Lanza el error para manejarlo en el frontend
  }
};
