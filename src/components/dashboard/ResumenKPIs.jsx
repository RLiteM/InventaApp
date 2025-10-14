import React from 'react';
import { useQuery } from 'react-query';
import { getResumen } from '../../api/dashboardApi';

const KpiCard = ({ title, value, icon }) => (
  <div className="kpi">
    <span className="kpi-icon">{icon}</span>
    <div className="kpi-info">
      <span className="kpi-value">{value}</span>
      <span className="kpi-title">{title}</span>
    </div>
  </div>
);

const ResumenKPIs = () => {
  const { data, error, isLoading } = useQuery('resumen', getResumen);

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando resumen...</div>;
  
  if (error || !data) return <div className="dashboard-card error-placeholder">Error al cargar resumen</div>;

  const formatCurrency = (value) => 
    `Q ${(value ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="dashboard-card resumen-kpis">
      <h2>Resumen General</h2>
      <div className="kpi-grid">
        <KpiCard title="Total Productos" value={data.totalProductos ?? 0} icon="📦" />
        <KpiCard title="Stock Total" value={data.stockTotal ?? 0} icon="📊" />
        <KpiCard title="Valor Inventario" value={formatCurrency(data.valorInventario)} icon="💰" />
        <KpiCard title="Ventas Históricas" value={formatCurrency(data.totalVentasHistorico)} icon="🛒" />
        <KpiCard title="Ganancia Histórica" value={formatCurrency(data.gananciaBrutaHistorica)} icon="📈" />
        <KpiCard title="Total Clientes" value={data.totalClientes ?? 0} icon="👥" />
      </div>
    </div>
  );
};

export default ResumenKPIs;
