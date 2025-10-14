import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAlertas } from '../../api/dashboardApi';

const AlertasCriticas = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['alertas'], queryFn: getAlertas });

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando alertas...</div>;
  if (error) return <div className="dashboard-card error-placeholder">Error al cargar alertas</div>;

  const { productosStockCritico = [], lotesProximosACaducar = [] } = data || {};

  return (
    <div className="dashboard-card alertas-criticas">
      <h2>Alertas Críticas</h2>
      <div className="alertas-section">
        <h4>Stock Crítico</h4>
        {productosStockCritico.length > 0 ? (
          <ul>
            {productosStockCritico.map(p => (
              <li key={p.productoId}>{p.productoNombre} ({p.stockActual}/{p.stockMinimo})</li>
            ))}
          </ul>
        ) : (
          <p>No hay productos con stock crítico.</p>
        )}
      </div>
      <div className="alertas-section">
        <h4>Lotes Próximos a Caducar</h4>
        {lotesProximosACaducar.length > 0 ? (
          <ul>
            {lotesProximosACaducar.map(l => (
              <li key={l.loteId}>{l.productoNombre} (Vence: {l.fechaCaducidad})</li>
            ))}
          </ul>
        ) : (
          <p>No hay lotes próximos a caducar.</p>
        )}
      </div>
    </div>
  );
};

export default AlertasCriticas;
