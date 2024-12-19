import axios from "./axios.js";
import Cookies from 'js-cookie';
import { API } from "./conf/routeApi.js";

// Función para hacer login
export const loginRequest = data => axios.post(`${API}/login`, data);

// Función para hacer logout
export const logoutRequest = () => axios.post(`${API}/logout`);

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
export const validatePasswordRequest = user => axios.post(`${API}/verifyPassword`, user);

// Función para actualizar los datos del usuario
export const updateUserRequest = async (updatedUser) => {
  console.log(updatedUser); // Verifica que el _id esté presente
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
  if (!refreshToken) throw new Error('No se encontró el refreshToken');

  try {
    const response = await axios.post(`${API}/refresh-token`, { refreshToken });
    // Almacenar el nuevo token en las cookies
    Cookies.set('token', response.data.token);
    Cookies.set('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (error) {
    console.error('Error en refreshTokenRequest:', error.response?.data || error.message);
    throw error;  // Lanza el error para manejarlo en el frontend
  }
};

// Función para registrar un nuevo usuario
export const registerRequest = async (newUser) => {
  try {
    const response = await axios.post(`${API}/register`, newUser);
    return response.data; // Retorna los datos proporcionados por el backend
  } catch (error) {
    console.error('Error en registerRequest:', error.response?.data || error.message);
    throw error; // Lanza el error para manejarlo en el frontend
  }
};
