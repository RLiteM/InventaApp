import React from 'react';
import '../../styles/DashboardV2.css';

// Importar los nuevos componentes del dashboard
import ResumenKPIs from '../../components/dashboard/ResumenKPIs';
import AlertasCriticas from '../../components/dashboard/AlertasCriticas';
import MovimientosRecientes from '../../components/dashboard/MovimientosRecientes';
import TopProductosChart from '../../components/dashboard/TopProductosChart';
import TopClientesList from '../../components/dashboard/TopClientesList';
import TendenciasVentasChart from '../../components/dashboard/TendenciasVentasChart';
import ValorPorCategoriaChart from '../../components/dashboard/ValorPorCategoriaChart';

export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <ResumenKPIs />
      <AlertasCriticas />
      <MovimientosRecientes />
      <TopProductosChart />
      <TopClientesList />
      <TendenciasVentasChart />
      <ValorPorCategoriaChart />
    </div>
  );
}