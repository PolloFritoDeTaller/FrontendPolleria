import axios from "axios";
import { API } from "./conf/routeApi.js";

const instance = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Agregar interceptores para debugging
instance.interceptors.request.use(
    (config) => {
        console.log('Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Axios Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        return Promise.reject(error);
    }
);

export default instance;