import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTendencias } from '../../api/dashboardApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/DashboardV2.css';
import { ThemeContext } from '../../context/ThemeProvider';

const TendenciasVentasChart = () => {
  const { data: tendencias = [], error, isLoading } = useQuery({ queryKey: ['tendencias'], queryFn: getTendencias });
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando tendencias...</div>;
  if (error) return <div className="dashboard-card error-placeholder">Error al cargar tendencias</div>;

  return (
    <div className="dashboard-card tendencias-ventas-chart">
      <h2 className="chart-title">📈 Tendencias de Ventas (Últimos 12 Meses)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={tendencias}
          margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke={isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0'} />
          <XAxis dataKey="mes" tick={{ fill: isDark ? '#f7fafc' : '#4a5568', fontSize: 12 }} />
          <YAxis tick={{ fill: isDark ? '#f7fafc' : '#4a5568', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: isDark ? '#1a2e2b' : '#f9fafb', color: isDark ? '#f7fafc' : '#1a202c', borderRadius: '8px', border: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: isDark ? '#f7fafc' : '#1a202c' }}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: isDark ? '#f7fafc' : '#1a202c', fontWeight: 600 }} />
          <Line
            type="monotone"
            dataKey="totalVentas"
            stroke="#2b6cb0"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#2b6cb0' }}
            activeDot={{ r: 7 }}
            name="Ventas Totales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TendenciasVentasChart;
