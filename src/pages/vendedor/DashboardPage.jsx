import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DashboardV2.css'; // Reutilizamos algunos estilos

// Componentes que un vendedor podría necesitar
import TopClientesList from '../../components/dashboard/TopClientesList';
import MovimientosRecientes from '../../components/dashboard/MovimientosRecientes';

export default function VendedorDashboardPage() {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h2>Acciones Rápidas</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/admin/ventas/nueva" className="btn-primary">Registrar Nueva Venta</Link>
          <Link to="/admin/clientes" className="btn-secondary">Gestionar Clientes</Link>
        </div>
      </div>
      <TopClientesList />
      <MovimientosRecientes />
    </div>
  );
}
