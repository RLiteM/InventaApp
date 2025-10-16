import React from 'react';
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
      {/* Fila 1 - KPIs principales */}
      <section className="dashboard-row resumen">
        <ResumenKPIs />
      </section>

      {/* Fila 2 - Alertas y Movimientos */}
      <section className="dashboard-row alertas-movimientos">
        <div className="dashboard-card alertas">
          <AlertasCriticas />
        </div>
        <div className="dashboard-card movimientos">
          <MovimientosRecientes />
        </div>
      </section>

      {/* Fila 3 - Gráficas principales */}
      <section className="dashboard-row graficas-principales">
        <div className="dashboard-card tendencias">
          <TendenciasVentasChart />
        </div>
        <div className="dashboard-card productos">
          <TopProductosChart />
        </div>
        <div className="dashboard-card categorias">
          <ValorPorCategoriaChart />
        </div>
      </section>

      {/* Fila 4 - Top Clientes */}
      <section className="dashboard-row clientes">
        <div className="dashboard-card clientes-card">
          <TopClientesList />
        </div>
      </section>
    </div>
  );
}
