import React from 'react';
import { useQuery } from 'react-query';
import { getTopProductos } from '../../api/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopProductosChart = () => {
  const { data: topProductos = [], error, isLoading } = useQuery('topProductos', getTopProductos);

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando gráfico...</div>;
  if (error) return <div className="dashboard-card error-placeholder">Error al cargar gráfico</div>;

  return (
    <div className="dashboard-card top-productos-chart">
      <h2>Top 5 Productos Más Vendidos</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProductos} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productoNombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalUnidadesVendidas" fill="#8884d8" name="Unidades Vendidas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductosChart;
