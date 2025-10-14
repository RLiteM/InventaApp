import React from 'react';
import { useQuery } from 'react-query';
import { getCategorias } from '../../api/dashboardApi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const ValorPorCategoriaChart = () => {
  const { data: categorias = [], error, isLoading } = useQuery('categorias', getCategorias);

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
          <Tooltip formatter={(value) => `Q ${value.toLocaleString('es-GT')}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValorPorCategoriaChart;
