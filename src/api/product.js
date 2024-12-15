import axios from './axios.js'
import { API } from './conf/routeApi.js';

export const registerProductRequest = (product) => axios.post(`${API}/products`, product);
  
export const getProductsRequest = () => axios.get(`${API}/products`);