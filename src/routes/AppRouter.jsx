import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Layouts y Páginas
import AdminLayout from "../components/layout/AdminLayout";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import DashboardPage from "../pages/admin/DashboardPage";
import GestionUsuariosPage from "../pages/admin/GestionUsuariosPage";
import CrearUsuarioPage from "../pages/admin/CrearUsuarioPage";
import EditarUsuarioPage from "../pages/admin/EditarUsuarioPage";
import GestionProveedoresPage from "../pages/admin/GestionProveedoresPage";
import CrearProveedorPage from "../pages/admin/CrearProveedorPage";
import EditarProveedorPage from "../pages/admin/EditarProveedorPage";
import RegistroCompraPage from "../pages/admin/RegistroCompraPage";
import RegistroVentaPage from "../pages/admin/RegistroVentaPage";
import GestionClientesPage from "../pages/admin/GestionClientesPage";
import CrearClientePage from "../pages/admin/CrearClientePage";
import EditarClientePage from "../pages/admin/EditarClientePage";
import ResetearPassword from "../pages/ResetearPassword";
import CambiarContrasenaPage from "../pages/CambiarContrasenaPage";
import GestionCategoriasPage from "../pages/admin/GestionCategoriasPage";
import GestionProductosPage from "../pages/admin/GestionProductosPage";

// Componente para proteger las rutas de Admin
function AdminRoutes({ user, onLogout }) {
  // Permitir acceso a Administradores y Vendedores
  if (user?.rol === 'Administrador' || user?.rol === 'Vendedor') {
    return <AdminLayout onLogout={onLogout} user={user} />;
  }
  // Para otros roles o si no hay rol, se muestra la página de placeholder
  return <PlaceholderPage user={user} />;
}

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      localStorage.clear();
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  if (isAuthLoading) {
    return null; // Evita parpadeos durante la carga inicial
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLoginSuccess={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/resetear-password" element={<ResetearPassword />} />
        <Route path="/cambiar-contrasena" element={<CambiarContrasenaPage />} />

        {/* Rutas Protegidas */}
        <Route 
          path="/" 
          element={user ? <Outlet /> : <Navigate to="/login" replace />}
        >
          <Route element={<AdminRoutes user={user} onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="admin/usuarios" element={<GestionUsuariosPage />} />
            <Route path="admin/usuarios/nuevo" element={<CrearUsuarioPage />} />
            <Route path="admin/usuarios/editar/:id" element={<EditarUsuarioPage />} />
            <Route path="admin/proveedores" element={<GestionProveedoresPage />} />
            <Route path="admin/proveedores/nuevo" element={<CrearProveedorPage />} />
            <Route path="admin/proveedores/editar/:id" element={<EditarProveedorPage />} />
            <Route path="admin/compras/nueva" element={<RegistroCompraPage />} />
            <Route path="admin/ventas/nueva" element={<RegistroVentaPage />} />

            {/* Rutas de Clientes */}
            <Route path="admin/clientes" element={<GestionClientesPage />} />
            <Route path="admin/clientes/nuevo" element={<CrearClientePage />} />
            <Route path="admin/clientes/editar/:id" element={<EditarClientePage />} />

            {/* Ruta de Categorías */}
            <Route path="admin/categorias" element={<GestionCategoriasPage />} />

            {/* Ruta de Productos */}
            <Route path="admin/productos" element={<GestionProductosPage />} />

            {/* Redirección por defecto si está logueado */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
