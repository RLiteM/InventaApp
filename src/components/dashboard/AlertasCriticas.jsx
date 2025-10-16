import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAlertas } from '../../api/dashboardApi';

const AlertasCriticas = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['alertas'], queryFn: getAlertas });

  if (isLoading) return <div className="alertas-loading">Cargando alertas...</div>;
  if (error) return <div className="alertas-error">Error al cargar alertas</div>;

  const { productosStockCritico = [], lotesProximosACaducar = [] } = data || {};

  return (
    <div className="alertas-container">
      <h2 className="alertas-title">Alertas Críticas</h2>

      {/* Tarjeta Stock Crítico */}
      <div className="alerta-card stock-card">
        <h3><span className="alert-icon">⚠️</span> Stock Crítico</h3>
        {productosStockCritico.length > 0 ? (
          <div className="chips-container">
            {productosStockCritico.map(p => (
              <span key={p.productoId} className="alert-chip stock-critico">
                {p.productoNombre} ({p.stockActual}/{p.stockMinimo})
              </span>
            ))}
          </div>
        ) : (
          <p className="alertas-empty">No hay productos con stock crítico.</p>
        )}
      </div>

      {/* Tarjeta Lotes Próximos a Caducar */}
      <div className="alerta-card lote-card">
        <h3><span className="alert-icon">⏰</span> Lotes Próximos a Caducar</h3>
        {lotesProximosACaducar.length > 0 ? (
          <div className="chips-container">
            {lotesProximosACaducar.map(l => (
              <span key={l.loteId} className="alert-chip lote-proximo">
                {l.productoNombre} (Vence: {new Date(l.fechaCaducidad).toLocaleDateString()})
              </span>
            ))}
          </div>
        ) : (
          <p className="alertas-empty">No hay lotes próximos a caducar.</p>
        )}
      </div>
    </div>
  );
};

export default AlertasCriticas;
