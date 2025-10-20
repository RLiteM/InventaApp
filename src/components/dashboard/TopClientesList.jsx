import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopClientes } from '../../api/dashboardApi';
import '../../styles/TopClientesList.css';

const TopClientesList = () => {
  const { data: topClientes = [], error, isLoading } = useQuery({
    queryKey: ['topClientes'],
    queryFn: getTopClientes,
  });

  if (isLoading) return <div className="top-clientes-card loading-placeholder">Cargando clientes...</div>;
  if (error) return <div className="top-clientes-card error-placeholder">Error al cargar clientes</div>;

  const formatCurrency = (value) =>
    `Q ${(value ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Para la barra de progreso: porcentaje relativo al cliente top
  const maxMonto = topClientes.length > 0 ? topClientes[0].montoTotalGastado : 1;

  const rankEmojis = ['🥇', '🥈', '🥉', '🏅', '🎖️'];

  return (
    <div className="top-clientes-card">
      <h2>Top 5 Clientes</h2>
      {topClientes.length > 0 ? (
        <div className="top-clientes-layout">
          {/* Principal */}
          {(() => {
            const c = topClientes[0];
            const porcentaje = Math.round(((c?.montoTotalGastado ?? 0) / maxMonto) * 100);
            return (
              <div className="top-client-main cliente-item cliente-1" key={c?.clienteId || 'top1'}>
                <div className="cliente-info">
                  <span className="cliente-rank">{rankEmojis[0]}</span>
                  <span className="cliente-nombre">{c?.nombreCliente}</span>
                </div>
                <div className="cliente-monto-bar">
                  <span className="cliente-monto">{formatCurrency(c?.montoTotalGastado)}</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${porcentaje}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Resto en 2 columnas */}
          <ol className="top-client-grid">
            {topClientes.slice(1).map((cliente, idx) => {
              const index = idx + 1; // 1..4
              const porcentaje = Math.round((cliente.montoTotalGastado / maxMonto) * 100);
              return (
                <li key={cliente.clienteId} className={`cliente-item cliente-${index + 1}`}>
                  <div className="cliente-info">
                    <span className="cliente-rank">{rankEmojis[index] || '⭐'}</span>
                    <span className="cliente-nombre">{cliente.nombreCliente}</span>
                  </div>
                  <div className="cliente-monto-bar">
                    <span className="cliente-monto">{formatCurrency(cliente.montoTotalGastado)}</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${porcentaje}%` }}></div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <p>No hay datos de clientes para mostrar.</p>
      )}
    </div>
  );
};

export default TopClientesList;
