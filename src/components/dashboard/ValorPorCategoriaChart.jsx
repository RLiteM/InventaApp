import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategorias } from '../../api/dashboardApi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeContext } from '../../context/ThemeProvider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const ValorPorCategoriaChart = () => {
  const { data: categorias = [], error, isLoading } = useQuery({ queryKey: ['categorias'], queryFn: getCategorias });
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando gráfico...</div>;
  if (error) return <div className="dashboard-card error-placeholder">Error al cargar gráfico</div>;

  return (
    <div className="dashboard-card valor-categoria-chart">
      <h2>Valor de Inventario por Categoría</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categorias}
            dataKey="valorInventario"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {categorias.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `Q ${value.toLocaleString('es-GT')}`}
                   contentStyle={{ backgroundColor: isDark ? '#1a2e2b' : '#f9fafb', color: isDark ? '#f7fafc' : '#1a202c', border: 'none', borderRadius: 8 }} />
          <Legend wrapperStyle={{ color: isDark ? '#f7fafc' : '#1a202c' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValorPorCategoriaChart;
