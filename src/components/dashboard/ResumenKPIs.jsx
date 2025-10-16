import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getResumen } from '../../api/dashboardApi';

const KpiCard = ({ title, value, icon, onClick }) => (
  <div className="kpi" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <span className="kpi-icon">{icon}</span>
    <div className="kpi-info">
      <span className="kpi-value">{value}</span>
      <span className="kpi-title">{title}</span>
    </div>
  </div>
);

const ResumenKPIs = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['resumen'], queryFn: getResumen });
  const navigate = useNavigate();

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando resumen...</div>;
  if (error || !data) return <div className="dashboard-card error-placeholder">Error al cargar resumen</div>;

  const formatCurrency = (value) => 
    `Q ${(value ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleProductosClick = (highlightStock = false) => {
    navigate('/admin/productos', { state: { highlightStock } });
  };

  return (
    <div className="dashboard-card resumen-kpis">
      <h2>Resumen General</h2>
      <div className="kpi-grid">
        <KpiCard 
          title="Total Productos" 
          value={data.totalProductos ?? 0} 
          icon="📦" 
          onClick={() => handleProductosClick(false)} 
        />
        <KpiCard 
          title="Stock Total" 
          value={data.stockTotal ?? 0} 
          icon="📊" 
          onClick={() => handleProductosClick(true)} 
        />
        <KpiCard title="Valor Inventario" value={formatCurrency(data.valorInventario)} icon="💰" />
        <KpiCard title="Ventas Históricas" value={formatCurrency(data.totalVentasHistorico)} icon="🛒" />
        <KpiCard title="Ganancia Histórica" value={formatCurrency(data.gananciaBrutaHistorica)} icon="📈" />
        <KpiCard 
          title="Total Clientes" 
          value={data.totalClientes ?? 0} 
          icon="👥" 
          onClick={() => navigate('/admin/clientes')} 
        />
      </div>
    </div>
  );
};

export default ResumenKPIs;
