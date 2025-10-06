import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../../styles/AdminLayout.css";

export default function AdminLayout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Inventa</h2>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/admin/usuarios">Usuarios</NavLink></li>
            <li><NavLink to="/admin/proveedores">Proveedores</NavLink></li>
            <li><NavLink to="/admin/compras/nueva">Nueva Compra</NavLink></li>
            {/* Agrega aquí más enlaces a medida que construyas las páginas */}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
