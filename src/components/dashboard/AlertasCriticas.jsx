import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAlertas } from '../../api/dashboardApi';

const AlertasCriticas = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['alertas'], queryFn: getAlertas });
  // Declare local state before any early returns to keep hook order stable
  const [showAllStock, setShowAllStock] = useState(false);
  const [showAllLotes, setShowAllLotes] = useState(false);

  if (isLoading) return <div className="alertas-loading">Cargando alertas...</div>;
  if (error) return <div className="alertas-error">Error al cargar alertas</div>;

  const { productosStockCritico = [], lotesProximosACaducar = [] } = data || {};
  const MAX_CHIPS = 10;
  const visibleStock = showAllStock ? productosStockCritico : productosStockCritico.slice(0, MAX_CHIPS);
  const visibleLotes = showAllLotes ? lotesProximosACaducar : lotesProximosACaducar.slice(0, MAX_CHIPS);

  return (
    <div className="alertas-container">
      <h2 className="alertas-title">Alertas Críticas</h2>

      {/* Tarjeta Stock Crítico */}
      <div className="alerta-card stock-card">
        <div className="alert-heading">
          <h3><span className="alert-icon">⚠️</span> Stock Crítico</h3>
          <span className="badge" aria-label={`Total: ${productosStockCritico.length}`}>{productosStockCritico.length}</span>
        </div>
        {productosStockCritico.length > 0 ? (
          <>
            <div className="chips-container" aria-live="polite">
              {visibleStock.map(p => (
                <span key={p.productoId} className="alert-chip stock-critico">
                  {p.productoNombre} ({p.stockActual}/{p.stockMinimo})
                </span>
              ))}
            </div>
            {productosStockCritico.length > MAX_CHIPS && (
              <button className="alert-toggle" onClick={() => setShowAllStock(s => !s)}>
                {showAllStock ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </>
        ) : (
          <p className="alertas-empty">No hay productos con stock crítico.</p>
        )}
      </div>

      {/* Tarjeta Lotes Próximos a Caducar */}
      <div className="alerta-card lote-card">
        <div className="alert-heading">
          <h3><span className="alert-icon">⏰</span> Lotes Próximos a Caducar</h3>
          <span className="badge" aria-label={`Total: ${lotesProximosACaducar.length}`}>{lotesProximosACaducar.length}</span>
        </div>
        {lotesProximosACaducar.length > 0 ? (
          <>
            <div className="chips-container" aria-live="polite">
              {visibleLotes.map(l => (
                <span key={l.loteId} className="alert-chip lote-proximo">
                  {l.productoNombre} (Vence: {new Date(l.fechaCaducidad).toLocaleDateString()})
                </span>
              ))}
            </div>
            {lotesProximosACaducar.length > MAX_CHIPS && (
              <button className="alert-toggle" onClick={() => setShowAllLotes(s => !s)}>
                {showAllLotes ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </>
        ) : (
          <p className="alertas-empty">No hay lotes próximos a caducar.</p>
        )}
      </div>
    </div>
  );
};

export default AlertasCriticas;
