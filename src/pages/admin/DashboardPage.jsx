import React from 'react';
import '../../styles/DashboardV2.css';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componentes del dashboard
import ResumenKPIs from '../../components/dashboard/ResumenKPIs';
import AlertasCriticas from '../../components/dashboard/AlertasCriticas';
import MovimientosRecientes from '../../components/dashboard/MovimientosRecientes';
import TopProductosChart from '../../components/dashboard/TopProductosChart';
import TopClientesList from '../../components/dashboard/TopClientesList';
import TendenciasVentasChart from '../../components/dashboard/TendenciasVentasChart';
import ValorPorCategoriaChart from '../../components/dashboard/ValorPorCategoriaChart';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      {/* === FILA 1: KPIs PRINCIPALES === */}
      <section className="dashboard-row resumen">
        <ResumenKPIs />
      </section>

      {/* === FILA 2: ALERTAS, MOVIMIENTOS E INVENTARIO === */}
      <section className="dashboard-row alertas-movimientos">
        <div className="dashboard-card alertas">
          <AlertasCriticas />
        </div>
        <div className="dashboard-card movimientos">
          <MovimientosRecientes />
        </div>
        <div className="dashboard-card inventario">
          <ValorPorCategoriaChart />
        </div>
      </section>

      {/* === FILA 3: GRÁFICAS PRINCIPALES === */}
      <section className="dashboard-row graficas-principales">
        <div className="dashboard-card tendencias">
          <TendenciasVentasChart />
        </div>
        <div className="dashboard-card productos">
          <TopProductosChart />
        </div>
        <div className="dashboard-card clientes-card">
          <TopClientesList />
        </div>
      </section>

      {/* === BOTÓN FLOTANTE NUEVA VENTA === */}
      <button
        className="fab-nueva-venta"
        onClick={() => navigate('/nueva-venta')}
        title="Nueva Venta"
      >
        <ShoppingCart size={24} />
      </button>

    </div>
  );
}
