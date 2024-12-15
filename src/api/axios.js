import axios from "axios";
import { API } from "./conf/routeApi.js";

const instance = axios.create({
    baseURL: API,
    withCredentials: true, // Si es necesario para tu API
});

// Asegúrate de que esta línea esté presente para exportar la instancia por defecto
export default instance;
