import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiUsers } from 'react-icons/fi';
import { ShoppingCart } from 'lucide-react';
import '../../styles/DashboardV2.css'; // Reutilizamos algunos estilos
import VendedorResumenHoy from '../../components/dashboard/VendedorResumenHoy';

// Componentes que un vendedor podría necesitar
import TopClientesList from '../../components/dashboard/TopClientesList';
import MovimientosRecientes from '../../components/dashboard/MovimientosRecientes';

export default function VendedorDashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard del Vendedor</h1>
      {user && <VendedorResumenHoy usuarioId={user.usuarioId} />}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Acciones Rápidas</h2>
          <div className="quick-actions-container">
            <Link to="/admin/ventas/nueva" className="quick-action-btn primary">
              <FiPlus />
              <span>Registrar Nueva Venta</span>
            </Link>
            <Link to="/admin/clientes" className="quick-action-btn secondary">
              <FiUsers />
              <span>Gestionar Clientes</span>
            </Link>
          </div>
        </div>
        <TopClientesList />
        <MovimientosRecientes />
      </div>
      {/* === BOTÓN FLOTANTE NUEVA VENTA === */}
      <Link 
        to="/admin/ventas/nueva" 
        title="Nueva Venta" 
        className="fab-nueva-venta"
      >
        <ShoppingCart size={28} />
      </Link>
    </div>
  );
}
