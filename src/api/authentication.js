import axios from "./axios.js";
import { API } from "./conf/routeApi.js";

// Función para hacer login
export const loginRequest = data => axios.post(`${API}/login`, data);

// Función para hacer logout
export const logoutRequest = () => axios.post(`${API}/logout`);

// Función para validar el token de acceso
export const validateTokenRequest = async () => {
  try {
    const response = await axios.get(`${API}/verify-token`);
    console.log("resp",response)
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
    throw new Error("Error al actualizar el usuario", error);
  }
};

// NUEVA FUNCIÓN: Solicitar un nuevo token usando el refresh token
export const refreshTokenRequest = async (refreshToken) => {
  try {
    const response = await axios.post(`${API}/refresh-token`, { refreshToken });
    return response.data;
  } catch (error) {
    console.error('Error en refreshTokenRequest:', error.response?.data || error.message);
    throw error;  // Lanza el error para manejarlo en el frontend
  }
};

export const registerRequest = async (newUser) => {
  try {
    const response = await axios.post(`${API}/register`, newUser);
    return response.data; // Retorna los datos proporcionados por el backend
  } catch (error) {
    console.error('Error en registerRequest:', error.response?.data || error.message);
    throw error; // Lanza el error para que pueda manejarse en el frontend
  }
};
