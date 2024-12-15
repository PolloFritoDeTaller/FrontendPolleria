import axios from './axios.js';
import { API } from './conf/routeApi.js';

export const registerSaleRequest = (sale) => axios.post(`${API}/sales/registerSale`, sale);

export const getAllSalesRequest = () => axios.get(`${API}/sales`);

export const getTodaySalesRequest = () => axios.get(`${API}/sales/today`);

export const getSaleRequest = id => axios.get(`${API}/sales/${id}`);

export const getSalesByDateRequest = (date) => {
    return axios.get(`${API}/sales/date/${date}`);
  };
export const getSalesByHourRequest =  (startTime, endTime) => {
    return axios.get(`${API}/sales/hour/${startTime}/${endTime}`);
  
  };