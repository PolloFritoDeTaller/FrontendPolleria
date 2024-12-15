import axios from './axios.js';
import { API } from './conf/routeApi.js';

export const registerIngredientRequest = (ingredient) => 
    axios.post(`${API}/ingredients/register`, ingredient);

export const getAllIngredientsRequest = () => 
    axios.get(`${API}/ingredients/getIngredients`);

export const getIngredientRequest = (id) => 
    axios.get(`${API}/ingredients/getIngredient/${id}`);