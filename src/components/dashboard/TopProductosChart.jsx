import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopProductos } from '../../api/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ThemeContext } from '../../context/ThemeProvider';

const TopProductosChart = () => {
  const { data: topProductos = [], error, isLoading } = useQuery({ queryKey: ['topProductos'], queryFn: getTopProductos });
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const COLORS = ['#2b6cb0', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando gráfico...</div>;
  if (error) return <div className="dashboard-card error-placeholder">Error al cargar gráfico</div>;

  return (
    <div className="dashboard-card top-productos-chart">
      <h2>Top 5 Productos Más Vendidos</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProductos} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0'} />
          <XAxis dataKey="productoNombre" tick={{ fill: isDark ? '#f7fafc' : '#4a5568', fontSize: 12 }} />
          <YAxis tick={{ fill: isDark ? '#f7fafc' : '#4a5568', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: isDark ? '#1a2e2b' : '#f9fafb', color: isDark ? '#f7fafc' : '#1a202c', border: 'none', borderRadius: 8 }} />
          <Legend wrapperStyle={{ color: isDark ? '#f7fafc' : '#1a202c' }} />
          <Bar dataKey="totalUnidadesVendidas" name="Unidades Vendidas">
            {topProductos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductosChart;
