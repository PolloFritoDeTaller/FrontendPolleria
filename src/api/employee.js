import axios from "./axios";
import { API } from "./conf/routeApi";

// Registrar un empleado
export const registerEmployeeRequest = (formData) => {
  return axios.post(`${API}/employees`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getEmployeesRequest = () => axios.get(`${API}/employees`);