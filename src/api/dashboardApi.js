import apiClient from './apiClient';

// 2.1. Resumen General
export const getResumen = async () => {
  const response = await apiClient.get('/dashboard/resumen');
  return response.data;
};

// 2.2. Alertas Críticas
export const getAlertas = async () => {
  const response = await apiClient.get('/dashboard/alertas');
  return response.data;
};

// 2.3. Movimientos Recientes
export const getMovimientos = async () => {
  const response = await apiClient.get('/dashboard/movimientos');
  return response.data;
};

// 2.4. Top 5 Productos
export const getTopProductos = async () => {
  const response = await apiClient.get('/dashboard/top-productos');
  return response.data;
};

// 2.5. Top 5 Clientes
export const getTopClientes = async () => {
  const response = await apiClient.get('/dashboard/top-clientes');
  return response.data;
};

// 2.6. Tendencias de Ventas
export const getTendencias = async () => {
  const response = await apiClient.get('/dashboard/tendencias');
  return response.data;
};

// 2.7. Valor por Categoría
export const getCategorias = async () => {
  const response = await apiClient.get('/dashboard/categorias');
  return response.data;
};
