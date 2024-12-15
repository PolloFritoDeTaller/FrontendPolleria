import axios from './axios.js';
import { API } from './conf/routeApi.js';

export const registerInventoryRequest = (inventory) => 
  axios.post(`${API}/inventory/registerInventory`, inventory);

export const getAllInventoriesRequest = () => 
  axios.get(`${API}/inventory`);

export const getInventoryRequest = (id) => 
  axios.get(`${API}/inventory/${id}`);