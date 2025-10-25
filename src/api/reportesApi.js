import apiClient from './apiClient';

export const getVentasDia = async () => {
  const response = await apiClient.get('/reportes/ventas-dia');
  return response.data;
};

export const getVentasDiaListado = async () => {
  const response = await apiClient.get('/reportes/ventas-dia/listado');
  return response.data;
};

export const getProductosResumenListado = async () => {
  const response = await apiClient.get('/reportes/productos/resumen-listado');
  return response.data;
};
