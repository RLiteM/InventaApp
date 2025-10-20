import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import '../../styles/DashboardV2.css';

// Componentes del dashboard
import ResumenKPIs from '../../components/dashboard/ResumenKPIs';
import AlertasCriticas from '../../components/dashboard/AlertasCriticas';
import MovimientosRecientes from '../../components/dashboard/MovimientosRecientes';
import TopProductosChart from '../../components/dashboard/TopProductosChart';
import TopClientesList from '../../components/dashboard/TopClientesList';
import TendenciasVentasChart from '../../components/dashboard/TendenciasVentasChart';
import ValorPorCategoriaChart from '../../components/dashboard/ValorPorCategoriaChart';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Panel de Control</h1>
      </header>

      {/* === FILA 1: KPIs PRINCIPALES === */}
      <section className="dashboard-row resumen">
        <ResumenKPIs />
      </section>

      {/* === FILA 2: ALERTAS Y MOVIMIENTOS === */}
      <section className="dashboard-row alertas-movimientos">
        <div className="dashboard-card alertas" style={{ flex: '1 1 300px' }}>
          <AlertasCriticas />
        </div>
        <div className="dashboard-card movimientos" style={{ flex: '2 1 400px' }}>
          <MovimientosRecientes />
        </div>
      </section>

      {/* === FILA 3: TENDENCIAS Y TOP PRODUCTOS === */}
      <section className="dashboard-row graficas-principales">
        <div className="dashboard-card tendencias" style={{ flex: '1.8 1 0' }}>
          <TendenciasVentasChart />
        </div>
        <div className="dashboard-card productos" style={{ flex: '1.2 1 0' }}>
          <TopProductosChart />
        </div>
      </section>

      {/* === FILA 4: VALOR INVENTARIO Y TOP CLIENTES === */}
      <section className="dashboard-row fila-cuarta">
        <div className="dashboard-card inventario" style={{ flex: '1 1 300px' }}>
          <ValorPorCategoriaChart />
        </div>
        <div className="dashboard-card clientes-card" style={{ flex: '2 1 400px' }}>
          <TopClientesList />
        </div>
      </section>

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
