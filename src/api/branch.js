// src/api/branch.js
import axios from './axios.js'
import { API } from './conf/routeApi.js';

export const getBranchsRequest = () => axios.get(`${API}/branches`);
export const deleteBranchRequest = (id) => axios.delete(`${API}/branches/${id}`);
export const editBranchRequest = (id, data) => axios.put(`${API}/branches/${id}`, data);

export const addImageToBranchesRequest = async (data) => {
  return await axios.patch(`${API}/branches/add-image`, {
    imageUrl: data.imageUrl,
    branchIds: data.branchIds
  });
};

export const addTextToBranchesRequest = async (textContent, branchIds) => {
  try {
    const response = await axios.patch(`${API}/branches/branch-text`, {
      textContent,
      branchIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar el texto a las sucursales:', error);
    throw error;
  }
};

export const getBranchImagesRequest = (id) => {
  return axios.get(`${API}/branches/${id}/images`)
    .then(response => response.data)  // Retorna los datos de la respuesta
    .catch(error => {
      console.error('Error al obtener las imágenes de la sucursal:', error);
      throw error;  // Lanzamos el error para que el componente o función pueda manejarlo
    });
};

export const getBranchTextsRequest = (id) => {
  console.log("IDDDD", id)
  return axios.get(`${API}/branches/${id}/texts`)
    .then(response => response.data)  // Retorna los datos de la respuesta
    .catch(error => {
      console.error('Error al obtener los textos de la sucursal:', error);
      throw error;  // Lanzamos el error para que el componente o función pueda manejarlo
    });
};

export const getBranchDetailsRequest = (id) => {
  return axios.get(`${API}/branches/branch/${id}`)
}

export const deleteBranchText = (branchId, textId) => {
  return axios.delete(`${API}/branches/${branchId}/text/${textId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error al eliminar el texto:', error);
      throw error;  
    });
};

export const deleteBranchImage = (branchId, imageId) => {
  return axios.delete(`${API}/branches/${branchId}/image/${imageId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error al eliminar la imagen:', error);
      throw error;  // Lanzamos el error para manejarlo en el componente
    });
};


export const addProductToBranchRequest = (data) => axios.post(`${API}/branch/products/addProduct`, data);

export const getProductsByBranchRequest = (nameBranch) => {
  if (!nameBranch) {
      return Promise.reject(new Error('Branch name is required'));
  }
  
  // Enviar el nombre exactamente como está
  return axios.post(`${API}/branch/products/getProducts`, {
      nameBranch: nameBranch
  });
};
  
export const editProductRequest = (id, data) => axios.put(`${API}/branch/products/editProduct/${id}`, data);

// Solicitud para eliminar un producto
export const deleteProductRequest = (id) => axios.delete(`${API}/branch/products/deleteProduct/${id}`);


export const addSaleToBranchRequest = (data) => axios.post(`${API}/branch/sales/addSale`, data);

export const getSalesByBranchRequest = (nameBranch) => axios.post(`${API}/branch/sales/getSales`, { "nameBranch": nameBranch });

export const getTodaySalesByBranchRequest = (nameBranch) => axios.post(`${API}/branch/sales/getTodaySales`, { "nameBranch": nameBranch });

export const getSalesByDateRequest = (nameBranch, date) => 
  axios.get(`${API}/branch/sales/getByDate/${nameBranch}/${date}`);

export const getWeeklyProfitsByBranchRequest = (nameBranch) => 
  axios.get(`${API}/branch/sales/weeklyProfits/${nameBranch}`);

export const addEmployeeToBranchRequest = (data) => axios.post(`${API}/branch/employees/addEmployee`, data);

export const getEmployeesByBranchRequest = (branchName) => {
  // Codificar el nombre de la sucursal para manejar espacios y caracteres especiales
  const encodedBranchName = encodeURIComponent(branchName);
  return axios.get(`${API}/branch/employees/getEmployeesByBranch/${encodedBranchName}`);
};

// Solicitud para obtener un empleado por ID
export const getEmployeeByIdRequest = (id) => axios.get(`${API}/branch/employees/getEmployeeById/${id}`);

// Solicitud para obtener empleados con filtros
export const getEmployeesWithFiltersRequest = (branchName, filters) => {
  return axios.get(`${API}/branch/employees/getEmployeesWithFilters`, {
    params: { branchName, ...filters }
  });
};
// Solicitud para eliminar un empleado
export const deleteEmployeeRequest = (id) => axios.delete(`${API}/branch/employees/deleteEmployee/${id}`);
// Solicitud para editar un empleado
export const editEmployeeRequest = (id, data) => axios.put(`${API}/branch/employees/editEmployee/${id}`, data);

// Funciones de inventario relacionadas con sucursales
export const addInventoryToBranchRequest = (data) =>
  axios.post(`${API}/branch/inventory/addInventory`, data);

export const closeInventoryToBranchRequest = (data) =>
  axios.post(`${API}/branch/inventory/closeInventory`, data);

export const getDailyInventoryByBranchRequest = (nameBranch) =>
  axios.get(`${API}/branch/inventory/branch/${nameBranch}`);

export const getCurrentDayInventoryByBranchRequest = (nameBranch) =>
  axios.get(`${API}/branch/inventory/current/${nameBranch}`);

export const getInventoryByDateAndBranchRequest = (nameBranch, date) =>
  axios.get(`${API}/branch/inventory/date/${nameBranch}/${date}`);

export const getInventoryByIdRequest = (nameBranch, id) =>
  axios.get(`${API}/branch/inventory/branch/${nameBranch}/${id}`);

export const updateBranchInventoryRequest = (id, data) =>
  axios.put(`${API}/branch/inventory/update/${id}`, data);

export const getInventoryStatsByBranchRequest = (nameBranch) =>
  axios.get(`${API}/branch/inventory/stats/${nameBranch}`);

// Ingredientes en sucursales
export const registerIngredientToBranchRequest = (data) =>
  axios.post(`${API}/branch/ingredients/register`, data);

export const getIngredientsByBranchRequest = (nameBranch) =>
  axios.get(`${API}/branch/ingredients/getIngredientsByBranch/${nameBranch}`);

export const updateIngredientInBranchRequest = (id, data) =>
  axios.put(`${API}/branch/ingredients/updateIngredient/${id}`, data);

export const removeIngredientFromBranchRequest = (data) =>
  axios.delete(`${API}/branch/ingredients/removeIngredient`, { data });

export const updateIngredientStockInBranchRequest = (data) =>
  axios.post(`${API}/branch/ingredients/updateStock`, data);

// Recetas de productos
export const updateProductRecipeRequest = (productId, data) =>
  axios.put(`${API}/branch/products/updateRecipe/${productId}`, data);