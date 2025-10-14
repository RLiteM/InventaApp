import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTendencias } from '../../api/dashboardApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TendenciasVentasChart = () => {
  const { data: tendencias = [], error, isLoading } = useQuery({ queryKey: ['tendencias'], queryFn: getTendencias });

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando tendencias...</div>;
  if (error) return <div className="dashboard-card error-placeholder">Error al cargar tendencias</div>;

  return (
    <div className="dashboard-card tendencias-ventas-chart">
      <h2>Tendencias de Ventas (Últimos 12 Meses)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={tendencias} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalVentas" stroke="#82ca9d" name="Ventas Totales" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TendenciasVentasChart;
