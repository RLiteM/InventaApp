import { useState, useEffect } from 'react';
import api from '../../api/apiClient';
import '../../styles/Dashboard.css';

// Componente para una tarjeta de estadística individual
const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-info">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, salesCount: 0, salesTotal: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Realizar llamadas a la API en paralelo para eficiencia
        const [productsResponse, salesResponse] = await Promise.all([
          api.get('/productos'),
          api.get('/ventas')
        ]);

        const products = productsResponse.data;
        const sales = salesResponse.data;

        // Calcular el monto total de ventas
        const totalAmount = sales.reduce((sum, sale) => sum + sale.montoTotal, 0);

        setStats({
          products: products.length,
          salesCount: sales.length,
          salesTotal: totalAmount,
        });

      } catch (err) {
        setError('No se pudo cargar la información del dashboard. Intente de nuevo más tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div>Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="stats-container">
        <StatCard 
          title="Total de Productos" 
          value={stats.products} 
          icon="📦"
        />
        <StatCard 
          title="Número de Ventas" 
          value={stats.salesCount} 
          icon="🛒"
        />
        <StatCard 
          title="Ingresos Totales" 
          value={`Q ${stats.salesTotal.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="💰"
        />
      </div>
      {/* Aquí se podrían añadir más componentes, como gráficos o tablas de datos recientes */}
    </div>
  );
}
