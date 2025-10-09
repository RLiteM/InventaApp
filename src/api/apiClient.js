import axios from "axios";

const api = axios.create({
  baseURL: "https://inventagt-production.up.railway.app/api",
});

// Interceptor para añadir el token de autenticación a las cabeceras
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const buscarProductosPorNombreSku = (searchTerm) => {
  return api.get('/productos/nombre-sku', { params: { q: searchTerm } });
};


export default api;