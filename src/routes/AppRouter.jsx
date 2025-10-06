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

// Componente para proteger las rutas de Admin
function AdminRoutes({ user, onLogout }) {
  if (user?.rol === 'Administrador') {
    return <AdminLayout onLogout={onLogout} />;
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

        {/* Rutas Protegidas */}
        <Route 
          path="/*" 
          element={user ? <Outlet /> : <Navigate to="/login" replace />}
        >
          <Route element={<AdminRoutes user={user} onLogout={handleLogout} />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="admin/usuarios" element={<GestionUsuariosPage />} />
            <Route path="admin/usuarios/nuevo" element={<CrearUsuarioPage />} />
            <Route path="admin/usuarios/editar/:id" element={<EditarUsuarioPage />} />
            <Route path="admin/proveedores" element={<GestionProveedoresPage />} />
            <Route path="admin/proveedores/nuevo" element={<CrearProveedorPage />} />
            <Route path="admin/proveedores/editar/:id" element={<EditarProveedorPage />} />
            <Route path="admin/compras/nueva" element={<RegistroCompraPage />} />
            {/* Redirección por defecto si está logueado */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
