
import apiClient from './apiClient';

export const createAjusteInventario = async (ajusteData) => {
  const response = await apiClient.post('/ajustes-inventario', ajusteData);
  return response.data;
};

export const getProductos = async () => {
  const response = await apiClient.get('/productos');
  return response.data;
};

export const getLotes = async () => {
  const response = await apiClient.get('/lotes');
  return response.data;
};
