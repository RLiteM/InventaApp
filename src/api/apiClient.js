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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpiar datos de sesión
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      
      // Redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const buscarProductosPorNombreSku = (searchTerm) => {
  return api.get('/productos/nombre-sku', { params: { q: searchTerm } });
};



export const solicitarRecuperacion = (email) => {
  return api.post('/auth/solicitar-recuperacion', { email });
};

export const resetearPassword = (token, nuevaContrasena) => {
  return api.post('/auth/resetear-password', { token, nuevaContrasena });
};

export default api;