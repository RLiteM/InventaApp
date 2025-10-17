import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  FiGrid, FiUsers, FiTruck, FiBriefcase, 
  FiTag, FiPackage, FiShoppingCart, FiDollarSign, FiLock, FiLogOut 
} from 'react-icons/fi';
import { TfiLayoutSidebarLeft } from 'react-icons/tfi';
import ThemeToggle from '../ThemeToggle';
import "../../styles/AdminLayout.css";

export default function AdminLayout({ user, onLogout }) {
  const navigate = useNavigate();
  
  // Leer el estado inicial desde localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  // Guardar el estado en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isAdmin = user?.rol === 'Administrador';

  return (
    <div className={`admin-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar fijo */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleCollapse}>
            <TfiLayoutSidebarLeft />
          </button>
          <h2 className="sidebar-brand">Inventa</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard"><FiGrid /><span className="link-text">Dashboard</span></NavLink>
          {isAdmin && <NavLink to="/admin/usuarios"><FiUsers /><span className="link-text">Usuarios</span></NavLink>}
          <NavLink to="/admin/proveedores"><FiTruck /><span className="link-text">Proveedores</span></NavLink>
          <NavLink to="/admin/clientes"><FiBriefcase /><span className="link-text">Clientes</span></NavLink>
          <NavLink to="/admin/categorias"><FiTag /><span className="link-text">Categorías</span></NavLink>
          <NavLink to="/admin/productos"><FiPackage /><span className="link-text">Productos</span></NavLink>
          {isAdmin && <NavLink to="/admin/compras/nueva"><FiDollarSign /><span className="link-text">Nueva Compra</span></NavLink>}
          <NavLink to="/admin/ventas/nueva"><FiShoppingCart /><span className="link-text">Nueva Venta</span></NavLink>
          <NavLink to="/cambiar-contrasena"><FiLock /><span className="link-text">Cambiar Contraseña</span></NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut />
            <span className="link-text">Cerrar Sesión</span>
          </button>
          <ThemeToggle isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* Contenido desplazable */}
      <main className="admin-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
