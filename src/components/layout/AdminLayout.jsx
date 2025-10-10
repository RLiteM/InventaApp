import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from 'react-icons/fi'; // Iconos para el menú
import "../../styles/AdminLayout.css";

// Componente para el encabezado que mostrará el botón de menú en móvil
function AdminHeader({ onToggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  
  // Genera un título legible a partir de la ruta
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'dashboard') return 'Dashboard';
    if (path === 'nueva') {
        if(location.pathname.includes('compras')) return 'Nueva Compra';
        if(location.pathname.includes('ventas')) return 'Nueva Venta';
    }
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <header className="admin-header">
      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        {isSidebarOpen ? <FiX /> : <FiMenu />}
      </button>
      <h1 className="page-title">{getPageTitle()}</h1>
    </header>
  );
}

export default function AdminLayout({ user, onLogout }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isAdmin = user?.rol === 'Administrador';

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-is-open' : ''}`}>
      <aside className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Inventa</h2>
          <button className="sidebar-close-btn" onClick={toggleSidebar}><FiX /></button>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li><NavLink to="/dashboard" onClick={() => setIsSidebarOpen(false)}>Dashboard</NavLink></li>
            {isAdmin && <li><NavLink to="/admin/usuarios" onClick={() => setIsSidebarOpen(false)}>Usuarios</NavLink></li>}
            <li><NavLink to="/admin/proveedores" onClick={() => setIsSidebarOpen(false)}>Proveedores</NavLink></li>
            <li><NavLink to="/admin/clientes" onClick={() => setIsSidebarOpen(false)}>Clientes</NavLink></li>
            <li><NavLink to="/admin/categorias" onClick={() => setIsSidebarOpen(false)}>Categorías</NavLink></li>
            <li><NavLink to="/admin/compras/nueva" onClick={() => setIsSidebarOpen(false)}>Nueva Compra</NavLink></li>
            <li><NavLink to="/admin/ventas/nueva" onClick={() => setIsSidebarOpen(false)}>Nueva Venta</NavLink></li>
            <li><NavLink to="/cambiar-contrasena" onClick={() => setIsSidebarOpen(false)}>Cambiar Contraseña</NavLink></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </aside>
      
      {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}

      <main className="admin-content">
        <AdminHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="content-wrapper">
            <Outlet />
        </div>
      </main>
    </div>
  );
}